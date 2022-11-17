/*
 * @Author: Yoney Y (YuTianyuan)
 * @Date: 2021-12-18 13:18:21
 * @Last Modified by: Yoneyy (y.tianyuan)
 * @Last Modified time: 2022-04-24 15:13:50
 */

import strdm from "strdm";
import { isJSON, Store } from './helpers';

/**
 * Socket send params
 */
export type SocketIOSendParams =
  | Blob
  | string
  | ArrayBufferLike
  | ArrayBufferView;

/**
* Socket dispatch params
*/
export type SocketIODispatchParams =
  | SocketIOSendParams
  | object
  | Array<any>
  | number
  | boolean;


/**
* socket Send heart data
* 发送 socket 心跳包
*/
export type SocketHeartData = {
  /**
  * heart data
  * 心跳包数据
  */
  data: SocketIODispatchParams;

  /**
   * delay
   * 设置多久发送一次 单位 毫秒
   */
  delay: number;
};

/**
* Socket instance init params
*/
export interface SocketIOInitData {
  /**
   * Socket server URL
   * 要链接socket服务的URL
   */
  url: string | URL;

  /**
   * A protocol string or an array containing protocol strings
   * 一个协议字符串/一个包含协议字符串的数组。
   * 这些字符串用于指定子协议，这样单个服务器可以实现多个WebSocket子协议
   *（例如，您可能希望一台服务器能够根据指定的协议（protocol）处理不同类型的交互）。
   * 如果不指定协议字符串，则假定为空字符串。
   */
  protocols?: string | string[];

  /**
   * Socket send heart data
   * 发送 socket 心跳包
   */
  heart?: SocketHeartData;

  /**
   * Socket uniqueid
   * Socket 唯一身份ID
   */
  uniqueid?: string;

  /**
   * socket session
   * set socket session
   */
  session?: string | Record<string, any>;

  /**
   * Socket reconnect interval. default 1000ms
   * Socket 重连间隔 单位 ms 默认 1000ms
   */
  remillisecond?: number;

  /**
   * The maximum number of `Socket` reconnections. default 10
   * Socket 最大重连次数 默认 10 次
   */
  reconnectlimit?: number;
}

const SESSION_KEY = 'bws:session';

class SocketIO {

  private options: SocketIOInitData;
  private reconnectcount: number; // number of reconnections
  private remillisecond: number; // reconnection interval
  private reconnectlimit: number; // max limit for reconnection
  private lockreconnect: boolean = false; // lock the reconnect , avoid repeating heavy chains
  private disablereconnect: boolean = false; // whether to enable reconnection
  private timer: NodeJS.Timeout | number | null = null;
  private heart: SocketIOInitData['heart'] | null = null;
  private events: Record<string, (data: any) => void> = {};

  public ws: WebSocket;
  public readonly uniqueid: string | null; // socket uniqueid
  public session?: string | Array<any> | Record<string, any>; // socket session


  constructor(options: SocketIOInitData) {
    this.options = options;
    this.heart = options.heart;

    this.reconnectcount = 0;
    this.remillisecond = options?.remillisecond ?? 1000;
    this.reconnectlimit = options?.reconnectlimit ?? 10;

    this.session = options.session ?? Store.getItem(SESSION_KEY);
    this.ws = new WebSocket(options.url, options.protocols);
    this.uniqueid = options.uniqueid ?? strdm(16, { numbers: Date.now() + '' });
    this.session && Store.setItem(SESSION_KEY, this.session);
    this.overrides();
  }

  private overrides() {
    this.ws.onclose = (ev: CloseEvent) => {
      this.reconnect();
      this.onDistory(ev);
    }

    this.ws.onerror = () => this.reconnect();

    this.ws.onopen = (ev: Event) => this.onConnected(ev);
  }

  /**
   * Send heart data.
   */
  private ping() {
    clearInterval(this.timer as number);
    const { data, delay } = this.heart as SocketHeartData;
    this.emit('heart', data);
    this.timer = setInterval(() => this.emit('heart', this.heart?.data ?? {}), delay ?? 1000 * 10);
  }

  /**
   * Socket reconnect
   */
  private reconnect() {
    if (this.reconnectcount >= this.reconnectlimit) return;
    if (this.lockreconnect || this.disablereconnect) return;

    this.reconnectcount++;
    this.lockreconnect = true;

    setTimeout(() => {
      this.ws = new WebSocket(this.options.url, this.options.protocols);
      this.overrides();
      this.lockreconnect = false;
    }, this.remillisecond);
  }

  /**
   * Closed Socket connect and disable reconnect
   */
  public close() {
    this.disablereconnect = true;
    this.ws.close();
  }

  /**
   * Socket close event
   */
  public onDistory(fn?: Function | CloseEvent) {
    clearInterval(this.timer as NodeJS.Timeout);
    typeof fn === 'function'
      && fn
      && fn();
  }

  /**
   * Socket connecnted event
   * @param fn
   */
  public onConnected(fn: ((ev?: Event) => void) | Event): void {
    this.reconnectcount = 0;
    this.heart && this.ping();
    (fn && typeof fn === 'function') && fn();
  }

  /**
   * set heart data
   * @param data
   */
  public setHeartData(data: SocketIODispatchParams) {
    (this.heart as SocketHeartData).data = data;
  }

  /**
   * Send Message
   * @param data
   * @returns
   */
  public dispatch(data: SocketIODispatchParams) {
    const type = Object.prototype.toString.call(data);
    if (
      type === '[object Object]'
      || type === '[object String]'
      || type === '[object Array]'
      || type === '[object Number]'
      || type === '[object Boolean]'
    ) return this.ws.send(JSON.stringify(data));
    this.ws.send(data as SocketIOSendParams);
  }

  /**
   * Listen Socket message event
   * @param event
   * @param cb
   */
  public on<T extends unknown>(event: string, cb: (data: T) => void) {
    if (this.events[event] == null) this.events[event] = cb;
    this.ws.onmessage = (e: MessageEvent<any>) => {
      const { cmd, session, ...rest } = JSON.parse(e.data);
      this.session = session;
      Store.setItem(SESSION_KEY, session);
      this.events?.[cmd]?.(rest);
    }
  }

  /**
   * Emit event on socket server
   * @param event
   * @param data
   */
  public emit(event: string, data: SocketIODispatchParams): (() => void) | void {
    const session = this.session
      && typeof this.session === 'string'
      && isJSON(this.session)
      ? JSON.parse(this.session)
      : this.session;
    const patch = {
      cmd: event,
      session,
      uniqueid: this.uniqueid,
      ...data as object
    };
    if (this.ws.readyState === this.ws.CONNECTING) return this.ws.onopen = () => {
      this.ping();
      this.dispatch(patch);
    };
    this.dispatch(patch);
  }

}

export default SocketIO;