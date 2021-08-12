import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { request } from 'umi';

import { robotrightdataType, ModalProps } from '../data';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<robotrightdataType>)=>{
  return (
    <>
      {
        modalDataProps?.actions.map((item:any, index:number) => {
          return <a style={{marginRight: 10}} key={index} onClick={() => {
            Modal.confirm({
              title: '提示',
              // content: `确认要${ item.name }${ (modalDataProps?.sceneName ? modalDataProps?.sceneName : '') }`,
              content: (item.remark ? item.remark : `确认要${ item.name }${ (modalDataProps?.sceneName ? modalDataProps?.sceneName : '') }`),
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
                }).then(res => {
                  if (res.code === 200) {
                    message.success(item.name + '成功')
                    if (item.refresh) {
                      onCancel(true, {})
                    }
                  }
                })
              },
            });
          }}>{ item.name }</a>
        })
      }
    </>
  );
}