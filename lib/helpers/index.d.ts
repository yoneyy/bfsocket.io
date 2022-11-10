/**
 * isJSON
 * @param j pass in a json to determine whether it is json
 * @returns
 */
export declare const isJSON: (j: string) => boolean;
export declare const Store: {
    getItem: <T extends unknown>(key: string) => string | T | T[];
    setItem: (key: string, value: string | number | Array<any> | Record<string | number, any>) => boolean;
    removeItem: (key: string) => boolean;
};
