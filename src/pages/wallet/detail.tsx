import React, { useState, useEffect, useRef } from 'react';
import { Table, message, Breadcrumb, DatePicker } from 'antd';
import { Link, useModel } from 'umi';

import { walletApi } from '@/api';
import { Page } from '@/models'

import styles from './index.less';

const { RangePicker } = DatePicker;

interface Record {
    calBatchId: number;
    createTime: string;
    id: number;
    interfaceCode: string;
    interfaceId: number;
    interfaceName: string;
    interfacePrice: number;
    status: string;
    tenantUuid: string;
    thirdPartyCode: string;
    thirdPartyId: number;
    thirdPartyName: string;
    updateTime: string;
    userName: string;
    userUuid: string;
}

export default function IndexPage() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState({ page: 1, size: 10 });
    const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger: false });
    const dateList = useRef(['',''])
    // 获取列表
    const getTableList = (data: Page) => {
        setLoading(true);
        let [startDate,endDate] = dateList.current
        const param = {
            ...data,
            startDate,
            endDate
        };
        walletApi.interfaceCallDetailList(param).then((res) => {
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

    // 表格项
    const columns = [
        {
            title: '调用时间',
            dataIndex: 'createTime'
            // width: '20%'
        },
        {
            title: '服务提供方',
            dataIndex: 'thirdPartyName'
        },
        {
            title: '接口名称',
            dataIndex: 'interfaceName'
        },
        {
            title: '调用费用',
            dataIndex: 'interfacePrice',
            scopedSlots: { customRender: 'inter' }
        },
        {
            title: '使用账号',
            dataIndex: 'userName'
        }
    ]
    /**
     * @description: 表格分页、排序、筛选变化时触发，todo：暂时前端做分页，此功能方法不调用
     * @param {Object} pag：分页
     * @param {Object} filters：筛选
     * @param {Object} sorter：排序
     */
    const handleTableChange = async (pag: any) => {
        const pager = { ...pagination };
        pager.current = pag.current;
        setPagination(pager);
        const param = {
            ...postData,
            page: pager.current,
        };
        setPostData(param);
        getTableList(param);
    }
    useEffect(() => {
        getTableList(postData);
    }, [])
    // 日期选择
    const onChange = (dates: any, dateStrings: Array<string>) => {
        dateList.current = dateStrings
        getTableList(postData);
    }

    return (
        <div className={styles.wallet_detail}>
            <div className="header">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/wallet/list">扩展服务</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>服务消耗详情</Breadcrumb.Item>
                </Breadcrumb>
                <h1>服务消耗详情</h1>
            </div>
            <div className="content">
                <div className="search">
                    <RangePicker onChange={(dates, dateStrings) => onChange(dates, dateStrings)} />
                </div>
                <Table
                    rowKey={(record: Record) => record.id}
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
