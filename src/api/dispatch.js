import { request } from 'umi';

const dispatchApi = {
  // 调度中心-计划列表应用
  scheduleList(parameter) {
    return request('/api/dispatch/v2/schedule/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心-列出计划下的客户端列表
  scheduleClientList(parameter) {
    return request('/api/dispatch/v2/schedule/client/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心=计划列表弹窗cron表达式预览
  interfacePreview(parameter) {
    return request('/api/dispatch/v2/schedule/cron/interface/preview?size=5', {
      method: 'post',
      data: parameter,
    });
  },
  // 调度中心-更新计划任务的状态
  hangeEnabledStatus(parameter) {
    return request('/api/dispatch/v2/schedule/changeEnabledStatus', {
      method: 'post',
      params: parameter,
    });
  },
  // 调度中心-手动执行计划任务
  manualStart(parameter) {
    return request('/api/dispatch/v2/schedule/manual/start', {
      method: 'post',
      params: parameter,
    });
  },
  // 调度中心-计划列表弹窗 删除单应用计划
  scheduleDelete(parameter) {
    return request('/api/dispatch/v2/schedule/delete', {
      method: 'post',
      params: parameter,
    });
  },
  // 调度中心-计划列表应用简化
  listSummary(parameter) {
    return request('/api/dispatch/v2/schedule/list/summary', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心-任务列表
  sceneinstlist(parameter) {
    return request('/api/dispatch/v2/scene/inst/list', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心-任务详情
  processDetail(parameter) {
    return request('/api/dispatch/v2/scene/inst/client/process/detail', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心-机器人可被调度
  clientStatusCount(parameter) {
    return request('/api/dispatch/v2/client/statusCount', {
      method: 'get',
      params: parameter,
    });
  },
  // 调度中心-计划列表弹窗机器人列表
  clientList(parameter) {
    return request('/api/dispatch/v2/client/list', {
      method: 'get',
      params: parameter,
    });
  },
};
export { dispatchApi };
