import { useState, useEffect, useRef } from 'react';
import { Modal, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { Page } from '@/models'
import { approvalApi } from '@/api';

import styles from './index.less';

const { confirm } = Modal;
interface Record {
    applyAccount: string;
    applyContent: string;
    applyRemark: string;
    applyTime: string;
    applyType: string;
    applyUserName: string;
    applyUserUuid: string;
    approvalStatus: string;
    approvalStatusName: string;
    approvalUserUuid: string;
    enterpriseApprovalUuid: string;
    enterpriseUuid: string;
    key: string;
}
export default function IndexPage() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState({ page: 1, size: 10});
    const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false  });

    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');
    // 获取列表
    const getTableList = (data: Page) => {
        setLoading(true);
        const param = {
            ...data,
            enterpriseUuid: enterpriseUuid.current,
        };
        approvalApi.approvalQueryApprovalList(param).then((res) => {
            if (res.code === 200) {
                const pagination_r = { ...pagination };
                pagination_r.total = res.page.total;
                pagination_r.current = res.page.page;
                setLoading(false);
                setDataSource(res.data);
                setPagination(pagination_r);
            } else {
                setLoading(false);
                setDataSource([]);
            }
        });
    };
    // 审批通过
    const postapprovalAccept = (record: Record) => {
        const data = {
            enterpriseApprovalUuid: record.enterpriseApprovalUuid
        }
        approvalApi.approvalAccept(data).then(res => {
            if (res.code === 200) {
                getTableList(postData)
            }
        })
    }
    // 二次确认驳回
    const sureReject = (enterpriseApprovalUuid: string) => {
        approvalApi.approvalReject({ enterpriseApprovalUuid }).then(res => {
            if (res.code === 200) {
                getTableList(postData)
            }
        })
    }
    // 驳回
    const postapprovalReject = (record: Record) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: `确认驳回'${record.applyAccount}'的申请`,
            onOk() {
                sureReject(record.enterpriseApprovalUuid)
            }
        });
    }
    // 表格项
    const columns = [
        {
            title: '申请日期',
            dataIndex: 'applyTime'
        },
        {
            title: '申请账号',
            dataIndex: 'applyAccount'
        },
        {
            title: '申请人',
            dataIndex: 'applyUserName'
        },
        {
            title: '申请内容',
            dataIndex: 'applyContent'
        },
        {
            title: '申请备注',
            width: 200,
            dataIndex: 'applyRemark'
        },
        {
            title: '状态',
            dataIndex: 'approvalStatusName',
            key: 'approvalStatusName',
            slots: { title: 'customTime' },
            scopedSlots: { customRender: 'imsl' },
            filters: [
                {
                    text: '待审批',
                    value: 'wait_approval'
                },
                {
                    text: '已通过',
                    value: 'approval_accept'
                },
                {
                    text: '未通过',
                    value: 'approval_reject'
                },
                {
                    text: '已过期',
                    value: 'approval_expired'
                }
            ],
            filterMultiple: false
        },
        {
            title: '操作',
            dataIndex: '',
            width: '14%',
            render: (text: string, record: Record) => record.approvalStatus === 'wait_approval' && <span><a onClick={() => postapprovalAccept(record)}>通过</a><a onClick={() => postapprovalReject(record)} style={{ marginLeft: '15px' }}>驳回</a></span>
        }
    ]
    /**
     * @description: 表格分页、排序、筛选变化时触发，todo：暂时前端做分页，此功能方法不调用
     * @param {Object} pag：分页
     * @param {Object} filters：筛选
     * @param {Object} sorter：排序
     */
    const handleTableChange = (pag: any, filters: any) => {
        const pager = { ...pagination };
        pager.current = pag.current;
        setPagination(pager);
        const param = {
        ...postData,
        page: pager.current,
        approvalStatus: Array.isArray(filters.approvalStatusName)  ? filters.approvalStatusName[0] : filters.approvalStatusName
        };
        setPostData(param);
        getTableList(param);
    };

    useEffect(() => {
        if (initialState.currentUser) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
            getTableList(postData);
        }
    }, [initialState]);
    return (
        <div className={styles.approval}>
            <div className="account_title">
                <h1>申请审批</h1>
            </div>
            <div style={{ padding: '0 24px' }}>
                <Table
                    rowKey = {(record: Record) => record.applyTime}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
}
