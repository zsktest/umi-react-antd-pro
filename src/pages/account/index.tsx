import React, { useEffect, useState } from 'react';
import { Tooltip, Table, Tag, Dropdown, Menu, Modal, Input, Button, Typography, message } from 'antd';
import { CheckCircleOutlined, FileAddOutlined, 
  TeamOutlined, CaretDownOutlined, 
  QuestionCircleOutlined, SearchOutlined, PlusOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useModel, useHistory } from 'umi';

import AccountModal from './components/AccountModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import LicenseModal from './components/LicenseModal';
import ReFeeModal from './components/ReFeeModal';
import { ListParams } from '@/models';
import { DataType, ModalAccountType, ModalPasswordType, ModalLicenseType, ModalRefeeType } from './data.d';
import { accountApi } from '@/api';

import styles from './index.less';

const { Paragraph } = Typography;

export default function listPage() {
  const [account_user, setaccount_user] = useState<any>({});
  const [listData, setlistData] = useState<DataType[]>([]);
  const [current, setCurrent] = useState(1);
  const [sortOrder, setsortOrder] = useState<string>('');
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [delDelete, setdelDelete] = useState(false);
  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const [keywords, setKeywords] = useState();
  const [currentSelectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const history = useHistory();


  const [isAccountModalVisible, setAccountModalVisible]=useState(false);
  const [accountModalData, setAccountModalData]=useState<ModalAccountType>({
    account: "",
    accountType: "senior",
    email: "",
    name: "",
    passwordType: "system",
    phone: "",
    role: "e_user",
    enableExtraAccount: true,
    userLicense: {
      source: 'extra'
    }
  })

  const [isResetPasswordModalVisible, setResetPasswordModalVisible]=useState(false);
  const [resetPasswordModalData, setResetPasswordModalData]=useState<ModalPasswordType>({
    passwordType: "system",
    userUuid: "",
    customPassword: "",
  })

  const [isLicenseModalVisible, setLicenseModalVisible]=useState(false);
  const [licenseModalData, setLicenseModalData] = useState<ModalLicenseType>();

  const [isRefeeModalVisible, setRefeeModalVisible]=useState(false);
  const [refeeModalData, setRefeeModalData] = useState<ModalRefeeType>();

  const remainUserQuota = <span>还可创建 { account_user.remainUserQuota } 个高级账号</span>;
  const remainBasicUserQuota = <span>还可创建 { account_user.remainBasicUserQuota } 个基础账号</span>;
  const remainExtraUserQuota = <span>还可创建 { account_user.remainExtraUserQuota } 个临时账号</span>;

  useEffect(() => {
    getqueryEnterprise();
  }, []);

  // 首页title接口
  const getqueryEnterprise = () => {
    accountApi.queryEnterprise().then((res) => {
      if (res.code === 200) {
        setaccount_user(res.data)
      }
    });
  };

  useEffect(() => {
    getaccountUser({ page: current, size: size, enterpriseUuid})
  }, []);
  // 获取开发者统计
  const getaccountUser = (params: ListParams) => {
    setSelectedRowKeys([]);
    accountApi.accountUser(params).then((res) => {
      if (res.code === 200) {
        setlistData(res.data);
        setCurrent(res.page.page);
        setTotal(res.page.total);
      }
    });
  };
  // 表格项
  const columns = [
    {
      title: '登录账号',
      dataIndex: 'loginAccount',
      width: '20%',
      render: (text:string, record:any)=>(
        <div >
          <Paragraph copyable className={styles.loginAccount}>
            {text}
            {record.userLicense.source == "extra" ? <Tag color="processing" className={styles.timerTag}>临时</Tag>:null}
          </Paragraph>
        </div>
      )
    },
    {
      title: '员工姓名',
      width: '15%',
      dataIndex: 'name'
    },
    {
      title: '用户角色',
      dataIndex: 'roleName'
    },
    {
      title: '账号类型',
      dataIndex: 'accountTypeName',
      render: (text: string, record: any) => (
        <div>
          {record.accountType === 'senior' ? <Tag color="blue">{ record.accountTypeName }</Tag>: <Tag>{ record.accountTypeName }</Tag>}
        </div>
      ),
    },
    {
      title: '最近登录',
      dataIndex: 'latestLoginTime'
    },
    {
      title: '到期时间',
      dataIndex: 'createTime',
      render: (text: string, record: any) => (
        <div>
          <span>{record.expiredTime.slice(0,10)}</span>
          {record.userLicense.status === 'expired' ? <div className={styles.tasktopend}>
             <span><ClockCircleOutlined />&nbsp;过期</span>
          </div>:null}
        </div>
      ),
      filters: [
        {
          text: '未过期',
          value: 'unexpired'
        },
        {
          text: '15天到期',
          value: 'recent15DaysExpired'
        },
        {
          text: '已过期',
          value: 'expired'
        }
      ],
      filterMultiple: false
    },
    {
      title: '操作',
      dataIndex: '',
      width: '14%',
      render:(text: string, record: DataType) => (
        <div className={styles.action}>
          <a href="#!" onClick={()=>history.push(`/account/detail?userUuid=${record.userUuid}`)}>查看</a>
          {record.userLicense && record.userLicense.source === 'extra'? <a href="#!" onClick={()=>{
            setRefeeModalVisible(true);
            setRefeeModalData({
              userLicenseUuids: record.userLicense.uuid,
              duration: 1
            })
          }}>续费</a> : ''}
          <Dropdown overlay={
            <Menu onClick={({key})=>{
              if(key=="edit") {
                setAccountModalVisible(true);
                setAccountModalData({
                  account: record.account,
                  accountType: record.userLicense && record.userLicense.source === 'extra' ? record.userLicense.source : record.accountType,
                  email: record.email,
                  name: record.name,
                  phone: record.phone,
                  role: record.role,
                  enterpriseUserUuid: record.uuid,
                  enableExtraAccount: account_user.enableExtraAccount,
                  userLicense: record.userLicense
                })
              } else if(key=="update_license"){
                setLicenseModalVisible(true);
                setLicenseModalData({
                  userUuid: record.userUuid
                })
              }
              else if(key=="get_migration_code") {
                const params = {
                  enterpriseUuid: initialState?.currentUser?.enterpriseUuid,
                  userUuid: record.userUuid
                }
                accountApi.createOrQueryMigrateCode(params).then(res=>{
                  if(res.success) {
                    Modal.success({
                      title: '用户迁移码',
                      width: 500,
                      content: (
                        <div>
                          <p style={{fontSize:'1.5em',color:'#DE503E',marginBottom: 10}}>{res.data}</p>
                          <p style={{marginBottom: 0}}>通过迁移码，能够迁移个人版用户下的应用到企业中。详细使用参考文档：<a target="_blank" style={{color:'#2488e5'}} href="https://www.yuque.com/shibu/winrobot/gggqcw">个人应用迁移企业</a></p>
                        </div>
                      )
                    })
                  }
                })
              } else if(key=="reset_password") {
                setResetPasswordModalVisible(true);
                setResetPasswordModalData({
                  passwordType: 'system',
                  customPassword: '',
                  userUuid: record.userUuid
                })
              } else if(key=="delete") {
                getdelete(record)
              }
            }}>
              {record.role != 'e_owner'? <Menu.Item key="edit">编辑</Menu.Item>:null}
              {record.userLicense.source === 'extra' ? <Menu.Item key="update_license">更新许可证</Menu.Item>:null}
              {record.accountType != 'basic'? <Menu.Item key="get_migration_code">获取迁移码</Menu.Item>:null}
              <Menu.Item key="reset_password">重置密码</Menu.Item>
              {record.role != 'e_owner'?<Menu.Item key="delete">删除</Menu.Item>:null}
            </Menu>
          }>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              更多 <CaretDownOutlined />
            </a>
          </Dropdown>
        </div>
      ),
    }
  ]
  // 表格选择操作
  const onSelectChange = (selectedRowKeys:string[])=>{
    setSelectedRowKeys(selectedRowKeys);
  }
  const rowSelection={
    currentSelectedRowKeys,
    onChange: onSelectChange
  }

  const gettradeDelay = ()=>{
    setRefeeModalVisible(true);
    setRefeeModalData({
      userLicenseUuids: currentSelectedRowKeys.join(','),
      duration: 1
    })
  }

  const getdelete = (res: DataType) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除用户${res.name}`,
      icon: <QuestionCircleOutlined />,
      onOk() {
        accountApi.deleteUser({
          enterpriseUuid,
          userUuid: res.userUuid
        }).then(res=>{
          if (res.code === 200) {
            message.success('账号删除成功');
            getaccountUser({ page: current, size: size, enterpriseUuid, expiredStatus: sortOrder, key:keywords});
          }
        })
      },
    });
  }

  const pagination = {
    current,
    total,
    showQuickJumper: true,
    showSizeChanger: false,
  };

  const acountModalProps = {
    isModalVisible: isAccountModalVisible,
    onCancel: (flag:boolean)=>{
      if(flag){
        getaccountUser({page: 1, size: 10})
      }
      setAccountModalVisible(false);
    },
    modalDataProps: accountModalData
  }

  const resetPasswordModalProps = {
    isModalVisible: isResetPasswordModalVisible,
    onCancel: (flag:boolean)=>{
      setResetPasswordModalVisible(false);
    },
    modalDataProps: resetPasswordModalData
  }

  const licenseModalProps = {
    isModalVisible: isLicenseModalVisible,
    onCancel: (flag:boolean)=>{
      setLicenseModalVisible(false);
    },
    modalDataProps: licenseModalData
  }

  const refeeProps = {
    isModalVisible: isRefeeModalVisible,
    onCancel: (flag:boolean)=>{
      setRefeeModalVisible(false);
    },
    modalDataProps: refeeModalData
  }

  return (
    <>
    <div className={styles.account}>
      <div className={styles.account_title}>
        <h1>{account_user.name}</h1>
        <div className={styles.account_name}>
          <Tooltip placement="top" title={remainUserQuota}>
            <TeamOutlined />高级账号: (<em>{account_user.userCount}</em>/{account_user.userQuota})
          </Tooltip>
        </div>
        <div className={styles.account_name}>
          <Tooltip placement="top" title={remainBasicUserQuota}>
            <CheckCircleOutlined /> 基础账号: (<em>{account_user.basicUserCount}</em>/{account_user.basicUserQuota})
          </Tooltip>
        </div>
        {account_user.enableExtraAccount ? <div className={styles.account_name}>
          <Tooltip placement="top" title={remainExtraUserQuota}>
            <FileAddOutlined />临时账号: (<em>{account_user.extraUserCount}</em>/{account_user.extraUserQuota})
          </Tooltip>
        </div> : ''}
        <div className={styles.account_name}>
          <Input placeholder="支持账号或姓名模糊查询" style={{width: 200}} onPressEnter={(e:any)=>{
            setKeywords(e.target.value);
            getaccountUser({page: 1, size, expiredStatus: sortOrder, key: e.target.value})
          }} onChange={(e:any)=>setKeywords(e.target.value)} suffix={<SearchOutlined style={{marginRight: 0}} onClick={()=>getaccountUser({page: 1, size, expiredStatus: sortOrder, key: keywords})}/>}/>
        </div>
        <div className={styles.account_name} style={{float: 'right',margin: 0}}>
          <Button type="primary" icon={<PlusOutlined style={{marginRight: 0}}/>} onClick={()=>{
            setAccountModalVisible(true);
            setAccountModalData({
              account: "",
              accountType: "senior",
              email: "",
              name: "",
              passwordType: "system",
              phone: "",
              role: "e_user",
              enableExtraAccount: account_user.enableExtraAccount,
              userLicense: {
                source: 'extra'
              }
            })
          }}>添加成员</Button>
        </div>
      </div>
      <div className={styles.header}>
      <Table
        columns={columns}
        dataSource={listData}
        pagination={pagination}
        rowSelection={rowSelection as any}
        rowKey="uuid"
        onChange={(pagination: any, filters: any, sorter: any) => {
          if (filters.createTime) {
            setsortOrder(filters.createTime[0])
            getaccountUser({ page: pagination.current, size, expiredStatus: filters.createTime[0], key: keywords})
          } else {
            setsortOrder('');
            getaccountUser({ page: pagination.current, size, key: keywords})
          }
        }}/>
      </div>
      {currentSelectedRowKeys.length>0?
      <div className={styles.accountBottom}>
        <p>已选择<span>{ `${currentSelectedRowKeys.length}` }</span>项</p>
        <Button type="primary" onClick={()=>gettradeDelay()}>续费</Button>
        <span style={{lineHeight: '50px',float: 'right',color: '#999', marginRight: 20}}>只支持临时账号续费</span>
      </div>:null}
    </div>
    <AccountModal { ...acountModalProps } />
    <ResetPasswordModal {...resetPasswordModalProps} />
    <LicenseModal {...licenseModalProps} />
    <ReFeeModal {...refeeProps} />
    </>
  );
}
