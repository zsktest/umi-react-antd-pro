
import { useEffect, useState } from "react";
import { Radio, Tooltip } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProCard from "@ant-design/pro-card";
import { useLocation } from "umi";

import { accountApi } from '@/api';
import { AccumulatedDataType } from '../data.d';

import styles from '../index.less';

export default ()=>{
  const [days, setDays]=useState(30);
  const [accumulatedData, setAccumulatedData]=useState<AccumulatedDataType[]>()
  const location:any = useLocation();

  useEffect(()=>{
    accountApi.userSummaryData({
      days, userUuid: location.query.userUuid
    }).then(res=>{
      if(res.success) {
        setAccumulatedData(res.data);
      }
    })
  }, [days])

  const onChange = (e:any)=>{
    setDays(e.target.value)
  }

  return (
    <ProCard 
        className={`${styles.bline} title-card-head`}
        style={{ marginTop: 24 }} 
        gutter={8} title="积累数据"
        extra={<Radio.Group defaultValue={30} onChange={onChange}>
          <Radio.Button value={30}>最近一月</Radio.Button>
          <Radio.Button value={365}>最近一年</Radio.Button>
        </Radio.Group>}
      >
      <div className={styles.box}>
        {accumulatedData?.map(item=>{
          return (
            <div className={styles.dataBox}>
              <h2>{item.name}
                <Tooltip placement="top" title={item.remark}>
                  <QuestionCircleOutlined style={{fontSize: 14, marginLeft: 8}}/>
                </Tooltip>
              </h2>
              <span>{item.value}</span>
            </div>
          )
        })}
      </div>
    </ProCard>
  )
}