import { useMemo, useState, useEffect } from 'react';
import { Form, Input, Modal, message, Badge } from 'antd';

import { ModalProps } from '@/models';
import { clientEnterpriseApi } from '@/api';
import { ModalPasswordType } from '../data.d';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalPasswordType>)=>{

  const [berClientConfig, setBerClientConfig] = useState(0);

  const [form] = Form.useForm();

  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const handleOk = async ()=>{
    const formData= await form.validateFields();
    const result =await clientEnterpriseApi.applySeniorAccount({...formData});
    if(result.success) {
      message.success('申请成功请找管理员审核！');
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

  useEffect(()=>{
    clientEnterpriseApi.clientConfig().then(res=>{
      if(res.success) {
        setBerClientConfig(res.data.seniorRobotBlockCount||0)
      }
    })
  }, [])

  return (
    <Modal title={'申请高级账号'} visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="账号类型"
          initialValue="高级账号"
        >
          <Input value="高级账号" placeholder="请输入企业名称" disabled/>
        </Form.Item>
        <Form.Item
          label="申请备注"
          name="applyRemark"
          rules={[{ required: true, message: '描述不能为空' }]}
        >
          <Input.TextArea placeholder="请输入备注" autoSize={{minRows: 3, maxRows: 3}}/>
        </Form.Item>
        <div className="seniorRobotBlockCount"><Badge color="#108ee9" />高级账号权益：<span>运行或开发超过{berClientConfig}条指令的应用</span></div>
        <div className="seniorRobotBlockCount"><Badge status="default" />基础账号权益：<span>运行或开发小于{berClientConfig}条指令的应用</span></div>
      </Form>
    </Modal>
  )
}