import { request } from 'umi';

const settingApi = {
  // 账号管理-获取企业添加人数
  queryEnterprise: (params) => {
    return request('/api/v1/enterprise/queryEnterprise', {
      method: 'get',
      params,
    });
  },
  // 设置-修改用户信息
  enterpriseUpdate: (parameter) => {
    return request(`/api/v1/enterprise/update`, {
      method: 'post',
      data: parameter,
    });
  },
  // 设置-修改密码
  changePwd: (parameter) => {
    return request('/api/v1/user/info/changePwd', {
      method: 'post',
      params: parameter,
    });
  },

  // 设置-获取验证码
  sendVerifyCode: (parameter) => {
    return request('/api/v1/enterprise/sendVerifyCode', {
      method: 'post',
      params: parameter,
    });
  },
  // 账号管理-询价单独购买的用户许可
  enquiryUserLicense: (parameter) => {
    return request('/api/v1/enterprise/trade/enquiry', {
      method: 'get',
      params: parameter,
    });
  },
  // 账号管理-询价单独购买的用户许可
  orderUserLicenseWithAlipay: (parameter) => {
    return request('/api/v1/enterprise/trade/buy', {
      method: 'post',
      params: parameter,
    });
  },
  // 账号管理-查询订单状态是否支付成功
  queryOrderPayoff: (parameter) => {
    return request('/api/v1/enterprise/order/queryOrderPayoff', {
      method: 'get',
      params: parameter,
    });
  },
  // 账号管理-点击继续支付
  tradePay: (parameter) => {
    return request('/api/v1/enterprise/trade/pay', {
      method: 'post',
      params: parameter,
    });
  },
  // 设置-重建索引
  rebuildindex: () => {
    return request('/api/v1/sys/cache/rebuild/index', {
      method: 'post',
    });
  },
  // 市场管理-关闭默认市场
  disableDefaultMarket: (parameter) => {
    return request('/api/v1/enterprise/market/disableDefaultMarket', {
      method: 'post',
      params: parameter,
    });
  },
  // 设置-修改个人手机号用户信息
  changeUserInfo: (parameter) => {
    return request('/api/v1/user/info/changeUserInfo', {
      method: 'post',
      data: parameter,
    });
  },
  // 设置-个人版获取验证码
  userSendVerifyCode: (parameter) => {
    return request('/api/v1/user/info/sendVerifyCode', {
      method: 'post',
      params: parameter,
    });
  },
  // 设置-专有云版本信息
  privateSv: (parameter) => {
    return request('/api/noauth/v1/sys/server/private/sv', {
      method: 'get',
      params: parameter,
    });
  },
};

export { settingApi };
