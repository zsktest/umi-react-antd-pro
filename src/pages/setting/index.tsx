import { useState, useEffect } from 'react';
import { Descriptions, Switch, Input, Modal, message, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import UpdateModal from './components/UpdateModal';
import UpdateTelModal from './components/UpdateTelModal';
import TemporaryAccountModal from './components/TemporaryAccountModal';
import type { FlagType } from '@/models';
import { settingApi, userApi } from '@/api';

import styles from './index.less';

export default function Setting() {
  const [defaults, setDefaults] = useState(false);
  const [modalInfo, setModalInfo] = useState<any>({});
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [telModalVisible, setTelModalVisible] = useState(false);
  const [temporaryAccountVisible, setTemporaryAccountVisible] = useState(false);
  const [scurity, setScurity] = useState<any>({});
  const [enableDefaultMarket, setEnableDefaultMarket] = useState(false);
  const [betaTags, setBetaTags] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [getcreateUsername, setGetcreateUsername] = useState(false);
  const [scurityName, setScurityName] = useState('');
  const [version, setVersion] = useState({ version: '' })

  const { initialState, setInitialState } = useModel<any>('@@initialState');

  const { confirm } = Modal;

  // 邮箱编辑表单信息
  const emailObj = {
    public: {
      title: '修改邮箱',
      type: 'email',
      isfooter: false,
    },
    list: [
      {
        type: 'input',
        placeholder: '请输入新邮箱',
        rules: [
          { required: true, message: '邮箱不能为空！' },
          { type: 'email', message: '请输入正确的邮箱地址！' },
        ],
        code: 'email',
      },
      {
        type: 'btn',
        placeholder: '修改',
      },
    ],
  };
  // 邮箱编辑表单信息
  const contactsObj = {
    public: {
      title: '修改联系人',
      type: 'contacts',
      isfooter: false,
    },
    list: [
      {
        type: 'input',
        placeholder: '请输入新联系人',
        rules: [
          { required: true, message: '联系人不能为空！' },
          { whitespace: true, message: '联系人不能为空！' },
        ],
        code: 'contacts',
      },
      {
        type: 'btn',
        placeholder: '修改',
      },
    ],
  };
  // 密码编辑表单信息
  const passwordObj = {
    public: {
      title: '修改联系人',
      type: 'password',
      isfooter: true,
    },
    list: [
      {
        label: '设置新密码',
        type: 'password',
        placeholder: '请输入新密码',
        rules: [{ required: true, message: '请输入密码' }],
        dependencies: ['password'],
        code: 'pass',
      },
      {
        label: '重复新密码',
        type: 'password',
        placeholder: '请再次输入新密码',
        dependencies: ['password'],
        rules: [
          { required: true, message: '请重新输入密码' },
          ({ getFieldValue }) => ({
            validator(_: any, value: any) {
              console.log(value, 'value', getFieldValue('pass'));
              if (!value || getFieldValue('pass') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入不匹配'));
            },
          }),
        ],
        code: 'checkPass',
      },
    ],
  };
  // 获取初始化设置信息
  const getqueryEnterprise = () => {
    const data = {
      enterpriseUuid: initialState.currentUser.enterpriseUuid
    }
    settingApi.queryEnterprise(data).then((res) => {
      if (res.code === 200) {
        setScurity(res.data);
        setEnableDefaultMarket(res.data.enableDefaultMarket);
        if (res.data.betaTags) {
          res.data.betaTags.map((item: string) => {
            if (item === 'console') {
              setBetaTags(true);
            }
            return item;
          });
        }
        if (res.data.basicAccountAutoAuditSwitch === 'off') {
          setDefaults(false);
        } else {
          setDefaults(true);
        }
      }
    });
  };
  const fetchUserInfo = async () => {
    const userInfo = await userApi.getInfo();
    if (userInfo.code === 200) {
      const userInfoName = userInfo.data;
      setInitialState({
        ...initialState,
        currentUser: userInfoName,
      });
    }
  };
  // 专有云
  const getprivateSv = () => {
    settingApi.privateSv().then(res => {
      console.log(res)
      if (res.code === 200) {
        setVersion(res.data)
      }
    })
  }
  useEffect(() => {
    if (initialState.currentUser) {
      setCurrentUser(initialState.currentUser);
      //创业版和社区版不调用此接口
      if (initialState.currentUser.grade !== 'personal' && initialState.currentUser.grade !== 'free') {
        getqueryEnterprise();
      }
      // 专有云获取版本号
      if (initialState.currentUser.enterpriseType === 'private') {
        getprivateSv()
      }
    }
  }, [initialState]);

  // 唤起编辑弹框
  const info = (val: string) => {
    switch (val) {
      case 'email':
        setModalInfo(emailObj);
        setPostModalVisible(true);
        break;
      case 'contacts':
        setModalInfo(contactsObj);
        setPostModalVisible(true);
        break;
      case 'password':
        setModalInfo(passwordObj);
        setPostModalVisible(true);
        break;
      case 'phone':
        setTelModalVisible(true);
        break;
      default:
        break;
    }
  };
  const onChange = (checked: FlagType) => {
    if (checked) {
      setDefaults(false);
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确认开启基础账号免审批?',
        onOk() {
          const data = {
            basicAccountAutoAuditSwitch: 'on',
          };
          settingApi.enterpriseUpdate(data).then((res) => {
            if (res.code === 200) {
              setDefaults(true);
              getqueryEnterprise();
            }
          });
        },
        onCancel() { },
      });
    } else {
      setDefaults(true);
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确认关闭基础账号免审批?',
        onOk() {
          const data = {
            basicAccountAutoAuditSwitch: 'off',
          };
          settingApi.enterpriseUpdate(data).then((res) => {
            if (res.code === 200) {
              setDefaults(false);
              getqueryEnterprise();
            }
          });
        },
        onCancel() { },
      });
    }
  };
  // 关闭
  const closeModal = (visible: FlagType) => {
    //  更新信息
    if (visible) {
      // 企业版
      if (currentUser.grade !== 'personal' && currentUser.grade !== 'free') {
        getqueryEnterprise();
      } else {
        // 社区版及创业板
        fetchUserInfo()
      }
    }
    fetchUserInfo()
    setTelModalVisible(false);
    setPostModalVisible(false);
    setTemporaryAccountVisible(false);
  };
  // 提交企业名称修改
  const getenterpriseUpdate = (name: string) => {
    settingApi.enterpriseUpdate({ name }).then((res) => {
      if (res.code === 200) {
        message.success('企业名称修改成功');
        setGetcreateUsername(false);
      }
    });
  };
  const scuritynameFn = () => {
    setScurityName(scurity.name);
    setGetcreateUsername(true);
  };
  const onChangeScurityName = (e: any) => {
    setScurityName(e.target.value);
  };
  // 开通高级账号
  const openAdvancedAccount = () => {
    Modal.info({
      title: '请联系影刀官方技术支持',
      content: <div></div>,
      onOk() { },
    });
  };
  // 开通临时账号
  const openTemporaryAccount = () => {
    setTemporaryAccountVisible(true);
  };
  // 重建
  const reBuild = () => {
    settingApi.rebuildindex().then((res) => {
      if (res.code === 200) {
        message.success('重建成功！');
      }
    });
  };
  //  企业市场切换
  const onChangeMarket = (checked: FlagType) => {
    const data = {
      enterpriseUuid: currentUser.enterpriseUuid,
    };
    if (checked) {
      setEnableDefaultMarket(false);
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '企业默认市场开启后，默认企业内所有员工可见。开启后可随时关闭',
        onOk() {
          settingApi.disableDefaultMarket(data).then((res) => {
            if (res.code === 200) {
              setEnableDefaultMarket(true);
              message.success('修改成功！');
            }
          });
        },
        onCancel() { },
      });
    } else {
      setEnableDefaultMarket(true);
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '你可随时重新开启企业市场，确认关闭?',
        onOk() {
          settingApi.disableDefaultMarket(data).then((res) => {
            if (res.code === 200) {
              setEnableDefaultMarket(false);
              message.success('修改成功！');
            } else {
              message.warning(res.msg);
            }
          });
        },
        onCancel() { },
      });
    }
  };
  return (
    <div className={styles.setting}>
      <div className="account_settings_info_title">设置</div>
      {currentUser.grade !== 'personal' && currentUser.grade !== 'free' ?
        <div><div className="login_userName">
          <p className="content">
            登录用户名：{currentUser.name}{' '}
            <a onClick={() => info('password')} style={{ color: '#1890ff' }}>
              修改密码
            </a>
          </p>
        </div>
          <div className="bottom_content">
            {!getcreateUsername && (
              <p className="content">
                企业名称：<span>{scurity.name}</span>
                {currentUser.enterpriseType === 'private' && (
                  <span className="scurityName" onClick={scuritynameFn}>
                    修改
                  </span>
                )}
              </p>
            )}
            {getcreateUsername && (
              <p className="content">
                企业名称：
                <Input
                  value={scurityName}
                  style={{ width: '200px' }}
                  placeholder="请输入企业名称"
                  onChange={onChangeScurityName}
                />
                <span
                  className="scurityName"
                  onClick={() => {
                    getenterpriseUpdate(scurityName);
                  }}
                >
                  确定
                </span>
              </p>
            )}
            <div className="content content_div">
              <span className="edition_title">版本信息：</span>
              <Descriptions layout="vertical" bordered className="edition_descriptions">
                <Descriptions.Item label="版本类型">企业版</Descriptions.Item>
                <Descriptions.Item label="高级账号">
                  {scurity.userQuota}个<a onClick={() => openAdvancedAccount()}>开通更多</a>
                </Descriptions.Item>
                {currentUser.enterpriseType !== 'private' && scurity.enableExtraAccount && (
                  <Descriptions.Item label="临时账号">
                    {scurity.extraUserQuota}个<a onClick={() => openTemporaryAccount()}>临时开通</a>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
            <p className="content">
              联系邮箱：{scurity.contactEmail}
              {currentUser.enterpriseRoleCode === 'e_owner' && (
                <a className="update" onClick={() => info('email')}>
                  修改
                </a>
              )}
            </p>
            <p className="content contacts">
              <span>联系人：</span>
              {scurity.contactMan}
              {currentUser.enterpriseRoleCode === 'e_owner' && (
                <a className="update" onClick={() => info('contacts')}>
                  修改
                </a>
              )}
            </p>
            <p className="content">
              联系电话：{scurity.contactPhone}
              {currentUser.enterpriseRoleCode === 'e_owner' && (
                <a className="update" onClick={() => info('phone')}>
                  修改
                </a>
              )}
            </p>
            <p className="content">到期时间：{scurity.expiredTime}</p>
            {currentUser.enterpriseType === 'private' && <p className="content">专有云版本: {version.version}</p>}
            {betaTags && (
              <p className="content">
                基础账号免审批：
                <Switch size="small" checked={defaults} onChange={onChange} />
              </p>
            )}
            <p className="content">
              企业默认市场：
              <Switch className="market" size="small" checked={enableDefaultMarket} onChange={onChangeMarket} />
            </p>
            {currentUser.enterpriseType === 'private' && (
              <div className="reBuild">
                <p slot="title" className="security_bottom">
                  到期时间: <br />
                  <span>
                    重建索引会重新计算今天以前系统的统计数据，如应用、用户的使用时长，使用次数等。
                    <Popconfirm
                      placement="top"
                      title="确定要重建此任务么?"
                      onConfirm={reBuild}
                      okText="确定"
                      cancelText="取消"
                    >
                      <a href="#">重建</a>
                    </Popconfirm>
                  </span>
                </p>
              </div>
            )}
          </div>
        </div> :
        <div>
          <div className="securitytitle">个人信息</div>
          <div className="persionalInfo">
            <p>
              <span className="label">用户名: </span><span className="inputbor">{currentUser.name}</span>
            </p>
            <p>
              <span className="label">手机号: </span><span className="inputbor">{currentUser.phone}</span><a onClick={() => info('phone')}>修改</a>
            </p>
            <p>
              <span className="label">邮箱:</span><span className="inputbor">{currentUser.email}</span>
            </p>
            <p>
              <span className="label">密码:</span><span className="inputbor">********</span><a onClick={() => info('password')}>修改密码</a>
            </p>
          </div>
          <div className="securitytitle">版本信息</div>
          <div className="versionInfo">
            <p>
              <span className="label">版本信息: </span><span className="inputbor">{currentUser.gradeName}</span>
            </p>
            {currentUser.grade === 'personal' && <p>
              <span className="label">到期时间: </span><span className="inputbor">{currentUser.expiredTime}</span>
            </p>}
          </div>
        </div>
      }
      {postModalVisible && (
        <UpdateModal
          modalDataProps={modalInfo}
          isModalVisible={postModalVisible}
          onCancel={closeModal}
        />
      )}
      {telModalVisible && <UpdateTelModal modalDataProps={{ grade: currentUser.grade }} isModalVisible={telModalVisible} onCancel={closeModal} />}
      {temporaryAccountVisible && (
        <TemporaryAccountModal isModalVisible={temporaryAccountVisible} onCancel={closeModal} />
      )}
    </div>
  );
}
