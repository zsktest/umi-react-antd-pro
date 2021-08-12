import React, { useState, useEffect, useRef } from 'react';
import { useModel, useLocation } from 'umi';
import { Radio, Skeleton, Row, Col, Tooltip, Empty } from 'antd';
import ProCard from "@ant-design/pro-card";
import CountUp from 'react-countup';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/charts';

import { applicationApi } from '@/api';

import styles from './RobotInfo.less';

export default () => {
    const [loading, setLoading] = useState(false);
    const [robotSummaryDatalist, setRobotSummaryDatalist] = useState([])
    const [chartTitle, setChartTitle] = useState('')
    const [indexbotDayre, setIndexbotDayre] = useState(true)
    const [configArea, setConfigArea] = useState({data: []})
    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');
    const timeStatus = useRef('week')
    const frequency = useRef('runTime')
    const location: any = useLocation();
    let config: any = {
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
        meta: {}
    };
    //获取周，月，年对应天数
    const getDays = (val: string) => {
        let days = ''
        switch (val) {
            case 'year':
                days = '365'
                break
            case 'month':
                days = '30'
                break
            case 'week':
                days = '7'
                break
        }
        return days
    }
    // 积累数据
    const getrobotSummaryData = () => {
        setLoading(true)
        const data = {
            enterpriseUuid: enterpriseUuid.current,
            robotUuid: location.query.robotUuid,
            days: getDays(timeStatus.current)
        }
        applicationApi.robotSummaryData(data).then(res => {
            if (res.code === 200) {
                setRobotSummaryDatalist(res.data)
                setLoading(false)
            }
        })
    }

    // 面积图接口
    const getrobotDay = () => {
        const data = {
            days: getDays(timeStatus.current),
            robotUuid: location.query.robotUuid,
            enterpriseUuid: enterpriseUuid.current,
            field: frequency.current
        }
        applicationApi.robotDay(data).then(res => {
            if (res.code === 200) {
                setChartTitle(res.data.chartTitle)
                if (res.data.dataRows.length === 0) {
                    setIndexbotDayre(false)
                } else {
                    setIndexbotDayre(true)
                    if (frequency.current === 'cnt') {
                        let config_r = {
                            ...config,
                            data: res.data.dataRows,
                            meta: {
                                时间: {
                                    range: [0, 1]
                                },
                                运行次数: {
                                    alias: '次数',
                                    formatter: (v: any) => { return `${v}` }
                                }
                            },
                            xField: '时间',
                            yField: '运行次数'
                        }
                        setConfigArea(config_r)
                    } else {
                        let config_r = {
                            ...config,
                            data: res.data.dataRows,
                            meta: {
                                时间: {
                                    range: [0, 1]
                                },
                                运行时长: {
                                    alias: '时长(小时)',
                                    formatter: (v: any) => { return `${v}` }
                                }
                            },
                            xField: '时间',
                            yField: '运行时长'
                        }
                        setConfigArea(config_r)
                    }
                }
            }
        })
    }
    useEffect(() => {
        if (initialState.currentUser) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
            getrobotSummaryData()
            getrobotDay()
        }
    }, [initialState])
    const onChange = (e: any) => {
        timeStatus.current = e.target.value
        getrobotSummaryData()
        getrobotDay()
    }
    const onChangel = (e: any) => {
        frequency.current = e.target.value
        getrobotDay()
    }
    const extraAction = () => {
        return (
            <Radio.Group onChange={onChange} defaultValue="week">
                <Radio.Button value="week">最近一周</Radio.Button>
                <Radio.Button value="month">最近一月</Radio.Button>
                <Radio.Button value="year">最近一年</Radio.Button>
            </Radio.Group>
        )
    }

    return (
        <ProCard className={styles.AccumulatedData} style={{ marginTop: 24 }} gutter={8} extra={extraAction()} title="积累数据">
            <Skeleton loading={loading} >
                <Row gutter={24}>
                    {robotSummaryDatalist.length && robotSummaryDatalist.map((item: any, index: number) => (
                        <Col
                            span={6}
                            style={{ marginBottom: '24px', paddingLeft: '0', paddingRight: '24px' }}
                            key={index}
                        >
                            <div className="index_app application">
                                <h2>
                                    {item.name}
                                    <Tooltip placement="top" title={item.remark}>
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </h2>
                                {item.type === 'string' ? <span>{item.value}</span> : <CountUp start={0} end={item.value || 0} />}
                            </div>
                        </Col>
                    ))}
                </Row>
            </Skeleton>
            <div className="application">
                <div className="application_left">
                    <div className="application_title">
                        <h1>{chartTitle}</h1>
                        <Radio.Group onChange={onChangel} defaultValue="runTime">
                            <Radio.Button value="runTime">时长</Radio.Button>
                            <Radio.Button value="cnt">次数</Radio.Button>
                        </Radio.Group>
                    </div>
                    {
                        indexbotDayre ?
                            <div id="container">
                                <Area {...configArea} />
                            </div> :
                            <div>
                                <div className="bt"></div>
                                <Empty />
                            </div>
                    }
                </div>
            </div>
        </ProCard>
    );
}

