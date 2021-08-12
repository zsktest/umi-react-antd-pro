import { request } from 'umi';

const licenceApi = {
  // 许可证列表-许可列表
  grantList: (parameter) => {
    return request('/api/v1/user/license/grant/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 许可证列表-创建许可证提交内容
  grantEvaluate: (data, parameter) => {
    return request(`/api/v1/user/license/grant/evaluate?enterpriseUuid=${data}`, {
      method: 'post',
      data: parameter,
    });
  },
  // 许可证列表-创建许可证生成激活码
  grantCreate: (data, parameter) => {
    return request(`/api/v1/user/license/grant/create?enterpriseUuid=${data}`, {
      method: 'post',
      data: parameter,
    });
  },
  // 许可证列表-创建许可证生成激活码
  grantImport: (parameter) => {
    return request('/api/v1/user/license/grant/import', {
      method: 'post',
      params: parameter,
    });
  },
  // 许可证列表-激活许可证
  grantDetail: (parameter) => {
    return request('/api/v1/user/license/grant/detail', {
      method: 'get',
      params: parameter,
    });
  },
  // 许可证列表-删除当前列表
  grantDelete: (parameter) => {
    return request('/api/v1/user/license/grant/delete', {
      method: 'post',
      params: parameter,
    });
  },
};

export { licenceApi };
