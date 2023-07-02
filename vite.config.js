import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const TerserPlugin = require("terser-webpack-plugin");

// https://vitejs.dev/config/
export default defineConfig({
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 可选配置项，用于压缩代码
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
          mangle: true, // 开启代码混淆
          output: {
            comments: true // 去掉注释
          }
        }
      })
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
}
)
