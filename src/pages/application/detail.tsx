import React, { useState, useEffect, useRef } from 'react';
import { useModel, useLocation } from 'umi';
import { message, Tabs } from 'antd';
import ProCard from "@ant-design/pro-card";
// import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import TransferModal from './components/RobotInfo'
import AccumulatedData from './components/AccumulatedData'
import GetDetails from './components/GetDetails';
import UsageRecord from './components/UsageRecord';
import { applicationApi, userApi } from '@/api';

import styles from './index.less';

const { TabPane } = Tabs;

export default () => {
  const [detail, setDetail] = useState<any>([]);
  const [tabActiveKey, setTabActiveKey] = useState('1')

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  const location: any = useLocation();
  // 获取基本信息
  const getrobotDetailBO = () => {
    const data = {
      robotUuid: location.query.robotUuid,
      enterpriseUuid: enterpriseUuid.current
    }
    applicationApi.robotDetailBO(data).then(res => {
      if (res.code === 200) {
        setDetail(res.data)
      }
    })
  }
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getrobotDetailBO()
      userApi.recordLog({ spm: 'o.c.1' });
    }
  }, [initialState])
  const callback = (key: string) => {
    setTabActiveKey(key)
  }
  return (
    <div className={styles.application_detail}>
      {detail.uuid && <TransferModal robotDetial={detail} />}
      <div className="tabs">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="总览" key="1">
          </TabPane>
          <TabPane tab="使用说明" key="2">
          </TabPane>
        </Tabs>
      </div>
      {tabActiveKey === '1' &&<div>
        <AccumulatedData />
        <GetDetails />
        <UsageRecord />
      </div>}
      {tabActiveKey === '2' &&
        <div className="detail_rule" dangerouslySetInnerHTML={{__html: detail.instruction ? detail.instruction : '<span>暂无内容</span>'}}></div>
      }
    </div>
  );
}

