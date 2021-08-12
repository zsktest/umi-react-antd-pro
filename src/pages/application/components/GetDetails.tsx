import React, { useState, useEffect, useRef } from 'react';
import { useModel, useLocation } from 'umi';
import { Table } from 'antd';
import ProCard from "@ant-design/pro-card";

import { applicationApi } from '@/api';
import { Page } from '@/models'

export default () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState({ page: 1, size: 10 });
    const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false });

    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');
    const location: any = useLocation();

    // 数据详情
    const columns = [
        {
            title: '姓名',
            dataIndex: 'enterpriseUserName',
            width: '33%'
        },
        {
            title: '账号',
            dataIndex: 'userName',
            width: '33%'
        },
        {
            title: '获取时间',
            dataIndex: 'updateTime',
            width: '33%'
        }
    ]

    // 获取明细列表
    const getqueryRobotUseUserList = (data: Page) => {
        setLoading(true)
        let params = {
            ...data,
            enterpriseUuid: enterpriseUuid.current,
            robotUuid: location.query.robotUuid,
        }
        applicationApi.queryRobotUseUserList(params).then(res => {
            if (res.code === 200) {
                const pagination_r = { ...pagination };
                pagination_r.total = res.page.total;
                pagination_r.current = res.page.page;
                setLoading(false)
                setDataSource(res.data)
                setPagination(pagination_r);
            } else {
                setLoading(true)
                setDataSource([])

            }
        })
    }
    useEffect(() => {
        if (initialState.currentUser) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
            getqueryRobotUseUserList(postData)
        }
    }, [initialState])
    const handleTableChange = (pag: any) => {
        const pager = { ...pagination };
        pager.current = pag.current;
        setPagination(pager);
        const param = {
            ...postData,
            page: pager.current,
        };
        setPostData(param);
        getqueryRobotUseUserList(param);
    }

    return (
        <ProCard className="title-card-head" style={{ marginTop: 24 }} gutter={8} title="获取明细">
            <div style={{ padding: '0 24px' }}>
                <Table
                    rowKey={(record: any) => record.uuid}
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            </div>
        </ProCard>
    );
}

