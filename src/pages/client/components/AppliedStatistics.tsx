
import { useEffect,useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Table } from 'antd';

import { clientEnterpriseApi } from '@/api';

export default ()=>{
  const [appliedList, setAppliedList] = useState([])
  const columns = [
    {
      title: '应用名称',
      dataIndex: 'robotName'
    },
    {
      title: '开发者',
      dataIndex: 'ownerName'
    },
    {
      title: '应用累计运行时长(小时)',
      dataIndex: 'accumulateRunTimeHour'
    },
    {
      title: '相当于节省人力(天)',
      dataIndex: 'accumulateRunTimeWorkDays'
    }
  ]

  useEffect(()=>{
    clientEnterpriseApi.accumulateTop().then(res=>{
      if(res.success) {
        setAppliedList(res.data);
      }
    })
  }, [])
  return (
    <ProCard 
    className="title-card-head" 
    title="TOP3应用统计" 
    style={{marginTop: 24}}
  >
    <Table columns={columns} dataSource={appliedList} pagination={false} rowKey="robotUuid"/>
  </ProCard>
  )
}