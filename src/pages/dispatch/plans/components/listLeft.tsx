import React, { useState, useEffect } from 'react';
import { Tooltip, Input, Table, Popover, Tag } from 'antd'
import { MenuFoldOutlined, SearchOutlined, CarryOutOutlined, ProfileOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import Isdrawer from '../../components/isdrawer';
import Action from '../../components/action';
import { ListParams } from '@/models';
import type { FlagType } from '@/models';
import { robotrightdataType, ModalProps } from '../../data';
import styles from './../index.less';
import { dispatchApi } from '@/api';


export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<robotrightdataType>)=>{
  const [folding, setfolding] = useState(false);
  const [listUseryData, setlistUseryData] = useState([])
  const [listData, setlistData] = useState([])
  const [scheduleClientList, setscheduleClientList] = useState([])
  const [modalInfo, setModalInfo] = useState<any>({});
  const [hover, sethover] = useState(-1)
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [sourceUuid, setsourceUuid] = useState('')
  const [current, setCurrent] = useState(1);
  const [size] = useState(20);
  const [keywords, setKeywords] = useState();
  const [rightTotal, setRightTotal] = useState(0);
  const [RightCurrent, setRightCurrent] = useState(1);
  const [rightZize] = useState(10);
  const [total, setTotal] = useState(0);

  // 隐藏显示左侧内容
  const comfold = ()=>{
    if (folding) {
      setfolding(false)
    } else {
      setfolding(true)
    }
  }
  const closeModal = (visible: FlagType) => {
    if (visible) {
      getsceneinstlist({ page: RightCurrent, size: rightZize});
    }
  }
  
  const setKeywordsonChange = ((e: any) => {
    setKeywords(e.target.value)
    modalDataProps.name = e.target.value
    if (!e.target.value) {
      setKeywords(e.target.value)
      getlistSummary({ page: current, size: size})
    }
  })
  // 左侧菜单
  useEffect(() => {
    onhangeEnabledStatus(modalDataProps, hover)
    getlistSummary({ page: current, size: size, key: keywords})
  }, []);
  useEffect(() => {
    if (modalDataProps.uuid) {
      onhangeEnabledStatus(modalDataProps, 0)
      getlistSummary({ page: current, size: size, key: modalDataProps.name})
    }
  }, [modalDataProps.uuid])
  const getlistSummary = (params: ListParams) => {
    dispatchApi.listSummary(params).then((res) => {
      if (res.code === 200) {
        setlistUseryData(res.data);
        setCurrent(res.page.page);
        setRightTotal(res.page.total);
      }
    });
  };
  // 左侧点击搜索
  const onhangeEnabledStatus = (e: any, key: number) => {
    sethover(key)
    setsourceUuid(e.uuid)
    getsceneinstlist({ page: 1, size: rightZize, sourceUuid: e.uuid})
  }
  // 右侧列表
  useEffect(() => {
    getsceneinstlist({ page: RightCurrent, size: rightZize, sourceUuid: sourceUuid})
  }, []);
  const getsceneinstlist = (params: ListParams) => {
    dispatchApi.sceneinstlist(params).then((res) => {
      if (res.code === 200) {
        setlistData(res.data);
        setRightCurrent(res.page.page);
        setTotal(res.page.total);
      }
    });
  };
  const pagination = {
    RightCurrent,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
    onChange: (page: number) => {
      getsceneinstlist({ page, size: rightZize, sourceUuid: sourceUuid});
    },
  };
  const licenseModalProps = {
    isModalVisible: postModalVisible,
    onCancel: (flag:boolean)=>{
      setPostModalVisible(false);
    },
    modalDataProps: modalInfo,
  }
  const expandedRowRender = (e: any) => {
    const columns = [
      {
        title: '机器人账号',
        width: '20%',
        dataIndex: 'robotClientName'
      },
      {
        title: '执行结果',
        width: '20%',
        dataIndex: 'clientStatusName'
      },
      {
        title: '操作',
        width: '60%',
        dataIndex: 'clientStatus',
        render:(text: string, record: robotrightdataType) => (
          <>
            <a onClick={() => {
              const data = {
                sceneInstUuid: e.uuid,
                robotClientUuid: record.robotClientUuid
              }
              setModalInfo(data)
              setPostModalVisible(true)
            }}>详情</a>
          </>
        )
      },
    ]
    return <Table columns={columns} dataSource={e.sceneInstClients} rowKey="robotClientUuid" pagination={false} />;
  }
  const columns = [
    {
      title: '计划名称',
      dataIndex: 'sceneName',
      render:(text: string, record: robotrightdataType) => (
        <>
          <span style={{marginRight: 8}}>{record.sceneName}</span>
          <Popover placement="bottom" title={'包含应用'} content={
            record.robots.map((item: any, index:number)=>{
              return (
                <p key={index}>{item.name}</p>
              )
            })
          }>
            <ProfileOutlined style={{opacity: 0.55}} />
          </Popover>
        </>
      ),
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      render:(text: string, record: robotrightdataType) => (
        <>
          {record.createTime ? <span>{ record.createTime.substring(5,16) }</span> : ''}
          {record.runTimes ? <span className={styles.numbername}>第{ record.runTimes }次</span> : ''}
        </>
      )
    },
    {
      title: '执行方式',
      dataIndex: 'executeScopeName',
      render:(text: string, record: robotrightdataType) => (
        <>
          <span style={{marginRight: 8}}>{record.executeScopeName}</span>
          <Popover placement="bottom" title={'应用执行顺序'} trigger="click" content={
            scheduleClientList.map((item: any, index:number)=>{
              return (
                <div key={index}>
                  <span style={{ marginRight: 8 }}>{item.robotClientName}</span>
                  {item.status === 'running' || item.status === 'allocated' ? <Tag color="blue">{ item.statusName }</Tag> : item.status === 'idle' ? <Tag color="green">{ item.statusName }</Tag> : <Tag>{ item.statusName }</Tag>}
                </div>
              )
            })
          }>
            <ExclamationCircleOutlined style={{opacity: 0.55}} onClick={ () => {
            dispatchApi.scheduleClientList({scheduleUuid: record.sourceUuid}).then(res => {
              if (res.code === 200) {
                setscheduleClientList(res.data)
              }
            })
          }} />
          </Popover>
        </>
      ),
    },
    {
      title: '执行结果',
      dataIndex: 'currentRobotName1',
      render:(text: string, record: robotrightdataType) => (
        <>
        {record.status === 'waiting' ? <Tag color="green" >{ record.statusName }</Tag> : record.status === 'running' ? <Tag color="blue" >{ record.statusName }</Tag> : record.status === 'error' ? <Tag color="red" >{ record.statusName }</Tag> : <Tag>{ record.statusName }</Tag>}
        </>
      )
    },
    {
      title: '错误备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: '',
      width: '16%',
      render:(text: string, record: robotrightdataType) => (
        <Action modalDataProps={record} isModalVisible={true} onCancel={closeModal}/>
      )
    }
  ]
  

  return (
    <>
      <div className={styles.constns}>
        <div className={styles.comleft} style={{width: (folding? '0': '260px')}}>
          <div className={`menufold ${folding? 'foldalt': ''}`} onClick={()=>comfold()}>
            <Tooltip placement="top" title={folding? '展开': '收起'}>
              <MenuFoldOutlined className={folding ? 'menufoldrighs' : ''} />
            </Tooltip>
          </div>
          <Input placeholder="输入计划名称" className={styles.imnname} allowClear value={modalDataProps.name} defaultValue={modalDataProps.name}
          onPressEnter={()=>getlistSummary({page: current, size, key: keywords})}
          onChange={setKeywordsonChange} suffix={<SearchOutlined
          onClick={()=>getlistSummary({page: current, size, key: keywords})} style={{cursor: 'pointer'}} />} />
          <div className={styles.listUserycons}>
            <ul>
              <li onClick={() => onhangeEnabledStatus('', -1)} className={hover === -1 ? styles.alt : ''}>
                <img src={require('@/assets/img/icon_allplan.png')}/>
                <p>全部计划执行记录</p>
              </li>
              {listUseryData.map((item: any, index: number) =>{
                return <li  onClick={() => onhangeEnabledStatus(item, index)} key={item.uuid} className={hover === index ? styles.alt : ''}><CarryOutOutlined /><p>{item.name}</p></li>
              })}
            </ul>
          </div>
        </div>
        <div className={styles.comright} style={{padding: 20}}>
          <h1>计划执行记录</h1>
          <Table
          columns={columns}
          dataSource={listData}
          expandable={{expandedRowRender: record => expandedRowRender(record)}}
          pagination={pagination}
          rowKey="uuid"/>
        </div>
      </div>
      <Isdrawer {...licenseModalProps} />
    </>
  );
}