import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#ff525b',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: true,
  splitMenus: false,
  footerRender: false,
  title: '影刀控制台',
  pwa: false,
  logo: 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/console/img/logo.c7f4e2ba.png',
  iconfontUrl: '//at.alicdn.com/t/font_2677056_mxe1teuy5b9.js',
};

export default Settings;
