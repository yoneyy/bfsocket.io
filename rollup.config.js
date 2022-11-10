/*
 * @Author: Yoneyy (y.tianyuan)
 * @Date: 2022-10-09 14:35:25
 * @Last Modified by: Yoneyy (y.tianyuan)
 * @Last Modified time: 2022-11-10 17:38:00
 */

import path from 'path';
import cleaner from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import commonJS from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';

const resolve = p => path.resolve(__dirname, p);
const IS_PRO_ENV = process.env.NODE_ENV === 'production';

/**
 * buildConfig
 * generate rollup build config
 *
 * @param {{input:string; output: typeof import('rollup').OutputOptions,clean: boolean;}} params
 * @returns
 * @author yoneyy (y.tianyuan)
 */
function buildConfig(params) {

  /** @type {import("rollup").RollupOptions} */
  const config = {
    input: params.input,
    output: params.output,
    plugins: [
      params.clean && cleaner({ targets: './lib/*' }),
      nodeResolve({
        mainFields: ['module', 'main'],
        extensions: ['.ts', '.d.ts'],
        moduleDirectories: ['node_modules']
      }),
      commonJS(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      IS_PRO_ENV && terser(),
    ].filter(Boolean)
  }

  return config;
};

const buildBaseConfig = { name: 'bfsocket.io', exports: 'named' };

export default [
  buildConfig({
    clean: true,
    input: resolve('src/index.ts'),
    output: [
      {
        format: 'cjs',
        file: resolve(`lib/index.js`),
        ...buildBaseConfig,
      },
      {
        format: 'esm',
        file: resolve(`lib/index.esm.js`),
        ...buildBaseConfig,
      }
    ]
  })
];