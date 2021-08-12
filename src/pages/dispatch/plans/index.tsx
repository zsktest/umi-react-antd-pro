import React, { useState, useEffect } from 'react';
import { Prompt } from 'react-router';
import { Tabs, Button } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
const { TabPane } = Tabs

import ListLeft from './components/listLeft'
import ListRight from './components/listRight'
import styles from './index.less';
import {createWebSocket,closeWebSocket} from '../websocket';


export default function IndexPage() {

  const [active, setactive] = useState('1');
  const [dataList, setdataList] = useState({})
  const [ibleList, setibleList] = useState(true)

  useEffect(() => {
    let url="ws://dev-api.winrobot360.com:8079/ws/console?accessToken=397286b5-4b5a-4f1c-afa0-c4654631e9e1";//服务端连接的url
		createWebSocket(url)
    // sendWebSocket(sendWebSocketdata)
  }, [])

  const licenseModalList = {
    isModalVisible: ibleList,
    onCancel: (flag:boolean, key:any)=>{
    },
    modalDataProps: dataList || undefined,
  }
  const licenseModalRight = {
    isModalVisible: false,
    onCancel: (flag:boolean, key:any)=>{
      setactive('1');
      setdataList(key)
      // setPostModalVisible(false);
    },
    modalDataProps: undefined,
  }
  return (
    <div className={styles.account}>
      <Tabs defaultActiveKey={active} activeKey={active} onChange={(e) => {
        setactive(e);
        if (e === '1') {
          setibleList(true)
        } else {
          setibleList(false)
        }
        
      }} tabBarExtraContent={
        <div>
          <Button icon={<ReloadOutlined />}>刷新</Button>
          <div className={styles.acconut_rightuser}><PlusOutlined />新建计划</div>
        </div>
      }>
        <TabPane tab="执行计划" key='1'>
          <ListLeft { ...licenseModalList } />
        </TabPane>
        <TabPane tab="计划列表" key='2'>
          <ListRight { ...licenseModalRight } />
        </TabPane>
      </Tabs>
      <Prompt message={() => {
        console.log('离开plans');
        closeWebSocket()
        return true;
        }
      }></Prompt>
    </div>
  );
}