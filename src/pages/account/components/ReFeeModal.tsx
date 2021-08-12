import React, { useMemo, useState, useEffect } from 'react';
import { Input, Modal, Button, Divider, Result } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { ModalProps } from '@/models';
import { accountApi } from '@/api';
import { ModalRefeeType } from '../data.d';

import styles from '../index.less';

type FeeParamsType = {
  duration: number;
  count: number;
  enterpriseUuid: string|undefined;
}

type EnquiryUserLicensesType = {
  receiptAmountValue: number;
  totalAmountValue: number;
}

export default ({isModalVisible, onCancel, modalDataProps }: ModalProps<ModalRefeeType>)=>{
  const [month, setMonth]=useState(1);
  const [enquiryUserLicenses, setEnquiryUserLicenses]=useState<EnquiryUserLicensesType>({
    receiptAmountValue: 0,
    totalAmountValue: 0
  });
  const [userPayName, setUserPayName] = useState(false);
  const [userPay, setUserPay]=useState(true);
  const [userOrderUuid, setUserOrderUuid]=useState<{userOrderUuid:string}>();
  const [paySuccess, setPaySuccess]=useState(false);
  const [payError, setPayError]=useState(false);

  const { initialState } = useModel('@@initialState');
  const enterpriseUuid = initialState?.currentUser?.enterpriseUuid;
  const isVisible = useMemo(()=>isModalVisible, [isModalVisible]);

  useEffect(()=>{
    if(isModalVisible){
      setMonth(1);
      setUserPayName(false);
      setUserPay(true);
      setUserOrderUuid({userOrderUuid: ''});
      setPaySuccess(false);
      setPayError(false);
      getenquiryUserLicense({
        duration: 1,
        count: 1,
        enterpriseUuid
      });
    }
  }, [isModalVisible])
  
  const handleCancel =()=>{
    onCancel(false);
  }

  const decline = () => {
    let temp = month - 1;
    if(temp <=1) {
      temp = 1;
    }
    setMonth(temp);
    const params = {
      count: 1,
      duration: temp,
      enterpriseUuid
    }
    getenquiryUserLicense(params);
  }

  const inincrease = () => {
    let temp = month + 1;
    if (temp >= 12) {
      temp = 12
    }
    setMonth(temp);
    const params = {
      count: 1,
      duration: temp,
      enterpriseUuid
    }
    getenquiryUserLicense(params);
  }

  const descline = (e:any)=>{
    let temp = e.target.value;
    if (temp >= 12) {
      temp = 12
    }
    if (temp === '') {
      temp = 1
    }
    var isNaN = /^[1-9]+[0-9]*]*$/
    if (!isNaN.test(temp)) {
      temp = 1
    }
    setMonth(temp);
    const params = {
      count: 1,
      duration: temp,
      enterpriseUuid
    }
    getenquiryUserLicense(params);
  }

  // 获取价格
  const getenquiryUserLicense = (params: FeeParamsType) => {
    accountApi.enquiryUserLicense(params).then(res => {
      if (res.code === 200) {
        setEnquiryUserLicenses(res.data)
      }
    })
  }

  const xenqufiryUser=()=>{
    const params = {
      duration: month,
      userLicenseUuids: modalDataProps?.userLicenseUuids,
      enterpriseUuid
    }
    accountApi.tradeDelay(params).then(res=>{
      if(res.success) {
        setUserPay(false);
        setUserPayName(true);
        setUserOrderUuid(res.data);
        window.open(res.data.payUrl, '_blank');
      }
    })
  }

  const paycomplete = ()=>{
    accountApi.queryOrderPayoff({ userOrderUuid: userOrderUuid?.userOrderUuid}).then(res=>{
      if(res.success) {
        setUserPayName(false);
        if (res.data === 'payed' || res.data === 'finish') {
          setPaySuccess(true);
        } else {
          setPayError(true);
        }
      }
    })
  }

  const continuePay = ()=>{
    const params = {
      enterpriseUuid,
      userOrderUuid: userOrderUuid?.userOrderUuid
    }
    accountApi.tradePay(params).then(res=>{
      if(res.success) {
        setUserPay(false);
        setPayError(false);
        setUserPayName(true);
        setUserOrderUuid(res.data);
        window.open(res.data.payUrl, '_blank')
      }
    })
  }

  return (
    <Modal title={'续费临时账号'} visible={isVisible} onCancel={handleCancel} footer={null}>
      {userPay ? <div>
        <p>企业内高级账号不足，可以购买临时账号来补充</p>
        <div className={styles.month}>
          <p>购买时长<span>(月)</span></p>
          <div>
            <Button onClick={()=>decline()}><MinusOutlined /></Button>
            <Input style={{display: 'inline-block',width: 80,textAlign: 'center'}} value={month} onChange={e=>descline(e)}/>
            <Button onClick={()=>inincrease()}><PlusOutlined /></Button>
          </div>
        </div>
        <div className={styles.month} style={{marginTop:8}}>
          <p>支付方式</p>
          <div>
            <img src={require('@/assets/img/alipay.png')} alt="" width="32"/>
            支付宝
          </div>
        </div>
        <Divider />
        <div className={styles.month} style={{marginTop:8}}>
          <p>总计</p>
          <div className="payname">{enquiryUserLicenses?.totalAmountValue}元</div>
          <div className="paynameenquiry"><span>促销价</span>{enquiryUserLicenses?.receiptAmountValue}<span>元</span></div>
          <div className="bt"></div>
        </div>
        <Button type="primary" onClick={()=>xenqufiryUser()}>立即支付</Button>
      </div>:null}
      {userPayName ? <div>
        <p>支付完成前，请不要关闭此支付验证窗口。支付完成后，请根据您的情况点击下面按钮。</p>
        <div>
          <Button type="primary" onClick={()=>paycomplete()}>支付完成</Button>
          <Button type="primary" ghost style={{marginLeft: 8}} onClick={()=>onCancel(false)}>取消</Button>,
        </div>
      </div>:null}
      { paySuccess ? <div>
        <Result
          status="success"
          title="支付成功"
          extra={[
            <Button type="primary" onClick={()=>onCancel(false)}>确定</Button>,
          ]}
        />
      </div>:null}
      { payError ? <div>
        <Result
          status="error"
          title="支付失败"
          subTitle="如果您有任何疑问，请立即联系客服：0571-28284656"
          extra={[
            <Button type="primary" onClick={()=>onCancel(false)}>取消</Button>,
            <Button type="primary" ghost onClick={()=>continuePay()} style={{marginLeft: 8}}>继续支付</Button>,
          ]}
        />
      </div>:null}
    </Modal>
  )
}