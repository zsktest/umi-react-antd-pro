import { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Radio } from 'antd';
import { Area } from '@ant-design/charts';

import { clientEnterpriseApi } from '@/api';

export default ()=>{
  const [days, setDays] = useState(7);
  const [robotRunData, setRobotRunData] = useState([]);

  const onChange=(e:any)=>{
    setDays(e.target.value);
  }

  useEffect(()=>{
    clientEnterpriseApi.userAccumulate({days}).then(res=>{
      if(res.success) {
        setRobotRunData(res.data.dataRows);
      }
    })
  }, [days]);

  const config = {
    data: robotRunData,
    xField: '时间',
    yField: '运行时长',
    color: '#FF7F86',
    smooth: true,
    forceFit: true,
    lineDash: 'number',
    height: 400,
    xAxis: {
      tickCount: 8,
      range: [0, 1],
    },
  };

  return (
    <ProCard 
      className="title-card-head" 
      title="机器人累计运行时间(小时)" 
      style={{marginTop: 24}}
      extra={<Radio.Group defaultValue={7} onChange={onChange}>
        <Radio.Button value={7}>最近一周</Radio.Button>
        <Radio.Button value={30}>最近一月</Radio.Button>
        <Radio.Button value={365}>最近一年</Radio.Button>
      </Radio.Group>}
    >
      <Area {...config}/>
    </ProCard>
  )
}