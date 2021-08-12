import { request } from 'umi';

const orderApi = {
  // 订单管理-订单列表
  orderList: (parameter) => {
    return request('/api/v1/trader/order/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 订单管理-更新企业发票配置信息
  updateInvoiceConfig: (data, parameter) => {
    return request(`/api/v1/user/tenant/updateInvoiceConfig?enterpriseUuid=${data}`, {
      method: 'post',
      data: parameter,
    });
  },
  // 订单管理-更新企业发票配置信息
  queryInvoiceConfig: (parameter) => {
    return request('/api/v1/user/tenant/queryInvoiceConfig', {
      method: 'get',
      params: parameter,
    });
  },
  // 订单管理-申请订单发票
  applyInvoice(parameter) {
    return request('/api/v1/trader/order/applyInvoice', {
      method: 'post',
      params: parameter,
    });
  },
};

export { orderApi };
