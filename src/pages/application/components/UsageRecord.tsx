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

    // 使用记录
const columns = [
    {
      title: '使用账号',
      dataIndex: 'userName'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime'
    },
    {
      title: '同步时间',
      dataIndex: 'heartTime'
    },
    {
      title: '运行状态',
      dataIndex: 'statusName'
    },
    {
      title: '运行时长(秒)',
      dataIndex: 'seconds'
    }
    // {
    //   title: '运行结果',
    //   dataIndex: 'statusName'
    // },
    // {
    //   title: '结束备注',
    //   dataIndex: 'remark',
    //   scopedSlots: { customRender: 'action' }
    // }
  ]

    // 使用记录
    const getqueryRobotUseRecordList = (data: Page) => {
        setLoading(true)
        let params = {
            ...data,
            enterpriseUuid: enterpriseUuid.current,
            robotUuid: location.query.robotUuid,
        }
        applicationApi.queryRobotUseRecordList(params).then(res => {
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
            getqueryRobotUseRecordList(postData)
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
        getqueryRobotUseRecordList(param);
    }

    return (
        <ProCard className="title-card-head" style={{ marginTop: 24 }} gutter={8} title="使用记录">
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

