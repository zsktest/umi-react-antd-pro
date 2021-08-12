import React, { useState, useEffect } from 'react';
import { Row, Col, Tooltip, Radio, Table } from 'antd';
import { Area } from '@ant-design/charts';
import CountUp from 'react-countup';

import { ListParams, ModalCharts } from '@/models';
import { homeApi, userApi } from '@/api';
import styles from './index.less';

export default function IndexPage() {
  const [dataSource, setdataSource] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [size] = useState(10);
  const [sortBy, setsortBy] = useState('');
  const [sortOrder, setsortOrder] = useState('');
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [days, setdays] = useState('7');
  const [lastTop, setlastTop] = useState<any>({});

  useEffect(() => {
    userApi.recordLog({ spm: 'o.f' });
    getsummaryData();
  }, []);

  // 首页TOP数据
  const getsummaryData = () => {
    homeApi.summaryData().then((res) => {
      if (res.code === 200) {
        setlastTop(res.data);
      }
    });
  };

  // 面积图-应用运行时长
  const getdayUser = (params: ModalCharts) => {
    homeApi.dayUser(params).then((res) => {
      if (res.code === 200) {
        setData(res.data.dataRows);
      }
    });
  };
  const onChange = (e: any) => {
    switch (e.target.value) {
      case 'year':
        setdays('365');
        break;
      case 'month':
        setdays('30');
        break;
      case 'week':
        setdays('7');
        break;
    }
  };

  const config = {
    data: data,
    xField: '时间',
    color: '#FF7F86',
    yField: '运行时长',
    smooth: true,
    forceFit: true,
    lineDash: 'number',
    height: 400,
    xAxis: {
      tickCount: 8,
      range: [0, 1],
    },
  };
  React.useEffect(() => {
    // const timer =  setTimeout(_=>{
    //   getdayUser({ field: 'runTime', days: days });
    // },300)
    // return ()=>clearTimeout(timer)
    getdayUser({ field: 'runTime', days: days });
  }, [days]);

  // 获取开发者统计
  const getsummaryList = (params: ListParams) => {
    homeApi.summaryList(params).then((res) => {
      if (res.code === 200) {
        setdataSource(res.data);
        setCurrent(res.page.page);
        setTotal(res.page.total);
      }
    });
  };

  useEffect(() => {
    getsummaryList({ page: current, size: size, sortBy: sortBy, sortOrder: sortOrder });
  }, [sortBy, sortOrder]);

  // 表格项
  const columns = [
    {
      title: '账号',
      dataIndex: 'userName',
    },
    {
      title: '姓名',
      dataIndex: 'employName',
    },
    {
      title: '开发者应用数',
      sorter: true,
      dataIndex: 'robotCount',
    },
    {
      title: '机器人运行时间(小时)',
      sorter: true,
      dataIndex: 'robotRunTime',
    },
  ];
  const pagination = {
    current,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
    onChange: (page: number) => {
      console.log(1)
      getsummaryList({ page, size: size, sortBy: sortBy, sortOrder: sortOrder });
    },
  };

  return (
    <div className={styles.home}>
      <Row gutter={24}>
        <Col className="gutter-row" span={6}>
          <div className="index_app application">
            <h2>开发应用数</h2>
            <Tooltip placement="top" title="企业开发累计应用总数">
              <img src={require('@/assets/img/icon1.png')} height={16} />
            </Tooltip>
            <CountUp start={0} end={lastTop.robotCnt || 0} />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="index_app execution">
            <h2>累计执行时长(小时)</h2>
            <Tooltip placement="top" title="企业所有应用有效执行的总时长">
              <img src={require('@/assets/img/icon2.png')} height={16} />
            </Tooltip>
            <CountUp start={0} end={lastTop.totalRunHours || 0} />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="index_app Number">
            <h2>执行任务数</h2>
            <Tooltip placement="top" title="运行应用的有效总次数">
              <img src={require('@/assets/img/icon3.png')} height={16} />
            </Tooltip>
            <CountUp start={0} end={lastTop.totalRunCount || 0} />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="index_app manpower">
            <h2>相当于节省人力(天)</h2>
            <Tooltip placement="topRight" title="累计执行时长(小时) / 8（小时）* 5倍人的效率">
              <img src={require('@/assets/img/icon4.png')} height={16} />
            </Tooltip>
            <CountUp start={0} end={lastTop.totalRunWorkDays || 0} />
          </div>
        </Col>
      </Row>
      <Row gutter={0}>
        <div className="account">
          <div className="account_title" style={{ borderBottom: '1px solid #e8e8e8' }}>
            <h1>应用运行时长(小时)</h1>
            <Radio.Group className="account_radis" onChange={onChange} defaultValue="week">
              <Radio.Button value="week">最近一周</Radio.Button>
              <Radio.Button value="month">最近一月</Radio.Button>
              <Radio.Button value="year">最近一年</Radio.Button>
            </Radio.Group>
          </div>
          <div className="application_sear" style={{ padding: '24px' }}>
            <h1>运行时长</h1>
            <Area {...config} />
          </div>
        </div>
      </Row>
      <Row gutter={[0, 48]} style={{ marginTop: '24px' }}>
        <div className="account">
          <div className="account_title">
            <h1>开发者统计</h1>
          </div>
          <div className="application_sear">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={pagination}
              rowKey="userUuid"
              onChange={(pagination: any, filters, sorter: any) => {
                if (sorter.field === 'robotCount') {
                  setsortBy('currentDevelopCount');
                } else {
                  setsortBy('accumulateRunTime');
                }
                if (sorter.order === 'ascend') {
                  setsortOrder('desc');
                } else if (sorter.order === 'descend') {
                  setsortOrder('asc');
                } else {
                  setsortOrder('');
                  setsortBy('');
                }
                setCurrent(pagination.current);
              }}
            />
          </div>
        </div>
      </Row>
    </div>
  );
}
