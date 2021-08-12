import { useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, Modal, 
  Radio, Tooltip, message, 
  Tabs, Alert, Button, Upload, 
  Progress, Result, Table, Typography, Divider } from 'antd';
import { QuestionCircleOutlined, ReloadOutlined, 
  MinusCircleOutlined, PlusOutlined, 
  CloudUploadOutlined, CloseCircleFilled
} from '@ant-design/icons';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { accountApi, clientEnterpriseApi } from '@/api';
import { ModalAccountType, ModalEnterpriseLicenseType } from '../data.d';
import { request as requestUp } from 'umi';

import styles from '../index.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { Paragraph } = Typography;

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalAccountType>)=>{

  const [accountType, setAccountType] = useState<string|undefined>('senior');
  const [passwordType, setPasswordType] = useState<string>('system');
  const [enterpriseLicense, setEnterpriseLicense] = useState<ModalEnterpriseLicenseType[]>([]);

  const [currentTab, setCurrentTab] = useState();

  // 批量导入
  const [colleague, setColleague]=useState(false);
  const [fileList, setFileList] = useState([]);
  const [loadings, setLoadings] = useState(false);
  const [processing, setProcessing] = useState(false);
  //const [createStatusUuid, setCreateStatusUuid]=useState();
  const [createData, setCreateData] = useState();
  const [tableing, setTableing] = useState(false);
  const [successing, setSuccessing] = useState(false);
  const [successtitle, setSuccessTitle]=useState();
  const [ failtable, setFailTable]=useState([]);
  //

  //链接邀请
  const [inviteGetInviteLink, setInviteGetInviteLink]=useState()

  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const abbr = initialState?.currentUser?.enterprise?.abbr;
  const [form] = Form.useForm();
  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  
  const handleCancel =()=>{
    onCancel(false)
  }

  useEffect(()=>{
    if(isModalVisible ) {
      if((modalDataProps.enterpriseRoleCode == 'e_owner' || modalDataProps.enterpriseRoleCode == 'e_admin')) {
        accountApi.queryAvailableEnterpriseLicense({
          enterpriseUuid
        }).then(res=>{
          if(res.success) {
            setEnterpriseLicense(res.data);
            form.setFieldsValue({userLicenseUuid: res.data[0].uuid||''});
          }
        })
      }
      setAccountType('senior');
      form.setFieldsValue({ 
        accountType: 'senior',
        passwordType: 'system',
        role: 'e_user'
      });
      if((modalDataProps.enterpriseRoleCode == 'e_owner' || modalDataProps.enterpriseRoleCode == 'e_admin')) {
        setCurrentTab('create');
      } else {
        setCurrentTab('linkInvitation');
      }
    }
  }, [isModalVisible])

  const onChangeType = (type:string, e:any)=>{
    if(type== 'account') {
      setAccountType(e.target.value);
    } else {
      setPasswordType(e.target.value);
    }
  }

  const changeTab = (key)=>{
    setCurrentTab(key);
  }

  const onFinish=(values)=>{
    const { emails } = values;
    const emailList = emails.map(item=>item.email);
    clientEnterpriseApi.inviteInviteByMail(emailList).then(res=>{
      if(res.success) {
        message.success("邮箱邀请成功！");
      }
    })
  }

  const beforeUpload = (file)=>{
    setFileList([...fileList, file]);
    setColleague(true)
    return false
  }

  const resetChoice = ()=>{
    setColleague(false);
    setTableing(false);
    setProcessing(false);
    setFileList([])
  }

  const importFile=()=>{
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('file', file)
    })
    setLoadings(true);// process.env.apiUrl
    requestUp(`/api/v1/enterpriseUser/createEnterpriseUserByExcel`, {
      method: 'post',
      data: formData,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem("ACCESS_TOKEN")
      },
    }).then(res=>{
      if(res.success) {
        setLoadings(false);
        setProcessing(true);
        getCreateUserStatus(res.data.createBatchUuid);
      } else {

      }
    })
  }

  // 获取process
  const getCreateUserStatus = async (createBatchUuid:string)=>{
    const result = await clientEnterpriseApi.queryCreateUserStatus({createBatchUuid});
    if(result.code===200) {
      setCreateData(result.data);
      if(result.data.checkStatus) {
        if(result.data.checkStatus=="finish") {
          setSuccessing(true);
          setSuccessTitle(`导入成功，已新增${res.data.successCount}个账号`)
        } else {
          getCreateUserStatus(createBatchUuid);
        }
      } else {
        if (result.data.errorDataList.length <= 0) {
          message.error(result.data.message)
        } else {
          setFailTable(result.data.errorDataList);
        }
        setTableing(true);
      }
    } else {
      message.error(result.msg);
    }
  }

  const uploadClics = ()=>{
   // this.$emit('importclcks', this.importfios)
      setColleague(true);
      setTableing(false);
      setProcessing(false);
      setSuccessing(false);
      setFileList([]);
  }

  const columns = [
    {
      title: 'Excel行号',
      dataIndex: 'rowIndex',
      width: 100,
      key: '1'
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: '2'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: '3'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: '4'
    },
    {
      title: '密码',
      dataIndex: 'customPassword',
      key: '5'
    },
    {
      title: '错误信息',
      fixed: 'right',
      width: 200,
      dataIndex: 'errorMessage',
      key: '6'
    }
  ]

  const getinviteResetInviteLink = ()=>{
    clientEnterpriseApi.inviteResetInviteLink().then(res=>{
      if(res.success){
        setInviteGetInviteLink(res.data.inviteLink);
      }
    })
  }

  useEffect(()=>{
    if(isModalVisible) {
      clientEnterpriseApi.inviteGetInviteLink().then(res=>{
        if(res.success) {
          setInviteGetInviteLink(res.data.inviteLink);
        }
      })
    }
  }, [isModalVisible])

  const onCreateUser = (values)=>{
    //console.log(values);
    accountApi.createUser({enterpriseUuid},values).then(res=>{
      if(res.success) {
        setLoadings(false);
        onCancel(true);
        message.success('账号' + res.data.account + '创建成功')
        setColleague(false);
        // this.accountbindId = true
        // this.approveBindId = false
      }
    })
  }


  return (
    <Modal footer={null} title={'添加团队成员'} visible={isVisible} onCancel={handleCancel} className="nopadding-modal">
      <Tabs activeKey={currentTab} onChange={changeTab} tabBarGutter={12}>
        {modalDataProps.enterpriseRoleCode=="e_owner"||modalDataProps.enterpriseRoleCode=="e_admin" ? <TabPane tab={<span style={{padding: '0 16px'}}>直接创建</span>} key="create">
        <div>
          <Alert type="info" showIcon message="仅管理员才能直接创建账号" style={{margin: '0 16px 20px 16px'}}/>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={onCreateUser}
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
                {(modalDataProps?.scurity?.enableExtraAccount) ? <Radio value="extra">临时账号
                  <Tooltip placement="top" title="有时效性，具有所有功能权限">
                    <QuestionCircleOutlined className={styles.tip}/>
                  </Tooltip>
                </Radio>:null}
              </Radio.Group>
            </Form.Item>
            <div>
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
                <Input placeholder="建议字母+数字" maxLength={50} suffix={<div>{`@${abbr}`}</div>}/>
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
              {accountType == "extra" ? <Form.Item
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
              <Form.Item
                label="初始密码"
                name="passwordType"
                initialValue="system"
              >
                <Radio.Group onChange={(e)=>onChangeType('password', e)}>
                  <Radio value="system">系统生成</Radio>
                  <Radio value="custom">自定义密码</Radio>
                </Radio.Group>
              </Form.Item>
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
              <Divider style={{margin: '8px 0'}}/>
              <Form.Item wrapperCol={{span: 17, offset: 6}} style={{marginBottom: 8}}>
                <Button type="primary" htmlType="submit" style={{float:'right'}}>
                  确定
                </Button>
                <Button style={{float:'right',marginRight: 8}} onClick={()=>onCancel(false)}>
                  取消
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        </TabPane>:null}
        <TabPane tab={<span style={{padding: '0 16px'}}>链接邀请</span>} key="linkInvitation">
          <div>
            <Alert type="info" showIcon message="链接邀请方式只能创建基础账号，添加成功后可由管理员更改权限" style={{margin: '0 16px'}}/>
            <div style={{display: 'flex',padding: '24px 36px',position: 'relative'}}>
              <Input disabled={true} value={inviteGetInviteLink}/>
              <Paragraph
                className={styles.copyLink}
                copyable={{
                  text: inviteGetInviteLink,
                  icon: [<Button type="primary">复制链接</Button>, <Button type="primary">复制链接</Button>],
                }}
              >
              </Paragraph>
              <ReloadOutlined onClick={()=>getinviteResetInviteLink()} style={{position: 'absolute', right: '132px', top: '33px', cursor: 'pointer'}}/>
            </div>
          </div>
        </TabPane>
        <TabPane tab={<span style={{padding: '0 16px'}}>邮箱邀请</span>} key="emailInvitation"></TabPane>
        {modalDataProps.enterpriseRoleCode=="e_owner"||modalDataProps.enterpriseRoleCode=="e_admin"?<TabPane tab={<span style={{padding: '0 16px'}}>批量导入</span>} key="batchImport"></TabPane>:null}
      </Tabs>
      {/* {currentTab=='linkInvitation' ? <div>
        <Alert type="info" showIcon message="链接邀请方式只能创建基础账号，添加成功后可由管理员更改权限" style={{margin: '0 16px'}}/>
        <div style={{display: 'flex',padding: '24px 36px',position: 'relative'}}>
          <Input disabled={true} value={inviteGetInviteLink}/>
          <Paragraph
            className={styles.copyLink}
            copyable={{
              text: inviteGetInviteLink,
              icon: [<Button type="primary">复制链接</Button>, <Button type="primary">复制链接</Button>],
            }}
          >
          </Paragraph>
          <ReloadOutlined onClick={()=>getinviteResetInviteLink()} style={{position: 'absolute', right: '132px', top: '33px', cursor: 'pointer'}}/>
        </div>
      </div>:null} */}
      {currentTab=='emailInvitation' ? <div>
        <Alert type="info" showIcon message="邮箱邀请方式只能创建基础账号，添加成功后可由管理员更改权限" style={{margin: '0 16px'}}/>
        <div style={{padding: '24px 16px'}}>
          <Form
            name="basic"
            //form={form}
            labelCol={{ span: 1 }}
            wrapperCol={{ span: 23 }}
            onFinish={onFinish}
          >
            <Form.List name="emails" initialValue={[{key: '', name:'', fieldKey: ''}]}>
              {(fields, {add,remove})=>(
                <>
                  {fields.map(({key, name, fieldKey, ...restField },index)=>(
                    <div style={{display: 'flex'}} key={index}>
                      <Form.Item
                        {...restField}
                        name={[name, 'email']}
                        fieldKey={[fieldKey, 'email']}
                        rules={[{ required: true, message: '请输入邮箱' }]}
                        style={{width: '100%'}} 
                      >
                        <Input placeholder="输入同事的邮箱"/>
                      </Form.Item>
                      {fields.length>1 ? <MinusCircleOutlined style={{marginTop: 8}} onClick={() => remove(name)} />:null}
                    </div>
                  ))}
                  <Form.Item>
                    <a href="#!" onClick={() => {if(fields.length<8){add()} else {message.error("邮箱最多可添加8个！")}}}>
                      <PlusOutlined />继续添加
                    </a>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{float:'right'}}>
                发送邀请
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>:null}
      {currentTab=="batchImport" ? <div style={{margin: '0 16px 16px 16px'}}>
        {!colleague ? <Upload.Dragger 
          name="file"
          className={styles.uploadBlock}
          accept=".xlsx, .xls"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined style={{color: '#ccc'}}/>
          </p>
          <p className="ant-upload-text">将文件拖拽到这里或者点击此区域开始导入</p>
          <p className="ant-upload-hint">仅支持 .xlsx .xls文件</p>
        </Upload.Dragger>:<div className={styles.uploadChoice}>
          <img src={require("@/assets/img/excel_icon@2x.png")} alt="" />
          {fileList.length > 0 ? <p>{fileList[0].name} （{ fileList[0].size/1024 }kb）</p>:null}
          <Button onClick={resetChoice}>重新选择</Button>
        </div>}
        <a href="https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/assets/files/企业用户导入模版.xlsx" className={styles.uploadUrl}>点击下载员工信息模板.xlsx</a>
        <div className={styles.selfFooter}>
          <Button onClick={()=>onCancel(false)}>取消</Button>
          <Button style={{marginLeft: 8}} type="primary" disabled={!colleague} onClick={importFile}>导入</Button>
        </div>

        {processing ? <div className={styles.uploadProcess}>
          <div className="process">
            <img src={require("@/assets/img/excel_icon@2x.png")} alt="" />
            <div>
              {fileList.length>0?<p>{fileList[0].name}</p>:null}
              <Progress percent={createData?.createRate} status="active" />
            </div>
          </div>
        </div>:null}

        {tableing ? <div className={styles.uploadFail}>
          <div className="fail-title">
            <p><CloseCircleFilled style={{color: '#FF525B',fontSize: 16}}/>&nbsp;导入失败</p>
            <Button type="primary" onClick={resetChoice}>重新导入</Button>
          </div>
          <div className="fail-table">
            {/* <a-table :columns="columns" :data-source="failtable" :row-key="record => record.rowIndex" :pagination="false" :scroll="{ x: 1000, y: 360 }">
            </a-table> */}
            <Table columns={columns} pagination={false} dataSource={failtable} scroll={{ x: 1000, y: 360 }}/>
          </div>
        </div>:null}

        {successing ? <div className={styles.uploadFail}>
          <Result
            status="success"
            title={successtitle}
            extra={<Button key="buy" onClick={uploadClics}>完成</Button>}
            >
          </Result>
        </div>:null}

        <div style={{height: 28}}></div>
      </div>:null}
    </Modal>
  )
}