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

  const remainUserQuota = <span>???????????? { account_user.remainUserQuota } ???????????????</span>;
  const remainBasicUserQuota = <span>???????????? { account_user.remainBasicUserQuota } ???????????????</span>;
  const remainExtraUserQuota = <span>???????????? { account_user.remainExtraUserQuota } ???????????????</span>;

  useEffect(() => {
    getqueryEnterprise();
  }, []);

  // ??????title??????
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
  // ?????????????????????
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
  // ?????????
  const columns = [
    {
      title: '????????????',
      dataIndex: 'loginAccount',
      width: '20%',
      render: (text:string, record:any)=>(
        <div >
          <Paragraph copyable className={styles.loginAccount}>
            {text}
            {record.userLicense.source == "extra" ? <Tag color="processing" className={styles.timerTag}>??????</Tag>:null}
          </Paragraph>
        </div>
      )
    },
    {
      title: '????????????',
      width: '15%',
      dataIndex: 'name'
    },
    {
      title: '????????????',
      dataIndex: 'roleName'
    },
    {
      title: '????????????',
      dataIndex: 'accountTypeName',
      render: (text: string, record: any) => (
        <div>
          {record.accountType === 'senior' ? <Tag color="blue">{ record.accountTypeName }</Tag>: <Tag>{ record.accountTypeName }</Tag>}
        </div>
      ),
    },
    {
      title: '????????????',
      dataIndex: 'latestLoginTime'
    },
    {
      title: '????????????',
      dataIndex: 'createTime',
      render: (text: string, record: any) => (
        <div>
          <span>{record.expiredTime.slice(0,10)}</span>
          {record.userLicense.status === 'expired' ? <div className={styles.tasktopend}>
             <span><ClockCircleOutlined />&nbsp;??????</span>
          </div>:null}
        </div>
      ),
      filters: [
        {
          text: '?????????',
          value: 'unexpired'
        },
        {
          text: '15?????????',
          value: 'recent15DaysExpired'
        },
        {
          text: '?????????',
          value: 'expired'
        }
      ],
      filterMultiple: false
    },
    {
      title: '??????',
      dataIndex: '',
      width: '14%',
      render:(text: string, record: DataType) => (
        <div className={styles.action}>
          <a href="#!" onClick={()=>history.push(`/account/detail?userUuid=${record.userUuid}`)}>??????</a>
          {record.userLicense && record.userLicense.source === 'extra'? <a href="#!" onClick={()=>{
            setRefeeModalVisible(true);
            setRefeeModalData({
              userLicenseUuids: record.userLicense.uuid,
              duration: 1
            })
          }}>??????</a> : ''}
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
                      title: '???????????????',
                      width: 500,
                      content: (
                        <div>
                          <p style={{fontSize:'1.5em',color:'#DE503E',marginBottom: 10}}>{res.data}</p>
                          <p style={{marginBottom: 0}}>???????????????????????????????????????????????????????????????????????????????????????????????????<a target="_blank" style={{color:'#2488e5'}} href="https://www.yuque.com/shibu/winrobot/gggqcw">????????????????????????</a></p>
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
              {record.role != 'e_owner'? <Menu.Item key="edit">??????</Menu.Item>:null}
              {record.userLicense.source === 'extra' ? <Menu.Item key="update_license">???????????????</Menu.Item>:null}
              {record.accountType != 'basic'? <Menu.Item key="get_migration_code">???????????????</Menu.Item>:null}
              <Menu.Item key="reset_password">????????????</Menu.Item>
              {record.role != 'e_owner'?<Menu.Item key="delete">??????</Menu.Item>:null}
            </Menu>
          }>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              ?????? <CaretDownOutlined />
            </a>
          </Dropdown>
        </div>
      ),
    }
  ]
  // ??????????????????
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
      title: '??????',
      content: `?????????????????????${res.name}`,
      icon: <QuestionCircleOutlined />,
      onOk() {
        accountApi.deleteUser({
          enterpriseUuid,
          userUuid: res.userUuid
        }).then(res=>{
          if (res.code === 200) {
            message.success('??????????????????');
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
            <TeamOutlined />????????????: (<em>{account_user.userCount}</em>/{account_user.userQuota})
          </Tooltip>
        </div>
        <div className={styles.account_name}>
          <Tooltip placement="top" title={remainBasicUserQuota}>
            <CheckCircleOutlined /> ????????????: (<em>{account_user.basicUserCount}</em>/{account_user.basicUserQuota})
          </Tooltip>
        </div>
        {account_user.enableExtraAccount ? <div className={styles.account_name}>
          <Tooltip placement="top" title={remainExtraUserQuota}>
            <FileAddOutlined />????????????: (<em>{account_user.extraUserCount}</em>/{account_user.extraUserQuota})
          </Tooltip>
        </div> : ''}
        <div className={styles.account_name}>
          <Input placeholder="?????????????????????????????????" style={{width: 200}} onPressEnter={(e:any)=>{
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
          }}>????????????</Button>
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
        <p>?????????<span>{ `${currentSelectedRowKeys.length}` }</span>???</p>
        <Button type="primary" onClick={()=>gettradeDelay()}>??????</Button>
        <span style={{lineHeight: '50px',float: 'right',color: '#999', marginRight: 20}}>???????????????????????????</span>
      </div>:null}
    </div>
    <AccountModal { ...acountModalProps } />
    <ResetPasswordModal {...resetPasswordModalProps} />
    <LicenseModal {...licenseModalProps} />
    <ReFeeModal {...refeeProps} />
    </>
  );
}
