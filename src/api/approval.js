import { request } from 'umi';

const approvalApi = {
  // 申请审批列表-客户端嵌套控制台
  approvalQueryApprovalList: (parameter) => {
    return request('/api/v1/enterprise/approval/queryApprovalList', {
      method: 'get',
      params: parameter,
    });
  },
  // 申请审批个数-客户端嵌套控制台
  approvalQueryNoApprovalCount: (parameter) => {
    return request('/api/v1/enterprise/approval/queryWaitApprovalCount', {
      method: 'post',
      params: parameter,
    });
  },
  // 申请审批同意-客户端嵌套控制台
  approvalAccept: (parameter) => {
    return request('/api/v1/enterprise/approval/accept', {
      method: 'post',
      params: parameter,
    });
  },
  // 申请审批拒绝-客户端嵌套控制台
  approvalReject: (parameter) => {
    return request('/api/v1/enterprise/approval/reject', {
      method: 'post',
      params: parameter,
    });
  },
};
export { approvalApi };
