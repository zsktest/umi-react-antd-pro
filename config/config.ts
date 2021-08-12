// https://umijs.org/config/
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import routes from './routes';

export default defineConfig({
  define: {
    'process.env.apiUrl': 'https://api.winrobot360.com',
    'process.env.name': 'production',
  },
  hash: true,
  antd: {},
  // dva: {
  //   hmr: true,
  // },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    // default: 'zh-CN',
    // antd: true,
    // // default true, when it is true, will use `navigator.language` overwrite default
    // baseNavigator: true,
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  dynamicImport: {
    loading: '@/components/loading',
  },
  // targets: {
  //   ie: 11,
  // },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  // esbuild: {},
  // title: false,
  // ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  // manifest: {
  //   basePath: '/',
  // },
  request: {
    dataField: 'data',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  // mfsu: {},
  // webpack5: {},
  // exportStatic: {},
  chainWebpack(memo) {
    memo.module
      .rule('mp4')
      .test(/\.(mp4|zip)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .options({
        name: 'assets/[name].[hash:8].[ext]',
        esModule: false,
      });
  },
});
