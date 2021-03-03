// rollup.config.js
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import {version} from '../package.json';
import multiEntry from "rollup-plugin-multi-entry";
import {terser} from "rollup-plugin-terser";

export default {
    input: 'src/*.js',
    output: {
        /*输出公共库路径*/
        file: 'lib/index.js',
        /*配置：UMD 通用定义模块，支持前端端跨平台模块化*/
        format: 'umd',
        name: 'JSCommonUtils',
        /*压缩和混淆js*/
        plugins: [terser(), uglify()],
        /*JS前缀: 添加库相关信息*/
        banner: '/* JSCommonUtils version ' + version + ' */',
        /*JS尾部: 添加个人相关信息*/
        footer: '/* follow me on github aa4790139 */'
    },
    plugins: [
        json(),
        babel({
            /*过滤node_modules编译*/
            exclude: 'node_modules/**'
        }),
        /*允许多输入源*/
        multiEntry()
    ],
};
