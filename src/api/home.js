import { request } from 'umi';

const homeApi = {
  // 仪表盘-获取企业添加人数
  summaryData: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/summary/data', {
      method: 'get',
      params,
    });
  },

  // 仪表盘-开发者统计
  dayUser: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/day/user', {
      method: 'get',
      params,
    });
  },

  // 仪表盘-开发者统计
  summaryList: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/developer/summary/list', {
      method: 'get',
      params,
    });
  },
};

export { homeApi };
