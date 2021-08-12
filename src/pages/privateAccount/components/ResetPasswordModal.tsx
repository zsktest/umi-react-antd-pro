import React, { useMemo, useState, useEffect } from 'react';
import { Form, Input, Modal, Radio, Alert, message } from 'antd';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { accountApi } from '@/api';
import { ModalPasswordType } from '../data.d';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalPasswordType>)=>{

  const [passwordType, setPasswordType] = useState<string>('system');

  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const [form] = Form.useForm();

  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const handleOk = async ()=>{
    const formData= await form.validateFields();
    formData.userUuid = modalDataProps?.userUuid;
    const result =await accountApi.resetUserPassword({enterpriseUuid, ...formData});
    if(result.success) {
      message.success(result.data.remindMessage);
      onCancel(true);
    }
  }

  useEffect(()=>{
    if(isModalVisible){
      form.setFieldsValue(modalDataProps);
    }
  }, [isModalVisible])
  
  const handleCancel =()=>{
    onCancel(false);
  }

  const onChangeType = (e:any)=>{
      setPasswordType(e.target.value);
  }

  return (
    <Modal title={'重置密码'} visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
      <Alert message="请选择重置密码方式" banner style={{margin: -24,marginBottom: 10}}/>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="初始密码"
          name="passwordType"
        >
          <Radio.Group onChange={(e)=>onChangeType(e)} defaultValue="system">
            <Radio value="system">系统生成</Radio>
            <Radio value="custom">自定义密码</Radio>
          </Radio.Group>
        </Form.Item>
        {passwordType == "custom" ? <Form.Item
          label="&nbsp;"
          colon={false}
          name="customPassword"
        >
          <Input.Password placeholder="请输入密码"/>
        </Form.Item>:null}
      </Form>
    </Modal>
  )
}