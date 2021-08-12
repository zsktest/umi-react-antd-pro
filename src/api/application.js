import { request } from 'umi';

const applicationApi = {
  // 账号管理-企业用户列表
  userList: (parameter) => {
    return request('/api/v1/enterpriseUser/user/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-应用列表
  applicaList: (parameter) => {
    return request('/api/v1/enterpriseRobot/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-删除应用
  deleteRobot: (parameter) => {
    return request('/api/v1/enterpriseRobot/deleteRobot', {
      method: 'post',
      params: parameter,
    });
  },
  // 应用管理-转交应用
  translateSpecifyRobotOwner: (parameter) => {
    return request('/api/v1/enterpriseRobot/translateSpecifyRobotOwner', {
      method: 'post',
      params: parameter,
    });
  },
  // 应用管理-修改应用名称
  updateRobotInfo: (data, parameter) => {
    return request(`/api/v1/enterpriseRobot/updateRobotInfo?enterpriseUuid=${data}`, {
      method: 'post',
      data: parameter,
    });
  },
  // 应用管理-详情基本信息
  robotDetailBO: (parameter) => {
    return request('/api/v1/enterpriseRobot/robotDetailBO', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情积累数据
  userSummaryData: (parameter) => {
    return request('/api/v1/enterpriseUser/user/summary/data', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情基本面积图
  robotDay: (parameter) => {
    return request('/api/v1/enterpriseRobot/robot/day/use/line', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情使用时长TOP5
  robotTop: (parameter) => {
    return request('/api/v1/enterpriseRobot/robot/realtime/use/top', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情使用获取明细
  queryRobotUseUserList: (parameter) => {
    return request('/api/v1/enterpriseRobot/queryRobotUseUserList', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情使用使用记录
  queryRobotUseRecordList: (parameter) => {
    return request('/api/v1/enterpriseRobot/queryRobotUseRecordList', {
      method: 'get',
      params: parameter,
    });
  },
  // 应用管理-详情积累数据
  robotSummaryData: (parameter) => {
    return request('/api/v1/enterpriseRobot/robot/summary/data', {
      method: 'get',
      params: parameter,
    });
  },
};
export { applicationApi };
