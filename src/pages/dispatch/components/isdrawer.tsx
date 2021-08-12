import { useState, useEffect, useMemo } from 'react';
import { Drawer, Row, Col, Tabs, Button, Timeline, Tag, message, Table } from 'antd'
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons'
const { TabPane } = Tabs;

import Action from './action';
import type { FlagType } from '@/models';
import { robotrightdataType, ModalProps } from '../data';
import styles from './index.less';
import { dispatchApi } from '@/api';
import {sendWebSocket} from '../websocket';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<robotrightdataType>)=>{
  const [detailData, setdetailData] = useState<any>([]);
  const [detaillist, setdetaillist] = useState<any>([]);
  const [rizhiList, setrizhiList] = useState([]);
  const [name, setname] = useState({});
  const [listnametitle, setlistnametitle] = useState('');
  const [childrenDrawer, setchildrenDrawer] = useState(false);
  const [current, setCurrent] = useState(1);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const webjournal = (item: any, key: number) => {
    setname(item)
    let data = {
      id: '1',
      method: 'notifyUploadJobLog',
      params: {
        'sceneInstJobUuid': item.uuid,
        'page': key,
        'size': size
      }
    }
    setlistnametitle(item.robotName)
    sendWebSocket(data)
    PubSub.subscribe('message', function (status: any, data: any) {
      if (data.code === 400) {
        message.warning(data.msg)
      }
      if (data.params) {
        let rizhi = data.params.logs.map((key: any, index: number) => {
          key.id = index
          return key
        })
        setCurrent(data.params.page.page);
        setTotal(data.params.page.total);
        setrizhiList(rizhi)
        if (data.params.logs.length === 0) {
          message.warning('暂无日志')
        } else {
          setchildrenDrawer(true)
        }
      }
    })
  }
  // 关闭抽屉
  const handleCancel = () => {
    onCancel(false, '');
  };
  const closeModal = (visible: FlagType) => {
    if (visible) {
    }
  }
  // 关闭第二层抽屉
  const onChildrenDrawerClose = () => {
    setchildrenDrawer(false)
    PubSub.unsubscribe('message')
  };
  // 详情
  useEffect(() => {
    if(isModalVisible) {
      dispatchApi.processDetail(modalDataProps).then(res => {
        if (res.code === 200) {
          setdetailData(res.data)
          setdetaillist(res.data.sceneInstJobs)
        }
      })
    }
  }, [isModalVisible]);

  const refresh = () => {
    dispatchApi.processDetail(modalDataProps).then(res => {
      if (res.code === 200) {
        setdetailData(res.data)
        setdetaillist(res.data.sceneInstJobs)
      }
    })
  }

  const websockreload = () => {
    webjournal(name, current)
  }

  const pagination = {
    current,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
    onChange: (page: number) => {
      webjournal(name, page)
    },
  };

  const rizColumns = [
    {
      title: '类型',
      dataIndex: 'level',
      width: '10%',
      scopedSlots: { customRender: 'level' }
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: '30%'
    },
    {
      title: '内容',
      dataIndex: 'text',
      with: '60%',
      scopedSlots: { customRender: 'action' }
    }
  ]
  return (
    <div>
      <Drawer
        title="计划执行详情"
        width={520}
        visible={isVisible}
        onClose={handleCancel}
      >
        <div>
          <Row>
            <Col span={12}>
            <div className={styles.drawername}>
              <p>机器人账号：</p>
              <span className={styles.drawernames}>{ detailData.robotClientName }</span>
            </div>
            </Col>
            <Col span={12}>
              <div className={styles.drawername}>
                <p>执行结果：</p>
                {detailData.clientSceneInstStatus === 'running' || detailData.clientSceneInstStatus === 'allocated' ? <Tag color="blue">{ detailData.clientSceneInstStatusName }</Tag> : 
                detailData.clientSceneInstStatus === 'idle' ? <Tag color="green">{ detailData.clientSceneInstStatusName }</Tag> : <Tag>{ detailData.clientSceneInstStatusName }</Tag>}
              </div>
            </Col>
            <Col span={24}>
            <Tabs tabBarExtraContent={<Button onClick={() => refresh()}>刷新</Button>}>
              <TabPane tab="应用运行记录" key="1" className={styles.clsrecord}>
                <Timeline>
                  {detaillist.map((item: any) =>{
                    return (
                      <Timeline.Item key={item.uuid} dot={item.status == 'running' ? <LoadingOutlined  style={{fontSize: '16px', color: '#1890ff'}} /> : ''} color={item.status== 'finish' ? '#1890FF' : 'gray' && item.status == 'error' ? 'red' : 'gray'}>
                        <h1>
                          { item.robotName }
                          <Action modalDataProps={item} isModalVisible={true} onCancel={closeModal}/>
                          <a  onClick={()=>webjournal(item, 1)}>日志</a>
                        </h1>
                        <div className={styles.timelist}>
                          <p>运行时间：
                            {item.startTime ? <span>{ item.startTime.substring(5,20) }</span>: ''}
                            {item.startTime && item.endTime ? <em>~</em> : ''}
                            {item.endTime ? <span>{ item.endTime.substring(5,20) }</span> : ''}
                            </p>
                          <div style={{marginTop: 30}}>
                            {item.status == 'finish' || item.status == 'running' ? <span className="complete">{ item.statusName }</span> : item.status == 'error' ? <span className="abnormal">{ item.statusName }:&nbsp;&nbsp;{ item.remark }</span> : <span className="unexecuted">{ item.statusName }</span>}
                          </div>
                        </div>
                      </Timeline.Item>
                    )
                  })}
                </Timeline>
              </TabPane>
            </Tabs>
            </Col>
          </Row>
        </div>
        <Drawer
            title="日志"
            width={700}
            closable={true}
            onClose={onChildrenDrawerClose}
            visible={childrenDrawer}
          >
            <div className={styles.drawertitle}>
              <h1>{ listnametitle }</h1>
              <Button onClick={() => websockreload()} icon={<ReloadOutlined />}>刷新</Button>
            </div>
            <Table
              columns={rizColumns}
              dataSource={rizhiList}
              pagination={pagination}
              rowKey="id"/>
            {/* {childrenDrawer && (
              <Table
              columns={rizColumns}
              dataSource={rizhiList}
              pagination={pagination}
              rowKey="id"/>
            )} */}
          </Drawer>
      </Drawer>
    </div>
  );
}