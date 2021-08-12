import { useState, useEffect } from 'react';
import { Breadcrumb, Table } from 'antd';
import ProCard from '@ant-design/pro-card';
import { useLocation } from 'umi';

import UserInfo from './components/UserInfo';
import AccumulatedData from './components/AccumulatedData';
import { accountApi } from '@/api';
import { ListParams } from '@/models';


export default function AccountDetail() {
  const [recordList, setRecordList] = useState([])
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const location:any = useLocation();
  // 表格项
  const columns = [
    {
      title: '使用应用',
      dataIndex: 'robotName',
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
      dataIndex: 'heartTime',
    },
    {
      title: '运行状态',
      dataIndex: 'statusName'
    },
    {
      title: '运行时长',
      dataIndex: 'seconds',
    },
  ]

  useEffect(()=>{
    getUserRunRecordList({ page: 1, size: 10, userUuid: location.query.userUuid})
  }, [])

  const getUserRunRecordList = (params: ListParams)=>{
    accountApi.queryUserRunRecordList(params).then(res=>{
      if(res.success) {
        setRecordList(res.data);
        setCurrent(res.page.page);
        setTotal(res.page.total);
      }
    })
  }

  const pagination = {
    current,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
  };

  return (
    <div>
      <div style={{margin: '-24px -24px 0 -24px', background: '#fff', padding: '24px 0 8px 24px' }}>
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>账号管理</Breadcrumb.Item>
          <Breadcrumb.Item>账号管理详情</Breadcrumb.Item>
        </Breadcrumb>
        <UserInfo />
      </div>
      <AccumulatedData />
      <ProCard className="title-card-head" style={{ marginTop: 24 }} gutter={8} title="使用记录">
          <Table columns={columns}
            pagination={pagination} 
            rowKey="uuid" 
            dataSource={recordList}
            onChange={(pagination: any) => {
              getUserRunRecordList({ page: pagination.current, size: 10, userUuid: location.query.userUuid})
            }}
          />
      </ProCard>
    </div>
  );
}
