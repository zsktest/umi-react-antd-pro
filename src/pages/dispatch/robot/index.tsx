import { useState, useEffect, useRef } from 'react';
import { Prompt } from 'react-router';
import { Timeline, Button, Tooltip, Select, Input, Radio, Switch, Table, Tag, Empty, Badge, Pagination, Dropdown, Menu, Modal, message, Spin } from 'antd';
import { QuestionCircleOutlined, WindowsFilled, DesktopOutlined, ProfileOutlined, SearchOutlined, UnorderedListOutlined, AppstoreOutlined, ReloadOutlined, EyeOutlined, WindowsOutlined, EllipsisOutlined, CloseOutlined } from '@ant-design/icons'
import { request } from 'umi';
import PubSub from 'pubsub-js';
const { Option } = Select;

import styles from './index.less';
import Action from '../components/action';
import Isdrawer from '../components/isdrawer';
import { ListParams } from '@/models';
import type { FlagType } from '@/models';
import { robotrightdataType } from '../data';
import { dispatchApi } from '@/api';
import {sendWebSocket,createWebSocket,closeWebSocket} from '../websocket';

export default function IndexPagehome() {
  const [accountUser, setaccountUser] = useState<any>({});
  const [keywords, setKeywords] = useState();
  const [Keyopen, setKeyopen] = useState();
  const [modalInfo, setModalInfo] = useState<any>({});
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [imgshow, setimgShow] = useState(false);
  const [loadimgpro, setloadimgpro] = useState(false)
  const [proImgname, setproImgname] = useState<any>('')
  const [timeoutitem, settimeoutitem] = useState(5)
  const totalTimeRef = useRef(timeoutitem);
  const clock: any = useRef();
  const onChangetimeoutObjpro: any = useRef();
  const [imgindex, setimgindex] = useState('')
  const [list, setList] = useState('1')
  const [listData, setlistData] = useState <any>([])
  const [current, setCurrent] = useState(1);
  const [size] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let url="ws://dev-api.winrobot360.com:8079/ws/console?accessToken=397286b5-4b5a-4f1c-afa0-c4654631e9e1";//服务端连接的url
		createWebSocket(url)
    // sendWebSocket(sendWebSocketdata)
  }, [])
  useEffect(() => {
    dispatchApi.clientStatusCount().then(res => {
      if(res.code === 200) {
        setaccountUser(res.data)
      }
    })
  }, []);

  const closeModal = (visible: FlagType) => {
    if (visible) {
      clientList({ page: current, size: size}, '');
    }
  }
  const licenseModalProps = {
    isModalVisible: postModalVisible,
    onCancel: (flag:boolean)=>{
      setPostModalVisible(false);
    },
    modalDataProps: modalInfo,
  }

  // 刷新
  const websockreload = (() => {
    message.success('日志刷新成功')
    clientList({ page: current, size: size, key: keywords, status: Keyopen}, '')
  })
  // 搜索
  const setKeywordsonChange = (() => {
    clientList({ page: current, size: size, key: keywords, status: Keyopen}, '')
  })
  // 查看大图
  const hoverimg = ((item: any) => {
    window.clearInterval(clock.current);
    PubSub.unsubscribe('message')
    setimgShow(true)
    setloadimgpro(false)
    setproImgname(item)
    const dataweb = {
      id: '1',
      method: 'notifyRefreshScreenshot',
      params: {
        height: 2000,
        robotClientUuids: [item.uuid],
        width: 1800
      }
    }
    sendWebSocket(dataweb)
    let websocketResult = ''
    PubSub.subscribe('message', function (status: any, data: any) {
      console.log(data)
      const params = data.params;
      if (data.result) {
        websocketResult = data.result.requestUuid
      }
      if (params) {
        if (websocketResult === params.requestUuid) {
          setimgindex(params.url)
          timecokde(item)
          return setloadimgpro(true)
        }
      }
    })
  })
  // 参看大图倒计时
  const timecokde = (key: any) => {
    clock.current = window.setInterval(() => {
      settimeoutitem(totalTimeRef.current);
      totalTimeRef.current--;
      settimeoutitem(totalTimeRef.current);
      if (totalTimeRef.current === 0) {
        totalTimeRef.current = 5;
        settimeoutitem(5);
        hoverimg(key)
      }
    }, 1000);
  }
  useEffect(() => {
    clientList({ page: current, size: size, key: keywords, status: Keyopen}, '')
  }, [])
  const clientList = (params: ListParams, key: any) => {
    dispatchApi.clientList(params).then((res) => {
      if (res.code === 200) {
        setlistData(res.data)
        setCurrent(res.page.page);
        setTotal(res.page.total);
        const data = (res.data.map((key: any) => {
          return key.uuid
        }))
        const dataweb = {
          id: '1',
          method: 'notifyRefreshScreenshot',
          params: {
            height: 121,
            robotClientUuids: data,
            width: 194
          }
        }
        webSocketLink(dataweb, res.data)
      }
    });
  }
  const webSocketLink = (key: any, name: any) => {
    sendWebSocket(key)
    let websocketResult = ''
    let temp = '';
    PubSub.subscribe('message', function (status: any, data: any) {
      //message 为接收到的消息  这里进行业务处理
      const params = data.params;
      if (data.result) {
        websocketResult = data.result.requestUuid
      }
      if (params) {
        if (websocketResult === params.requestUuid) {
          temp = name.map((item:any) => {
            if (item.uuid === params.robotClientUuid) {
              item.img = params.url
            } else {
            }
            return item
          })
        }
      }
      return setlistData(temp || name)
    })
  }
  const pagination = {
    current,
    total,
    pageSize: 20,
    showQuickJumper: true,
    showSizeChanger: false,
    onChange: (page: number) => {
      clientList({ page, size: size, key: keywords, status: Keyopen}, '');
    },
  };
  // 表格项
  const columns = [
    {
      title: '机器人账号',
      dataIndex: 'robotClientName'
    },
    {
      title: '主机名',
      dataIndex: 'machineName'
    },
    {
      title: '预览',
      detaIndex: 'img',
      render:(text: string, record: robotrightdataType) => (
        <>
          <div className={styles.bableList}>
            {/* onclick="hoverimg(record)" */}
            {record.img ? <div className={styles.hover} onClick={() => hoverimg(record)}><EyeOutlined /></div> : null}
            {record.img ? <img src={record.img} alt="" /> : <div className={styles.icons}><WindowsOutlined style={{ color: 'rgba(0, 0, 0, 0.45)'}} /></div>}
          </div>
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'phone',
      render:(text: string, record: robotrightdataType) => (
        (record.status === 'running' || record.status === 'allocated' ? <Tag color="blue">{ record.statusName }</Tag> : record.status === 'idle' ? <Tag color="green">{ record.statusName }</Tag> : <Tag>{ record.statusName }</Tag>)
      )
    },
    {
      title: '当前执行任务',
      dataIndex: 'currentRobotName',
      render:(text: string, record: robotrightdataType) => (
        <>
        {record.currentRobotName ? <span style={{cursor: 'pointer', color: '#2488e5'}} onClick={() => {
          const data = {
            sceneInstUuid: record.currentSceneInstUuid,
            robotClientUuid: record.uuid
          }
          setModalInfo(data)
          setPostModalVisible(true)
        }}>{ record.currentRobotName }</span> :
        <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>- -</span>}
        </>
      )
    },
    {
      title: '操作',
      dataIndex: '',
      width: '18%',
      render:(text: string, record: robotrightdataType) => (
        <Action modalDataProps={record} isModalVisible={true} onCancel={closeModal}/>
      )
    }
  ]

  // 切换预览模式
  const groupChange = (e: any) => {
    console.log(e.target.value)
    setList(e.target.value)
  }
  return (
    <div>
      <div className={styles.account} style={{display: 'none'}}>
        <div className={styles.account_title}>
          <h1>可被调度的机器人</h1>
          <span className={styles.account_user}><DesktopOutlined />(0)</span>
        </div>
        <div className={styles.top_cons}>
          <div className={styles.top_cons1}>
            <h1>什么是调度？</h1>
            <p>调度是集中管理机器人与计划执行的能力中心，可统一对机器人查看与管理、统一对安排自动计划执行、监控管理计划的运行情况等。</p>
            <div className={styles.top_cons2}>
              <Timeline>
                <Timeline.Item dot={1}>
                  <p>配置机器人</p>
                  <span>在影刀客户端，将工作模式改为“机器人模式”</span>
                </Timeline.Item>
                <Timeline.Item dot={2}>
                  <p>新建计划</p>
                  <span>在“计划执行”中新建计划</span>
                </Timeline.Item>
                <Timeline.Item  dot={3}>
                  <p>查看和管理执行记录</p>
                  <span>在“执行记录”中，查看和管理计划的执行记录</span>
                </Timeline.Item>
              </Timeline>
              <img src={require('@/assets/img/bg_default.png')} alt="" />
            </div>
            <a href="https://www.winrobot360.com/doc/%E7%AE%A1%E7%90%86%E6%96%87%E6%A1%A3/%E8%B0%83%E5%BA%A6%E7%AE%A1%E7%90%86.html" target="_blank"><Button icon={<ProfileOutlined />}>了解更多</Button></a>
            <div style={{height: 40}}></div>
          </div>
        </div>
      </div>
      <div className={styles.account}>
        <div className={styles.account_title}>
          <h1>可被调度的机器人</h1>
          <Tooltip placement="top" title={<span>在线机器人 { accountUser.usable } 个</span>}>
            <span className={styles.account_user}><DesktopOutlined />(<em>{ accountUser.usable }</em>/{ accountUser.total })</span>
          </Tooltip>
          <div className={styles.right_shos1}>
            <a href="https://www.winrobot360.com/doc/%E7%AE%A1%E7%90%86%E6%96%87%E6%A1%A3/%E8%B0%83%E5%BA%A6%E7%AE%A1%E7%90%86.html" target="_blank"><QuestionCircleOutlined />帮助</a>
          </div>
        </div>
        <div className={styles.titlelist}>
          <div className={styles.titlelist1}>
            <span className={styles.titlecpsn}>状态</span>
            <Select defaultValue="" onChange={(e:any) => clientList({ page: current, size: size, key: keywords, status: e}, setKeyopen(e))} bordered={false} style={{ width: 80, float: 'right'}}>
              <Option value="">全部</Option>
              <Option value="idle">空闲</Option>
              <Option value="running">运行中</Option>
              <Option value="offline">离线</Option>
            </Select>
          </div>
          <Input placeholder="输入计划名称"
            style={{ width: 200 }}
            onPressEnter={()=>setKeywordsonChange()}
            onChange={(e:any)=>setKeywords(e.target.value)}
            suffix={<SearchOutlined onClick={() => setKeywordsonChange()} style={{cursor: 'pointer'}} />} />
          <Radio.Group defaultValue="1" onChange={groupChange} buttonStyle="solid">
            <Radio.Button value="1">
              <Tooltip title="预览模式">
                <AppstoreOutlined />
              </Tooltip>
            </Radio.Button>
            <Radio.Button value="2">
              <Tooltip title="列表模式">
                <UnorderedListOutlined />
              </Tooltip>
            </Radio.Button>
          </Radio.Group>
          <div className={styles.right_shos}>
            <div className={styles.right_shos2}>
              5s自动刷新 <Switch onChange={(checked) => {
                console.log(checked)
                if (checked) {
                  onChangetimeoutObjpro.current = window.setInterval(() => {
                    console.log(1)
                  }, 5000);
                } else {
                  window.clearInterval(onChangetimeoutObjpro.current);
                }
              }} size="small" v-model="defaults" />
            </div>
            <Button onClick={() => websockreload()} icon={<ReloadOutlined />}>刷新</Button>
          </div>
        </div>
        {list === '1' ?
          <div>
            {listData.length > 0 ? 
              <>
                <div className={styles.windows_list}>
                  <ul>
                    {listData.map((item:any, index: number) => {
                      return (
                        <li key={index}>
                          {item.img ? <div className={styles.hover} onClick={() => hoverimg(item)} v-if="item.img"><EyeOutlined />预览</div> : ''}
                          {item.img ? <img src={item.img} alt="" /> : <div className={styles.icons}><WindowsFilled /></div>}
                          <p style={{paddingLeft: 3}}>
                            <span className={styles.procces}>
                              {
                                item.status === 'running' || item.status === 'allocated' ? <Badge status="processing" /> :
                                item.status === 'idle' ? <Badge status="success" /> :
                                item.status === 'abnormal' ? <Badge status="error" /> :
                                item.status === 'offline' ? <Badge status="default" /> : <Badge status="default" />
                              }
                            </span>
                            { item.robotClientName }
                            <Dropdown overlay={
                              <Menu>
                                {
                                  item.actions.map((item:any, index:number) => {
                                    return <Menu.Item key={index}onClick={() => {
                                      Modal.confirm({
                                        title: '提示',
                                        // content: `确认要${ item.name }${ (modalDataProps?.sceneName ? modalDataProps?.sceneName : '') }`,
                                        content: (item.remark ? item.remark : `确认要${ item.name }${ (item.sceneName ? item.sceneName : '') }`),
                                        icon: <QuestionCircleOutlined />,
                                        onOk() {
                                          var data = {}
                                          for (const items of item.params) {
                                            let code = ''
                                            code = items.key
                                            data[code] = items.value
                                          }
                                          request(item.path, {
                                            method: item.method,
                                            params: data,
                                          }).then((res: { code: number; }) => {
                                            if (res.code === 200) {
                                              message.success(item.name + '成功')
                                              clientList({ page: current, size: size, key: keywords, status: Keyopen}, '')
                                            }
                                          })
                                        },
                                      });
                                    }}>{ item.name }</Menu.Item>
                                  })
                                }
                                {/* <Menu.Item key="delete">删除</Menu.Item> */}
                              </Menu>
                            }>
                              <EllipsisOutlined style={{float: 'right', marginTop: 3}} />
                            </Dropdown>
                          </p>
                          <p className={styles.iconsname}>
                            <DesktopOutlined />  &nbsp;{ item.machineName }
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <Pagination { ...pagination } style={{float: 'right', marginRight: 24}} />
              </>
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{marginTop: 100}} />
            }
          </div> :
          <div style={{paddingLeft: '24px', paddingRight: '24px'}}>
            <Table
            columns={columns}
            dataSource={listData}
            pagination={pagination}
            rowKey="uuid"/>
          </div>
        }
      </div>
      {imgshow ? 
      <div>
        <div className={styles.ant_image_preview_mask}></div>
        <div className={styles.ant_image_preview_wrap}>
          <div className={styles.ant_image_preview_body}>
            <ul className={styles.ant_image_preview_operations}>
              <li className={styles.ant_image_preview_operations_operation} onClick={() => {
                setimgShow(false)
                setloadimgpro(false)
                window.clearInterval(clock.current);
                PubSub.unsubscribe('message')
              }} style={{marginRight: 16 }}>
                <CloseOutlined style={{clear: 'both', fontSize: 18}} />
              </li>
              <Button size="small" onClick={() => hoverimg(proImgname)} type="ghost" style={{color: '#fff'}}>刷新</Button>
              <li style={{ marginRight: 24}}>{ timeoutitem }s后刷新</li>
              <li style={{ marginRight: 24}}>主机名：{ proImgname.machineName }</li>
              <li style={{ marginRight: 24}}>机器人账号：{ proImgname.robotClientName }</li>
            </ul>
            <div className={styles.sant_image_preview_img_wrapper}>
              {loadimgpro ? <img className={styles.ant_image_preview_img} src={imgindex} /> : <Spin style={{margin: '0 auto', display: 'block', marginTop: '-20%'}} size="large" />}
            </div>
          </div>
        </div>
      </div> : null
      }
      <Isdrawer {...licenseModalProps} />
      <Prompt message={() => {
        console.log('离开robot');
        closeWebSocket()
        window.clearInterval(onChangetimeoutObjpro.current);
        window.clearInterval(clock.current);
        PubSub.unsubscribe('message')
        return true;
        }
      }></Prompt>
    </div>
  );
}
