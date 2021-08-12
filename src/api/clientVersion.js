import { request } from 'umi';

const clientVersionApi = {
  // 客户端版本
  clientVersionList: (parameter) => {
    return request('/api/v1/sys/clientVersion/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 新增版本提交
  clientVersionCreate: (parameter) => {
    return request('/api/v1/sys/clientVersion/create', {
      method: 'post',
      data: parameter,
    });
  },
  // 新增版本删除
  clientVersionDelete: (parameter) => {
    return request('/api/v1/sys/clientVersion/delete', {
      method: 'post',
      params: parameter,
    });
  },
};
export { clientVersionApi };
