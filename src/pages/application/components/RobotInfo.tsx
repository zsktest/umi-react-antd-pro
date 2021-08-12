import React, { useState, useMemo } from 'react';
import { Helmet } from 'umi';
import { Breadcrumb, Descriptions } from 'antd';

import styles from './RobotInfo.less';

export default ({robotDetial}: any) => {
    const detail = useMemo(() => robotDetial, [robotDetial])
    const [a, setA] = useState(0);
    const getIcon = () => {
        if(detail && detail.icon){
            return <img src={detail.icon} />
        }else if(detail && detail.name){
            // 右侧头像
            const rgbjson = ['#eb5757', '#f2994a', '#f2c94c', '#27ae60', '#219653', '#2f80ed', '#2d9cdb', '#56ccf2', '#bb6bd9']
            const rgb = detail.name.charCodeAt() % 9
            let rebhover =rgbjson[rgb]
            return <div className='client_top_img' style={{background: rebhover}}>{ detail.name.substring(0,1) }</div>
        }else{
            return ''
        }
    }
    return (
        <div className={styles.robotInfo}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/home">首页</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/application">应用管理</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>应用管理详情</Breadcrumb.Item>
            </Breadcrumb>
            <div className="application_detail">
                <div className="application_detailimg">
                    {getIcon()}
                </div>
                <div className="application_detailright">
                    <h2>{ detail.name }</h2>
                    <span>{ detail.description }</span>
                </div>
                <div className="bt"></div>
            </div>
            <div className="descriptions">
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="所有者">{ detail.ownerName }</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{ detail.createTime }</Descriptions.Item>
                    <Descriptions.Item label="版本号">{ detail.developVersion }</Descriptions.Item>
                    <Descriptions.Item label="自动化类型">{ detail.uiaType }</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{ detail.modifyTime }</Descriptions.Item>
                    <Descriptions.Item label="应用授权">{ detail.authorityName }</Descriptions.Item>
                </Descriptions>
            </div>
        </div>
    );
}
