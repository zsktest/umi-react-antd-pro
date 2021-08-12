// import { useState, useEffect } from 'react';
import { Switch, Dropdown, Menu, Modal, message } from 'antd'
import { EllipsisOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { ModalProps } from '@/models';
import { robotrightdataType } from '../../data';
import { dispatchApi } from '@/api';

  // 操作开启

export default ({ modalDataProps, onCancel }: ModalProps<robotrightdataType>) => {
  const onhangeEnabledStatus = (e: any) => {
    let title = ''
    const data = {
      scheduleUuid: modalDataProps?.uuid,
      enabled: e
    }
    if (modalDataProps?.enabled === false) {
      title = '确认开启?'
    } else {
      title = '确认关闭?'
    }
    Modal.confirm({
      title: '提示',
      content: title,
      icon: <QuestionCircleOutlined />,
      onOk() {
        dispatchApi.hangeEnabledStatus(data).then(res => {
          if (res.code === 200) {
            onCancel(true)
          }
        })
      },
      onCancel() {
        onCancel(true)
      },
    });
  }
  return (
    <div>
      <Switch size="small" onClick={(e) => onhangeEnabledStatus(e)} checked={modalDataProps?.enabled} />
      <span></span>
      <a href="TypeScript:;" style={{marginLeft: 10, marginRight: 10}}>编辑{modalDataProps?.enabled}</a>
      <Dropdown overlay={
            <Menu onClick={({key})=>{
              if (key === 'edit') {
                dispatchApi.manualStart({scheduleUuid: modalDataProps?.uuid}).then(res => {
                  if (res.code === 200) {
                    message.success('该计划已添加到任务列表')
                  }
                })
              } else if (key === 'delete') {
                Modal.confirm({
                  title: '提示',
                  content: `确认要删除计划'${modalDataProps?.name}'`,
                  icon: <QuestionCircleOutlined />,
                  onOk() {
                    dispatchApi.scheduleDelete({scheduleUuid: modalDataProps?.uuid}).then(res => {
                      if (res.code === 200) {
                        onCancel(true)
                      }
                    })
                  },
                  onCancel() {
                    onCancel(true)
                  },
                });
              }
            }}>
              <Menu.Item key="edit">立即执行</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          }>
            <EllipsisOutlined style={{color: '#2488e5', fontSize: 16}} />
          </Dropdown>
    </div>
  );
}