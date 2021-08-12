import { history } from 'umi';
import { message } from 'antd';

// request拦截器, 改变url 或 options.
const authHeaderInterceptor = async (url, options) => {
  let token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    if (url.indexOf('createEnterpriseUserByExcel') < 0) {
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      };
      return {
        url: `${process.env.apiUrl}${url}`,
        options: { ...options, headers: headers },
      };
    } else {
      const headers = {
        authorization: 'Bearer ' + token,
      };
      return {
        url: `${process.env.apiUrl}${url}`,
        options: { ...options, headers: headers },
      };
    }
  } else if (url === '/oauth/token') {
    localStorage.removeItem('ACCESS_TOKEN');
    return {
      url: `${process.env.apiUrl}${url}`,
      options: { ...options },
    };
  } else {
    const headers = {
      Accept: 'application/json',
      authorization: 'Bearer ' + token,
    };
    return {
      url: `${process.env.apiUrl}${url}`,
      options: { ...options },
    };
  }
};
const bossResponseInterceptors = (response, options) => {
  return response;
};
export const request = {
  errorConfig: {
    adaptor: (resData) => {
      if (resData.code === 200 || resData.code === '200') {
        return {
          ...resData.data,
          success: resData.success,
          errorMessage: resData.msg,
        };
      } else {
        if (resData.code == 401) {
          localStorage.removeItem('ACCESS_TOKEN');
          history.push('/user/login');
          return false;
        } else {
          message.error(resData.msg);
          return false;
        }
      }
    },
  },
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [bossResponseInterceptors],
};
