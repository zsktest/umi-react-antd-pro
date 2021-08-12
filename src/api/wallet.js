import { request } from 'umi';

const walletApi = {
  // 三方钱包服务-钱包详情
  walletQuery: (parameter) => {
    return request('/api/v1/trader/wallet/query', {
      method: 'get',
      params: parameter,
    });
  },
  // 三方钱包服务-充值卡列表
  saleQueryOnSale: (parameter) => {
    return request('/api/v1/trader/sale/queryOnSale', {
      method: 'get',
      params: parameter,
    });
  },
  // 三方钱包服务-生成订单
  orderWithAlipay: (parameter) => {
    return request('/api/v1/trader/userOrder/orderWithAlipay', {
      method: 'post',
      params: parameter,
    });
  },
  // 三方钱包服务-服务消耗详情
  interfaceCallDetailList: (parameter) => {
    return request('/api/openapi/v2/admin/thirdParty/interfaceCallDetailList', {
      method: 'get',
      params: parameter,
    });
  },
  // 三方钱包服务-可用收费服务
  queryByInterfaceGroupCode: (parameter) => {
    return request('/api/openapi/v2/interfaceGroup/queryByInterfaceGroupCode', {
      method: 'get',
      params: parameter,
    });
  },
};
export { walletApi };
