/**
 * Socket send params
 */
export declare type SocketIOSendParams = Blob | string | ArrayBufferLike | ArrayBufferView;
/**
* Socket dispatch params
*/
export declare type SocketIODispatchParams = SocketIOSendParams | object | Array<any> | number | boolean;
/**
* socket Send heart data
* 发送 socket 心跳包
*/
export declare type SocketHeartData = {
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
declare class SocketIO {
    private options;
    private reconnectcount;
    private remillisecond;
    private reconnectlimit;
    private lockreconnect;
    private disablereconnect;
    private timer;
    private heart;
    private events;
    ws: WebSocket;
    readonly uniqueid: string | null;
    session?: string | Array<any> | Record<string, any>;
    constructor(options: SocketIOInitData);
    private overrides;
    /**
     * Send heart data.
     */
    private ping;
    /**
     * Socket reconnect
     */
    private reconnect;
    /**
     * Closed Socket connect and disable reconnect
     */
    close(): void;
    /**
     * Socket close event
     */
    onDistory(fn?: Function | CloseEvent): void;
    /**
     * Socket connecnted event
     * @param fn
     */
    onConnected(fn: ((ev?: Event) => void) | Event): void;
    /**
     * set heart data
     * @param data
     */
    setHeartData(data: SocketIODispatchParams): void;
    /**
     * Send Message
     * @param data
     * @returns
     */
    dispatch(data: SocketIODispatchParams): void;
    /**
     * Listen Socket message event
     * @param event
     * @param cb
     */
    on<T extends unknown>(event: string, cb: (data: T) => void): void;
    /**
     * Emit event on socket server
     * @param event
     * @param data
     */
    emit(event: string, data: SocketIODispatchParams): (() => void) | void;
}
export default SocketIO;
