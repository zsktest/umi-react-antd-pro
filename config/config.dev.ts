// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.apiUrl': 'http://dev-api.winrobot360.com:8079',
    // 'process.env.apiUrl': 'http://private.winrobot360.com',
    'process.env.name': 'dev',
  },
});
