import { request } from 'umi';

const authorApi = {
  // 激活码-列表
  listLicense: (parameter) => {
    return request('/api/v1/client/license/listLicense', {
      method: 'get',
      params: parameter,
    });
  },
  // 激活码-列表客户端名称修改
  updateLicense: (parameter) => {
    return request('/api/v1/client/license/updateLicense', {
      method: 'post',
      data: parameter,
    });
  },
  // 激活码三方企业-列表
  thirdList: (parameter) => {
    return request('/api/v1/sys/company/third/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 激活码三方企业-列表修改名称
  thirdUpdateName: (parameter) => {
    return request('/api/v1/sys/company/third/update', {
      method: 'post',
      data: parameter,
    });
  },
  // 激活码-创建接口
  createLicense: (data, parameter) => {
    return request(`/api/v1/client/license/createLicense?enterpriseUuid=${data}`, {
      method: 'post',
      data: parameter,
    });
  },
};

export { authorApi };
