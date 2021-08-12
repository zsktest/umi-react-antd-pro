import { request } from 'umi';

const userApi = {
  // 登录
  login: (data) => {
    return request('/oauth/token', {
      auth: {
        username: 'console',
        password: 'sUWiy6sNiXd0e5Lh',
      },
      method: 'post',
      headers: { Authorization: 'Basic Y29uc29sZTpzVVdpeTZzTmlYZDBlNUxo' },
      requestType: 'form',
      data,
    });
  },

  // 获取用户信息
  getInfo: () => {
    return request('/api/v1/user/info/rich', {
      method: 'get',
    });
  },

  // 退出登录
  logout: () => {
    return request('/api/v1/user/logout', {
      method: 'post',
    });
  },

  // token是否失效
  checktoken: () => {
    return request('/oauth/check_token', {
      method: 'get',
    });
  },

  // 埋点
  recordLog: (params) => {
    return request('/api/noauth/v1/sys/spm/record/log', {
      method: 'get',
      params,
    });
  },

  // url自带token获取Access-Token
  getAccessTokenByJumpToken: () => {
    return request('/api/v1/user/login/getAccessTokenByJumpToken', {
      method: 'get',
    });
  },
};

export { userApi };
