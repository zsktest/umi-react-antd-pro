import { request } from 'umi';

const pythonApi = {
  // Python包管理列表
  pypiList: (parameter) => {
    return request('/api/v1/sys/pypi/list', {
      method: 'get',
      params: parameter,
    });
  },
  // Python包管理删除
  pypiDelete: (parameter) => {
    return request('/api/v1/sys/pypi/delete', {
      method: 'POST',
      params: parameter,
    });
  },
};

export { pythonApi };
