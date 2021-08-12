import { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Radio } from 'antd';
import { Column } from '@ant-design/charts';

import { clientEnterpriseApi } from '@/api';

export default ()=>{
  const [days, setDays]=useState(7);
  const [robotTaskData, setRobotTaskData]=useState([])

  const onChange=(e:any)=>{
    setDays(e.target.value);
  }

  useEffect(()=>{
    clientEnterpriseApi.userAggr({days}).then(res=>{
      if(res.success) {
        setRobotTaskData(res.data.dataRows);
      }
    })
  }, [days])

  const config = {
    title: {
      visible: true,
      text: ''
    },
    data: robotTaskData,
    forceFit: true,
    xField: '时间',
    yField: '运行时长',
    xAxis:{
      title: {
        text: '时间'
      }
    },
    yAxis:{
      title: {
        text: '执行时长(小时)'
      }
    },
    height: 400,
    meta: {
      时间: {
        alias: ''
      },
      运行时长: {
        alias: '执行时长(小时)'
      }
    }
  };
  return (
    <ProCard 
      className="title-card-head" 
      title="机器人执行任务时间(小时)" 
      style={{marginTop: 24}}
      extra={<Radio.Group defaultValue={7} onChange={onChange}>
        <Radio.Button value={7}>最近一周</Radio.Button>
        <Radio.Button value={30}>最近一月</Radio.Button>
        <Radio.Button value={365}>最近一年</Radio.Button>
      </Radio.Group>}
    >
      <Column {...config} />
    </ProCard>
  )
}