import { request } from 'umi';

const clientEnterpriseApi = {
  // 仪表盘-获取企业添加人数
  summaryData: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/summary/data', {
      method: 'get',
      params,
    });
  },
  // 设置-修改企业与用户信息
  enterpriseUpdate: (data) => {
    return request(`/api/v1/enterprise/update`, {
      method: 'post',
      data,
    });
  },
  // 获取分享信息-客户端嵌套控制台
  queryApplyEnterpriseInfo: (params) => {
    return request('/api/noauth/v1/enterprise/apply/queryApplyEnterpriseInfo', {
      method: 'get',
      params,
    });
  },
  // 获取邀请链接-客户端嵌套控制台
  inviteGetInviteLink: (params) => {
    return request('/api/v1/enterprise/invite/getInviteLink', {
      method: 'get',
      params,
    });
  },
  // 重置邀请链接-客户端嵌套控制台
  inviteResetInviteLink: (params) => {
    return request('/api/v1/enterprise/invite/resetInviteLink', {
      method: 'get',
      params,
    });
  },
  // 邮箱邀请-客户端嵌套控制台
  inviteInviteByMail: (params) => {
    return request('/api/v1/enterprise/invite/inviteByMail', {
      method: 'post',
      data: params,
    });
  },
  // 申请高级账号运行条数-客户端嵌套控制台
  clientConfig: (params) => {
    return request('/api/v1/sys/client/clientConfig', {
      method: 'get',
      data: params,
    });
  },
  // 申请高级账号-客户端嵌套控制台
  applySeniorAccount: (data) => {
    return request('/api/v1/enterprise/apply/applySeniorAccount', {
      method: 'post',
      data,
    });
  },
  // 积累类别-客户端嵌套控制台
  userAccumulate: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/day/user/accumulate', {
      method: 'get',
      params,
    });
  },
  // 柱状图-客户端嵌套控制台
  userAggr: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/day/user/aggr', {
      method: 'get',
      params,
    });
  },
  // 开发者统计
  accumulateTop: (params) => {
    return request('/api/v1/enterprise/dashboard/enterprise/robot/accumulate/top', {
      method: 'get',
      params,
    });
  },
  // 获取进度
  queryCreateUserStatus: (params) => {
    return request('/api/v1/enterpriseUser/queryCreateUserStatus', {
      method: 'get',
      params,
    });
  },
  // 发送手机验证码-客户端嵌套控制台
  applySendVerifyCode: (params) => {
    return request('/api/noauth/v1/enterprise/apply/sendVerifyCode', {
      method: 'post',
      params,
    });
  },
  // 加入企业-客户端嵌套控制台
  approvalApplyAccount: (data) => {
    return request('/api/noauth/v1/enterprise/apply/applyAccount', {
      method: 'post',
      data,
    });
  },
  // 下载客户端埋点
  recordLog: (params) => {
    return request('/api/noauth/v1/sys/spm/record/log', {
      method: 'get',
      params,
    });
  },
};
export { clientEnterpriseApi };
