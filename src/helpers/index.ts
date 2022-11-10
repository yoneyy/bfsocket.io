/*
 * @Author: Yoneyy (y.tianyuan)
 * @Date: 2022-03-14 10:38:54
 * @Last Modified by: Yoneyy (y.tianyuan)
 * @Last Modified time: 2022-11-10 17:35:29
 */

/**
 * isJSON
 * @param j pass in a json to determine whether it is json
 * @returns
 */
export const isJSON = (j: string): boolean => {
  try {
    JSON.parse(j);
    return true;
  } catch (error) {
    return false;
  }
}

const { sessionStorage: store } = window;

/**
 * session storeage getItem
 * @param key
 * @returns
 */
const getItem = <T extends unknown>(key: string): string | T[] | T => {
  if (key == null) throw new Error('param `key` must be required');
  const data = store.getItem(key + '');
  const result = data && isJSON(data)
    ? JSON.parse(data)
    : data;
  return result;
};

/**
 * session storeage setItem
 * @param key
 * @param value
 * @returns
 */
const setItem = (key: string, value: string | number | Array<any> | Record<string | number, any>): boolean => {
  try {
    const _value = typeof value !== 'string' ? JSON.stringify(value) : value;
    store.setItem(key + '', _value);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * session storage removeItem
 * @param key
 * @returns
 */
const removeItem = (key: string): boolean => {
  try {
    store.removeItem(key + '');
    return true;
  } catch (error) {
    return false;
  }
}

export const Store = {
  getItem,
  setItem,
  removeItem,
}