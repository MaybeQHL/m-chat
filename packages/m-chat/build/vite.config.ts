import { defineConfig, ConfigEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
import libCss from 'vite-plugin-libcss';

import {
    createStyleImportPlugin,
} from '@jtsang/vite-plugin-style-import'


// 尺寸适配
import pxToViewPort from 'postcss-px-to-viewport-8-plugin'

import { basePxtovwConfig, vantPxtovwConfig } from './pxtoviewport.config'


// 处理setup中name导出的问题
// 例:<script lang="ts" setup name="xxxx">...</script>
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// 代码压缩
import { terser } from "rollup-plugin-terser";

// svg
import svgLoader from 'vite-svg-loader'

import dts from 'vite-plugin-dts'
// import { viteThemePlugin } from 'vite-plugin-theme';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: []
    },
    build: {
        sourcemap: true, // 代码调试
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, '../src/index.ts'),
            name: 'MChat',
            // fileName: (format) => `smart-component.${format}.js`
            fileName: 'm-chat'
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue'
                }
            },
            plugins: [
                terser()
            ]
        }
    },
    css: {
        postcss: {
            plugins: [
                pxToViewPort(vantPxtovwConfig),
                pxToViewPort(basePxtovwConfig)
            ]
        }
    },
    plugins: [
        vue(),
        // libCss(),
        createStyleImportPlugin({
            libs: [
                // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
                {
                    libraryName: 'vant',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `../../vant/es/${name}/style/index`
                    },
                },
            ],
        }),
        vueSetupExtend(),
        dts({
            insertTypesEntry: true
        }),
        svgLoader({

        }),
        // viteThemePlugin({
        //     // Match the color to be modified
        //     colorVariables: ["#e72528"]
        // })
    ]
})


