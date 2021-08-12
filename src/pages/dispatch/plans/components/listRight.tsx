import { useState, useEffect } from 'react';
import { Table, Popover, Tag, Input } from 'antd'
import { ProfileOutlined, HistoryOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'

import Action from './listRightAction';
import { ListParams } from '@/models';
import type { FlagType } from '@/models';
import { robotrightdataType, ModalProps } from '../../data';
import styles from './../index.less';
import { dispatchApi } from '@/api';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<robotrightdataType>)=>{
  const [listData, setlistData] = useState([]);
  const [scheduleClientList, setscheduleClientList] = useState([])
  const [current, setCurrent] = useState(1);
  const [keywords, setKeywords] = useState();
  const [size] = useState(10);
  const [total, setTotal] = useState(0);

  // 列表信息
  useEffect(() => {
    getaccountUser({ page: current, size: size, key: keywords})
  }, []);
  const getaccountUser = (params: ListParams) => {
    dispatchApi.scheduleList(params).then((res) => {
      if (res.code === 200) {
        setlistData(res.data);
        setCurrent(res.page.page);
        setTotal(res.page.total);
      }
    });
  };
  const closeModal = (visible: FlagType) => {
    if (visible) {
      getaccountUser({ page: current, size: size, key: keywords});
    }
  }
  const pagination = {
    current,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
    onChange: (page: number) => {
      getaccountUser({ page, size: size, key: keywords});
    },
  };
  // 执行时间标题
  const nextinfo = (key: robotrightdataType) => {
    if (key.cronInterface.type === 'minute') {
      return (<p>每隔{ key.cronInterface.minute }分钟执行</p>)
    } else if (key.cronInterface.type === 'hour') {
      return (<p>每间隔{ key.cronInterface.hour }个小时,在第{ key.cronInterface.minute }分钟执行</p>)
    } else if (key.cronInterface.type === 'day') {
      return (<p>每天的{ key.cronInterface.hour }时{ key.cronInterface.minute }分执行</p>)
    } else if (key.cronInterface.type === 'week') {
      return(
        <p>每{key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length ==0 ? <span>天</span> :''}
          {key.cronInterface.dayOfWeeks.map((item:any, index:number)=>{
            switch (item) {
              case 2 :
                return (<span key={index}>周一、</span> )
              case 3 :
                return (<span key={index}>周二、</span> )
              case 4 :
                return (<span key={index}>周三、</span> )
              case 5 :
                return (<span key={index}>周四、</span> )
              case 6 :
                return (<span key={index}>周五、</span> )
              case 7 :
                return (<span key={index}>周六、</span> )
              case 1 :
                return (<span key={index}>周七、</span> )
              default:
                return
            }
          })}
          {key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length > 0 ? <span>{ key.cronInterface.hour }时{ key.cronInterface.minute }分执行</span> :''}
          {key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length < 1 ? <span>{ key.cronInterface.hour }时{ key.cronInterface.minute }分执行</span>: ''}
        </p>
      )
    } else if(key.cronInterface.type === 'month') {
      return(
        <p>{ key.cronInterface.month }月的每{key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length ==0 ? <span>一天</span> :''}
          {key.cronInterface.dayOfWeeks.map((item:any, index:number)=>{
            switch (item) {
              case 2 :
                return (<span key={index}>周一、</span> )
              case 3 :
                return (<span key={index}>周二、</span> )
              case 4 :
                return (<span key={index}>周三、</span> )
              case 5 :
                return (<span key={index}>周四、</span> )
              case 6 :
                return (<span key={index}>周五、</span> )
              case 7 :
                return (<span key={index}>周六、</span> )
              case 1 :
                return (<span key={index}>周七、</span> )
              default:
                return
            }
          })}
          {key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length > 0 ? <span>{ key.cronInterface.hour }时{ key.cronInterface.minute }分执行</span> :''}
          {key.cronInterface.dayOfWeeks !== 'undefind' && key.cronInterface.dayOfWeeks.length < 1 ? <span>{ key.cronInterface.hour }时{ key.cronInterface.minute }分执行</span>: ''}
        </p>
      )
    } else if (key.cronInterface.type === 'cron') {
      return (<p>用户自定义，鼠标点击查看下次运行时间</p>)
    } else if (key.cronInterface.type === 'timer') {
      return(<p>{ key.cronInterface.time }</p>)
    } else {
      return(<p>执行时间</p>)
    }
  }
  // 表格项
  const columns = [
    {
      title: '计划名称',
      dataIndex: 'name',
      render: (text: string, record: robotrightdataType) => <a onClick={() => {
        const data = {
          name: record.name,
          uuid: record.uuid
        }
        onCancel(true, data)
      }}>{text}</a>,
    },
    {
      title: '包含应用',
      dataIndex: 'robotName',
      render:(text: string, record: robotrightdataType) => (
        <>
          <span style={{marginRight: 8}}>{record.robots[0].name}</span>
          <Popover placement="bottom" title={'应用执行顺序'} content={
            record.robots.map((item: any, index:number)=>{
              return (
                <p key={index}>{item.name}</p>
              )
            })
          }>
            {record.robots.length > 1 ? <ProfileOutlined style={{opacity: 0.55}} /> : ''}
          </Popover>
        </>
      ),
    },
    {
      title: '执行时间',
      dataIndex: '',
      render:(text: string, record: robotrightdataType) => (
        <>
          {record.cronInterface.nextTime ? <span style={{marginRight: 8}}>{ record.cronInterface.nextTime }</span> : '--'}
          <Popover placement="bottom" title={() => nextinfo(record)} trigger="click" content={
            scheduleClientList.map((item: any, index:number)=>{
              return (
                <p className={styles.pname} style={{marginBottom: 0}} key={index}>{item}<span >...</span></p>
              )
            },
            )}>
            {record.cronInterface.nextTime ? <HistoryOutlined style={{opacity: 0.55}} onClick={ () => {
              const data = {
                cronExpress: record.cronInterface.cronExpress,
                dayOfWeeks: record.cronInterface.dayOfWeeks,
                hour: record.cronInterface.hour,
                minute: record.cronInterface.minute,
                month: record.cronInterface.month,
                time: record.cronInterface.time,
                type: record.cronInterface.type
              }
              dispatchApi.interfacePreview(data).then(res => {
                if (res.code === 200) {
                  setscheduleClientList(res.data)
                }
              })
            }} /> : ''}
          </Popover>
        </>
      ),
    },
    {
      title: '执行方式',
      dataIndex: 'phone',
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
            dispatchApi.scheduleClientList({scheduleUuid: record.uuid}).then(res => {
              if (res.code === 200) {
                setscheduleClientList(res.data)
              }
            })
          }} />
          </Popover>
        </>
      ),
    },
    // {
    //   title: '优先级',
    //   dataIndex: 'priorityName'
    // },
    {
      title: '操作',
      dataIndex: '',
      width: '14%',
      render:(text: string, record: robotrightdataType) => (
        <Action modalDataProps={record} isModalVisible={true} onCancel={closeModal}/>
      ),
    }
  ]
  return (
    <div>
      <div className={styles.listright}>
        <div className={styles.top}>
          <Input placeholder="输入计划名称" style={{ width: 200, marginBottom: 20, marginTop: 20 }} onPressEnter={()=>getaccountUser({page: current, size, key: keywords})} onChange={(e:any)=>setKeywords(e.target.value)} suffix={<SearchOutlined onClick={()=>getaccountUser({page: current, size, key: keywords})} style={{cursor: 'pointer'}} />} />
        </div>
        <div className={styles.con}>
        <Table
          columns={columns}
          dataSource={listData}
          pagination={pagination}
          rowKey="uuid"/>
        </div>
      </div>
    </div>
  );
}