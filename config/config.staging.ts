// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.apiUrl': 'https://staging-api.winrobot360.com',
    'process.env.name': 'staging',
  },
});
