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
        file: 'lib/index.js',
        format: 'umd',
        name: 'JSCommonUtils',
        plugins: [terser(), uglify()]
    },
    plugins: [
        json(),
        babel({
            /*过滤node_modules编译*/
            exclude: 'node_modules/**'
        }),
        multiEntry()
    ],
    banner: '/* JSCommonUtils version ' + version + ' */',
    footer: '/* follow me on github aa4790139 */'
};
