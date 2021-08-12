import { request } from 'umi';

const accountApi = {
  // 账号管理-获取企业添加人数
  queryEnterprise: (params) => {
    return request('/api/v1/enterprise/queryEnterprise', {
      method: 'get',
      params,
    });
  },
  // 账号管理-理获取列表
  accountUser: (params) => {
    return request('/api/v1/enterpriseUser/user/list', {
      method: 'get',
      params,
    });
  },
  // 账号管理-查询企业可用的额外附加账号
  queryAvailableEnterpriseLicense: (params) => {
    return request('/api/v1/enterpriseUser/queryAvailableEnterpriseLicense', {
      params,
    });
  },
  // 账号管理-创建用户
  createUser: (params, data) => {
    return request('/api/v1/enterpriseUser/createUser', {
      method: 'post',
      params,
      data,
    });
  },
  // 账号管理-修改用户
  updateUser: (params, data) => {
    return request('/api/v1/enterpriseUser/updateUser', {
      method: 'post',
      params,
      data,
    });
  },
  // 账号管理-获取迁移密码
  createOrQueryMigrateCode: (params) => {
    return request('/api/v1/enterpriseUser/createOrQueryMigrateCode', {
      method: 'get',
      params,
    });
  },
  // 账号管理-删除
  deleteUser: (params) => {
    return request('/api/v1/enterpriseUser/deleteUser', {
      method: 'post',
      params,
    });
  },
  // 账号管理-重置密码
  resetUserPassword: (params) => {
    return request('/api/v1/enterpriseUser/resetUserPassword', {
      method: 'post',
      params,
    });
  },
  // 账号管理-询价单独购买的用户许可
  enquiryUserLicense: (params) => {
    return request('/api/v1/enterprise/trade/enquiry', {
      method: 'get',
      params,
    });
  },
  // 账号管理-附加账号续费
  tradeDelay: (params) => {
    return request('/api/v1/enterprise/trade/delay', {
      method: 'post',
      params,
    });
  },
  // 账号管理-点击继续支付
  tradePay: (params) => {
    return request('/api/v1/enterprise/trade/pay', {
      method: 'post',
      params,
    });
  },
  // 账号管理-查询订单状态是否支付成功
  queryOrderPayoff: (params) => {
    return request('/api/v1/enterprise/order/queryOrderPayoff', {
      method: 'get',
      params,
    });
  },
  // 账号管理-详情基本信息
  userDta: (params) => {
    return request('/api/v1/enterpriseUser/user/detail', {
      method: 'get',
      params,
    });
  },
  // 账号管理-详情list
  queryUserRunRecordList: (params) => {
    return request('/api/v1/enterpriseUser/queryUserRunRecordList', {
      method: 'get',
      params,
    });
  },
  // 应用管理-详情积累数据
  userSummaryData: (params) => {
    return request('/api/v1/enterpriseUser/user/summary/data', {
      method: 'get',
      params,
    });
  },
};
export { accountApi };
