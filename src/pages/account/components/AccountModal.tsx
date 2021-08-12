import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, Modal, Radio, Tooltip, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { accountApi } from '@/api';
import { ModalAccountType, ModalEnterpriseLicenseType } from '../data.d';

import styles from '../index.less';

const { Option } = Select;

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalAccountType>)=>{

  const [accountType, setAccountType] = useState<string|undefined>('senior');
  const [passwordType, setPasswordType] = useState<string>('system');
  const [enterpriseLicense, setEnterpriseLicense] = useState<ModalEnterpriseLicenseType[]>([]);

  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const abbr = initialState?.currentUser?.enterprise?.abbr;
  const [form] = Form.useForm();

  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  const handleOk = async ()=>{
    const formData= await form.validateFields();
    if(modalDataProps?.enterpriseUserUuid) {
      formData.enterpriseUserUuid = modalDataProps?.enterpriseUserUuid;
      const result =await accountApi.updateUser({enterpriseUuid},formData);
      if(result.success) {
        message.success(`账号${result.data.account}修改成功`);
        onCancel(true);
      }
    } else {
      const result =await accountApi.createUser({enterpriseUuid},formData);
      if(result.success) {
        onCancel(true);
      }
    }
  }
  
  const handleCancel =()=>{
    onCancel(false)
  }

  useEffect(()=>{
    if(isModalVisible) {
      accountApi.queryAvailableEnterpriseLicense({
        enterpriseUuid
      }).then(res=>{
        if(res.success) {
          setEnterpriseLicense(res.data);
          form.setFieldsValue({userLicenseUuid: ((res.data.length>0) && res.data[0].uuid)||''});
        }
      })
      setAccountType(modalDataProps?.accountType);
      form.setFieldsValue(modalDataProps);
    }
  }, [isModalVisible])

  const onChangeType = (type:string, e:any)=>{
    if(type== 'account') {
      setAccountType(e.target.value);
    } else {
      setPasswordType(e.target.value);
    }
  }

  return (
    <Modal title={modalDataProps?.enterpriseUserUuid ? '编辑账号':'添加账号'} visible={isVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="账户类型"
          name="accountType"
          rules={[{ required: true, message: '请选择账号类型' }]}
          initialValue="senior"
        >
          <Radio.Group onChange={(e)=>onChangeType('account', e)}>
            <Radio value="senior">高级账号
              <Tooltip placement="top" title="具有所有功能权限">
                <QuestionCircleOutlined className={styles.tip}/>
              </Tooltip>
            </Radio>
            <Radio value="basic">基础账号
              <Tooltip placement="top" title="只有部分功能权限，编辑和运行应用有指令行数限制">
                <QuestionCircleOutlined className={styles.tip}/>
              </Tooltip>
            </Radio>
            {(modalDataProps?.enableExtraAccount && modalDataProps?.userLicense?.source == "extra") ? <Radio value="extra">临时账号
              <Tooltip placement="top" title="有时效性，具有所有功能权限">
                <QuestionCircleOutlined className={styles.tip}/>
              </Tooltip>
            </Radio>:null}
          </Radio.Group>
        </Form.Item>
        {(enterpriseLicense.length > 0 && accountType=="extra") || (accountType=="basic") || (accountType=="senior") ? <div>
          <Form.Item
            label="员工姓名"
            name="name"
            rules={[{ required: true, message: '请输入员工姓名' }]}
          >
            <Input placeholder="员工姓名或昵称" maxLength={50}/>
          </Form.Item>
          <Form.Item
            label="登录账号"
            name="account"
            rules={[
              { required: true, message: '请输入账号' },
              {pattern: /^[^\s]*$/, message: '账号中不应该有空格'}
          ]}
          >
            <Input disabled={!!modalDataProps?.enterpriseUserUuid} placeholder="建议字母+数字" maxLength={50} suffix={<div>{`@${abbr}`}</div>}/>
          </Form.Item>
          <Form.Item
            label="用户角色"
            name="role"
            rules={[{ required: true, message: '请选择' }]}
            initialValue="e_user"
          >
            <Select>
              <Option value="e_runner">仅可运行的用户</Option>
              <Option value="e_user">可编辑和运行的用户</Option>
              {accountType=="senior"?<Option value="e_admin">管理员</Option>:null}
            </Select>
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { message:'请输入正确的手机号码', pattern: /^1[3456789]\d{9}$/ }
            ]}
          >
            <Input placeholder="用于接收和找回密码" maxLength={18}/>
          </Form.Item>
          {accountType == "extra" && (!modalDataProps?.enterpriseUserUuid) ? <Form.Item
            label="到期时间"
            name="userLicenseUuid"
            rules={[{ required: true, message: '请选择到期时间' }]}
          >
            <Select placeholder="到期时间选择">
              {enterpriseLicense.map(item=>{
                return <Option value={item.uuid} key={item.uuid}>{item.endTime.slice(0,10)}</Option>
              })}
            </Select>
          </Form.Item>:null}
          {!modalDataProps?.enterpriseUserUuid ? <Form.Item
            label="初始密码"
            name="passwordType"
            initialValue="system"
          >
            <Radio.Group onChange={(e)=>onChangeType('password', e)}>
              <Radio value="system">系统生成</Radio>
              <Radio value="custom">自定义密码</Radio>
            </Radio.Group>
          </Form.Item>:null}
          {passwordType == "custom" ? <Form.Item
            colon={false}
            label="&nbsp;"
            name="customPassword"
          >
            <Input placeholder="请输入密码" maxLength={50}/>
          </Form.Item>:null}
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '请输入正确的邮箱'}]}
          >
            <Input placeholder="员工姓名或昵称" maxLength={50}/>
          </Form.Item>
        </div>:null}
        {(accountType === 'extra') && (enterpriseLicense.length == 0) ? <div>
          <div className={styles.radioGroup}>
            <img src={require('@/assets/img/none.png')} alt="" width="205" />
            <p>暂无临时账号许可证，请购买</p>
          </div>
        </div>:null}
      </Form>
    </Modal>
  )
}