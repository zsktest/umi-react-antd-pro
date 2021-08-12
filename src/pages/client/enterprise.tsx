import { useState,useCallback, useEffect } from 'react';
import { PageHeader, Popover, Button, Tabs } from 'antd';
import { ExclamationCircleOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import ModalEnterpriceInfo from './components/ModalEnterpriseInfo';
import EmployeeAddModal from './components/EmployeeAddModal';
import ApplySeniorModal from './components/ApplySeniorModal';
import AccountList from '@/pages/account_nx';
import ApprovalList from '@/pages/approval';
import Home from './components/Home';
import { accountApi } from '@/api';
import { EnterpriseInfoType } from './data.d';

import styles from './index.less';

const { TabPane } = Tabs;

const content:(principalUserName:string, principalUserPhone: string)=>React.ReactNode = (principalUserName, principalUserPhone)=>{
  return <div>
    <p>{principalUserName}</p>
    <p>{principalUserPhone}</p>
  </div>
}

const Title:React.FC<{ enterpriseInfo:any,scurity: any, onEditEnterprise:any, enterpriseRoleCode:string|undefined }> = ({enterpriseInfo, scurity, onEditEnterprise, enterpriseRoleCode })=>{
  return (
    <div className={styles.application_detail}>
      <div className="application_detailimg">
        <img src={enterpriseInfo?.enterpriseIcon} style={{width:56,height:56}} />
      </div>
      <div className="application_detailright">
        <h2>{scurity?.name}
        {enterpriseRoleCode=="e_owner"||enterpriseRoleCode=="e_admin" ? <EditOutlined onClick={onEditEnterprise} style={{display:'inline', fontSize: 18,marginLeft: 8,color: '#474f59', fontWeight: 500}}/>:null}
        </h2>
        <span>{scurity?.enterpriseDescription}&nbsp;
          <Popover content={content(scurity?.principalUserName,scurity?.principalUserPhone)} title="负责人" placement="rightTop">
            <ExclamationCircleOutlined style={{display:'inline'}}/>
          </Popover>
        </span>
      </div>
    </div>
  )
}

const Extra: React.FC<{ enterpriseRoleCode:string|undefined, enterpriseUserAccountType:string|undefined, onColleagues: any, onApplySenior:any }> = ({ enterpriseRoleCode, enterpriseUserAccountType, onColleagues, onApplySenior})=>{
  return (
    <div>
      <Button type="primary" style={{marginTop: 42}} onClick={onColleagues} icon={<PaperClipOutlined />}>邀请同事</Button>
      {enterpriseRoleCode=="e_owner" || enterpriseRoleCode=="e_admin" ? <a href="https://console.winrobot360.com" style={{marginLeft: 8}} target="_blank"><Button>控制台</Button></a>:null}
      {enterpriseUserAccountType == "basic"?<Button type="primary" ghost onClick={onApplySenior} style={{marginLeft: 8}}>申请高级账号</Button>:null}
    </div>
  )
}

export default function EnterprisePage() {
  const [currentKey, setCurrentKey] = useState('home');
  const [enterpriseInfo, setEnterpriseInfo] = useState<EnterpriseInfoType>();
  const [scurity, setScurity] = useState();
  const { initialState } = useModel('@@initialState');
  const enterpriseRoleCode = initialState?.currentUser?.enterpriseRoleCode;
  const enterpriseUserAccountType = initialState?.currentUser?.enterpriseUserAccountType;

  const [enterpriseInfoVisible, setEnterpriseInfoVisible] = useState(false);

  const [isEmployeeAddVisible, setEmployeeAddVisible] = useState(false);
  const [isAppliedSeniorVisible, setAppliedSeniorVisible] = useState(false);

  useEffect(()=>{
    getEnterpriseInfo();
  }, [])

  const getEnterpriseInfo=()=>{
    accountApi.queryEnterprise().then(res=>{
      if(res.success) {
        setEnterpriseInfo({
          name: res.data.name,
          enterpriseDescription: res.data.enterpriseDescription,
          enterpriseIcon: res.data.enterpriseIcon || 'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/images/f7/05/ab1a364b117127f08fe0ba32cda7.jpg',
          principalUserName: res.data.principalUserName,
          principalUserPhone: res.data.principalUserPhone
        });
        setScurity(res.data);
      }
    })
  }

  const callback = (key:string)=>{
    setCurrentKey(key);
  }

  const renderContent = useCallback(()=>{
    if(currentKey=="home") {
      return <div className="page-content">
      <Home />
    </div>
    } else if(currentKey=="account"){
      return (<div className="page-content">
        <AccountList />
      </div>)
    } else {
      return (<div className="page-content">
        <ApprovalList />
      </div>)
    }
  }, [currentKey])

  const onEditEnterprise = ()=>{
    setEnterpriseInfoVisible(true);
  }

  const onColleagues = ()=>{
    setEmployeeAddVisible(true);
  }

  const onApplySenior = ()=>{
    setAppliedSeniorVisible(true);
  }

  const closeEnterpriseInfo =(flag:boolean)=>{
    if(flag){
      getEnterpriseInfo();
    }
    setEnterpriseInfoVisible(false);
  }

  const EnterpriceInfoProps = {
    isModalVisible: enterpriseInfoVisible, 
    onCancel: closeEnterpriseInfo,
    modalDataProps: enterpriseInfo
  }

  const closeEmployeeAddModal = (flag:boolean)=>{
    setEmployeeAddVisible(false);
  }

  const employeeAddModalProps = {
    isModalVisible: isEmployeeAddVisible, 
    onCancel: closeEmployeeAddModal,
    modalDataProps: {
      scurity,
      enterpriseRoleCode
    }
  }

  const closeAppliedSeniorModal = ()=>{
    setAppliedSeniorVisible(false)
  }

  const applySeniorModalProps = {
    isModalVisible: isAppliedSeniorVisible,
    onCancel: closeAppliedSeniorModal,
    //modalDataProps
  }

  return (
    <div className={styles.client}>
      <div className={styles.topShadow}></div>
      <PageHeader
        className="page-header"
        title={<Title enterpriseRoleCode={enterpriseRoleCode} enterpriseInfo={enterpriseInfo} scurity={scurity} onEditEnterprise={onEditEnterprise}/>}
        extra={<Extra {...{enterpriseRoleCode, enterpriseUserAccountType, onColleagues, onApplySenior}}/>}
        footer={(enterpriseRoleCode=="e_owner")||(enterpriseRoleCode=="e_admin")?<Tabs defaultActiveKey="home" onChange={callback}>
          <TabPane tab="首页" key="home"  />
          <TabPane tab="账号管理" key="account" />
          <TabPane tab="审批列表" key="approval" />
        </Tabs>:null}
      ></PageHeader>
      {renderContent()}
      <div className="footer"><span></span>解放你的双手，快乐工作，认真生活<span style={{float:'right'}}></span></div>
      <ModalEnterpriceInfo {...EnterpriceInfoProps} />
      <EmployeeAddModal {...employeeAddModalProps} />
      <ApplySeniorModal {...applySeniorModalProps} />
    </div>
  );
}