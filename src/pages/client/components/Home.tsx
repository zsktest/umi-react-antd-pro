
import { useEffect, useState } from 'react';
import { Row, Col, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

import RobotRunTime from './RobotRunTime';
import RobotTaskTime from './RobotTaskTime';
import AppliedStatistics from './AppliedStatistics';
import { clientEnterpriseApi } from '@/api';
import { StatisticsDataType } from '../data.d';

import styles from '../index.less'; 

const { Paragraph } = Typography;
export default ()=>{
  const [statisticsData, setStatisticsData]=useState<StatisticsDataType>();
  const [inviteLink, setInviteLink] = useState();
  useEffect(()=>{
    clientEnterpriseApi.summaryData().then(res=>{
      if(res.success) {
        setStatisticsData(res.data);
      }
    })
  },[])

  useEffect(()=>{
    clientEnterpriseApi.inviteGetInviteLink().then(res=>{
      if(res.success) {
        setInviteLink(res.data.inviteLink);
      }
    })
  }, [])

  const onCopy=()=>{
    message.success('链接已复制到剪切板');
  }

  return (
    <div className={styles.clientHome}>
      <div className={styles.invitation}>
        <div className="invitation_right">
          <h1>邀请同事使用影刀，共享自动化高效办公</h1>
          <p>邀请链接：{inviteLink}</p>
          <div className="invitation_bottom">
            <div className="invitation_copy"> <Paragraph copyable={{
              text: inviteLink,
              onCopy: onCopy,
              icon: [<div><CopyOutlined />&nbsp;复制邀请链接</div>,<div><CopyOutlined />&nbsp;复制邀请链接</div>]
            }} style={{display:'inline',color: '#474F59'}}></Paragraph></div>
            <a href="https://www.winrobot360.com/team.html" target="_blank"><div className="invitation_hove">向团队介绍影刀</div></a>
          </div>
          <img src={require('@/assets/img/share_bg.png')} alt=""/>
        </div>
      </div>
      <Row justify="space-between" style={{marginTop: 24}} gutter={24}>
        <Col span={6}>
          <div className="index_app application">
            <img src={require('@/assets/img/icon_01.png')} alt="" />
            <h2>开发应用数</h2>
            <CountUp start={0} end={statisticsData?.robotCnt||0} />
          </div>
        </Col>
        <Col span={6}>
          <div className="index_app execution">
            <img src={require('@/assets/img/icon_02.png')} alt="" />
            <h2>累计执行时长(小时)</h2>
            <CountUp start={0} end={statisticsData?.totalRunHours||0} />
          </div>
        </Col>
        <Col span={6}>
          <div className="index_app Number">
            <img src={require('@/assets/img/icon_03.png')} alt="" />
            <h2>执行任务数</h2>
            <CountUp start={0} end={statisticsData?.totalRunCount||0} />
          </div>
        </Col>
        <Col span={6}>
          <div className="index_app manpower">
            <img src={require('@/assets/img/icon_04.png')} alt="" />
            <h2>相当于节省人力(天)</h2>
            <CountUp start={0} end={statisticsData?.totalRunWorkDays||0} />
          </div>
        </Col>
      </Row>
      <RobotRunTime />
      <RobotTaskTime />
      <AppliedStatistics />
    </div>
  )
}