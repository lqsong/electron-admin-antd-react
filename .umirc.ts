// https://umijs.org/config/
import { defineConfig } from 'umi';

import fs from 'fs';
import path from 'path';
import lessToJs from 'less-vars-to-js';

import { routes } from './src/config/routes';

const { API_HOST } = process.env;

export default defineConfig({
  define: {
    API_HOST: API_HOST,
  },
  history: { type: 'hash' },
  hash: true,
  ignoreMomentLocale: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    title: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: lessToJs(
    fs.readFileSync(
      path.join(__dirname, './src/assets/css/antd-variables.less'),
      'utf8',
    ),
  ),
  title: false,
  proxy: {},
  chainWebpack(memo /* ,  { webpack } */) {
    // 内置的 svg Rule 添加 exclude
    memo.module
      .rule('svg')
      .exclude.add(/iconsvg/)
      .end();

    // 添加 svg-sprite-loader Rule
    memo.module
      .rule('svg-sprite-loader')
      .test(/.svg$/)
      .include.add(/iconsvg/)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader');

    // 添加 svgo Rule
    memo.module
      .rule('svgo')
      .test(/.svg$/)
      .include.add(/iconsvg/)
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        // externalConfig 配置特殊不是相对路径，起始路径是根目录
        externalConfig: './src/assets/iconsvg/svgo.yml',
      });

    /*
    // 添加 svgr Rule (yarn add @svgr/webpack --dev) (移除)
    memo.module
      .rule('svgr')
      .test(/.svg$/)
      .include.add(/iconsvg/).end()
      .use('@svgr/webpack')
      .loader(require.resolve('@svgr/webpack'));
    */
  },
  electronBuilder: {
    routerMode: 'hash', // 路由 只能是hash或memory
    outputDir: 'dist_electron', // 默认打包目录
    externals: [],  // 不配置的无法使用
    rendererTarget: 'electron-renderer', // 构建目标electron-renderer 或 web
    builderOptions: {
      productName: 'electron-admin-antd-react', // 项目名，也是生成的安装文件名，即electron-admin-antd-react.exe
      appId: 'cc.liqingsong.electron-admin-antd-react', // 包名
      copyright: 'Copyright © 2018-present LiQingSong', // 版权
      nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: './build/icons/icon.ico', // 安装图标
          uninstallerIcon: './build/icons/icon.ico', // 卸载图标
          installerHeaderIcon: './build/icons/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'electron-admin-antd-react' // 图标名称
      },
      dmg: { // macOSdmg
          contents: [
            {
              "x": 410,
              "y": 150,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 150,
              "type": "file"
            }
          ]
      },
      mac: { // mac
          icon: "./build/icons/icon.icns"
      },
      win: { // win 相关配置
          icon: './build/icons/icon.ico',
          target: [
              {
                target: "nsis", // 利用nsis制作安装程序
                arch: [ // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
                  // "x64",
                  "ia32"
                ]
              }
            ]
      },
      linux: {
          icon: "./build/icons"
      },
      publish: [
        {
          provider: 'generic',
          url: '',
        },
      ],
    }
  }
});
