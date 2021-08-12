import { useMemo, useState, useEffect } from 'react';
import { Form, Input, Modal, Button, message, Divider, Upload, Row, Col } from 'antd';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { clientEnterpriseApi } from '@/api';
import { EnterpriseInfoType } from '../data.d';

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<EnterpriseInfoType>)=>{

  const [currentImg, setCurrentImg] = useState<string>();

  const [form] = Form.useForm();

  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const handleOk = async ()=>{
    const formData= await form.validateFields();
    const result =await clientEnterpriseApi.enterpriseUpdate(formData);
    if(result.success) {
      message.success('企业信息修改成功');
      onCancel(true);
    }
  }

  useEffect(()=>{
    if(isModalVisible){
      setCurrentImg(modalDataProps?.enterpriseIcon);
      form.setFieldsValue(modalDataProps);
    }
  }, [isModalVisible])
  
  const handleCancel =()=>{
    onCancel(false);
  }

  const uploadFile = ({ file }:any)=>{
    if (file.response) {
      if (file.response.code === 200) {
        setCurrentImg(file.response.data.url);
        form.setFieldsValue({
          enterpriseIcon: file.response.data.url
        })
      }
    }
  }

  return (
    <Modal title="编辑企业信息" visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 17 }}
      >
        <Form.Item
          label="企业名称"
          name="name"
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="简介"
          name="enterpriseDescription"
          rules={[{ required: true, message: '请输入企业简介' }]}
        >
          <Input.TextArea placeholder="有任何问题都可以联系负责人"/>
        </Form.Item>
        <Row>
          <Col span={6} style={{textAlign: 'right'}}>
            <label style={{height: 39,lineHeight: '39px',display:'inline-block'}}>企业：</label>
          </Col>
          <Col span={17}>
            <img src={currentImg} style={{width: 56,height: 56, borderRadius: 28,marginRight: 16}}/>
            <Upload
              name="file"
              headers={{
                authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
              }}
              accept=".png, .jpg, .jpeg"
              showUploadList={false}
              onChange={uploadFile}
              action={`${process.env.apiUrl}/api/v1/sys/media/upload/image`}
            >
              <Button>上传图片</Button>
            </Upload>
          </Col>
        </Row>
        <Form.Item
          label=""
          hidden={true}
          name="enterpriseIcon"
        >
          <Input type="hidden" />
        </Form.Item>
        <Divider />
        <Form.Item
          label="负责人姓名"
          name="principalUserName"
          rules={[{ required: true, message: '请输入负责人姓名' }]}
        >
          <Input placeholder="请输入负责人姓名"/>
        </Form.Item>
        <Form.Item
          label="负责人手机号"
          name="principalUserPhone"
          rules={[{ required: true, message: '请输入负责人手机号' }]}
        >
          <Input placeholder="请输入负责人手机号"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}