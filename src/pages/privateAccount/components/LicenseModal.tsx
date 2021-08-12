import React, { useMemo, useState, useEffect } from 'react';
import { Form, Modal, Select, message } from 'antd';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { accountApi } from '@/api';
import { ModalLicenseType, ModalEnterpriseLicenseType } from '../data.d';

const { Option } = Select;

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalLicenseType>)=>{
  const [enterpriseLicense, setEnterpriseLicense] = useState<ModalEnterpriseLicenseType[]>([])

  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const [form] = Form.useForm();

  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const handleOk = async ()=>{
    const formData= await form.validateFields();
    formData.userUuid = modalDataProps?.userUuid;
    const result =await accountApi.resetUserPassword({enterpriseUuid, ...formData});
    if(result.success) {
      message.success(`账号修改成功`);
      onCancel(true);
    }
  }

  useEffect(()=>{
    if(isModalVisible) {
      accountApi.queryAvailableEnterpriseLicense({
        enterpriseUuid
      }).then(res=>{
        if(res.success) {
          debugger
          setEnterpriseLicense(res.data);
          if(res.data.length>0) {
            form.setFieldsValue({ "userLicenseUuid": res.data[0].uuid})
          }
        }
      })
      form.setFieldsValue(modalDataProps);
    }
  }, [isModalVisible])
  
  const handleCancel =()=>{
    onCancel(false)
  }

  return (
    <Modal title={'选择到期时间'} visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
      <p>请选择到期时间</p>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="到期时间"
          name="userLicenseUuid"
        >
          <Select>
            {enterpriseLicense.map(item=>{
              return <Option value={item.uuid}>{item.endTime.slice(0,10)}</Option> 
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}