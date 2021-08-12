import { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Input, Button, Divider, Result } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import type { ModalProps, YDResponse, ListType, AnyType } from '@/models';
import { settingApi } from '@/api';

import styles from './../index.less';

interface Data {
  count: number,
  duration: number,
}

export default ({ isModalVisible, onCancel }: ModalProps<AnyType>) => {
  const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
  const [userpay, setUserpay] = useState(true);
  const [userpayname, setUserpayname] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState(false);
  const [month, setMonth] = useState(1);
  const [number, setNumber] = useState(1);
  const [enquiryUserLicenses, setEnquiryUserLicenses] = useState<any>({});
  const [userOrderUuid, setUserOrderUuid] = useState<any>({});

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  const getMonth = useRef(1);
  const getNumber = useRef(1);
  // 获取价格
  const getenquiryUserLicense = (data: Data) => {
    const obj = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
    };
    settingApi.enquiryUserLicense(obj).then((res: YDResponse<ListType[]>) => {
      if (res.code === 200) {
        setEnquiryUserLicenses(res.data);
      } 
    });
  };
  // 关闭弹框
  const handleCancel = () => {
    if(userpay){
      onCancel(false);
  }else{
      onCancel(true);
  }
  };
  /**
   * descrption: 数量加减
   * @param monthVal number:数量
   * @param status string: 状态 add:加， cut：减
   */
  const decline = (monthVal: number, status: string) => {
    let val = monthVal;
    // 拦截无数据变化无用操作
    if ((month >= 12 && status === 'add') || (month <= 1 && status === 'cut')) {
      return;
    }
    if (status === 'add') {
      val = val >= 12 ? 12 : (val += 1);
    } else {
      val = val <= 1 ? 1 : (val -= 1);
    }
    setMonth(val);
    const data = {
      count: number,
      duration: val,
    };
    getenquiryUserLicense(data);
  };
  // 改变时长
  const changeMonth = (e: any) => {
    setMonth(e.target.value);
    getMonth.current = e.target.value;
  };
  // 购买时长失去焦点事件
  const descline = () => {
    let val = getMonth.current;
    if (val >= 12) {
      val = 12;
    }
    if (!val) {
      val = 1;
    }
    const isNaN = /^[1-9]+[0-9]*]*$/;
    if (!isNaN.test(val.toString())) {
      val = 1;
    }
    setMonth(val);
    const data = {
      count: number,
      duration: val,
    };
    getenquiryUserLicense(data);
  };
  /**
   * descrption: 数量加减
   * @param numVal number:数量
   * @param status string: 状态 add:加， cut：减
   */
  const denumber = (numVal: number, status: string) => {
    let val = numVal;
    // 拦截无数据变化无用操作
    if ((number >= 99 && status === 'add') || (number <= 1 && status === 'cut')) {
      return;
    }
    if (status === 'add') {
      val = val >= 99 ? 99 : (val += 1);
    } else {
      val = val <= 1 ? 1 : (val -= 1);
    }
    setNumber(val);
    const data = {
      count: val,
      duration: month,
    };
    getenquiryUserLicense(data);
  };

  // 购买数量失去焦点事件
  const insnumber = () => {
    let val = getNumber.current;
    if (val >= 99) {
      val = 99;
    }
    if (!val) {
      val = 1;
    }
    const isNaN = /^[1-9]+[0-9]*]*$/;
    if (!isNaN.test(val.toString())) {
      val = 1;
    }
    const data = {
      count: val,
      duration: month,
    };
    getenquiryUserLicense(data);
  };
  // 改变数量
  const changeNumber = (e: any) => {
    getNumber.current = e.target.value;
    setNumber(e.target.value);
  };
  useEffect(() => {
    if (isModalVisible) {
      const data = {
        count: 1,
        duration: 1,
      };
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getenquiryUserLicense(data);
    }
  }, [isModalVisible]);

  // 点击支付按钮
  const enquiryUserpay = () => {
    const data = {
      count: number,
      duration: month,
      enterpriseUuid: enterpriseUuid.current,
    };
    settingApi.orderUserLicenseWithAlipay(data).then((res) => {
      if (res.code === 200) {
        setUserpay(false);
        setUserpayname(true);
        //   // payUrl
        setUserOrderUuid(res.data);
        window.open(res.data.payUrl, '_blank');
      }
    });
  };
  // 支付完成确定
  const paycomplete = () => {
    const data = {
      userOrderUuid: userOrderUuid.userOrderUuid,
    };
    settingApi.queryOrderPayoff(data).then((res) => {
      if (res.code === 200) {
        setUserpayname(false);
        if (res.data === 'payed' || res.data === 'finish') {
          setPaySuccess(true);
        } else {
          setPayError(true);
        }
      }
    });
  };
  // 支付成功确定
  const payquxiao = () => {
    onCancel(false);
  };
  // 继续支付确定
  const continuePay = () => {
    const data = {
      enterpriseUuid: enterpriseUuid.current,
      userOrderUuid: userOrderUuid.userOrderUuid,
    };
    settingApi.tradePay(data).then((res) => {
      if (res.code === 200) {
        setUserpay(false);
        setPayError(false);
        setUserpayname(true);
        setUserOrderUuid(res.data);
        window.open(res.data.payUrl, '_blank');
      }
    });
  };
  return (
    <>
      <Modal title="购买附加账号" visible={isVisible} footer={null} onCancel={handleCancel}>
        {userpay && (
          <div className={styles.userpay}>
            <p>企业内高级账号不足，可以购买附加账号来补充</p>
            <div className="month">
              <p>
                购买时长<span>(月)</span>
              </p>
              <div className="operation">
                <Button onClick={() => decline(month, 'cut')}>
                  <MinusOutlined />
                </Button>
                <Input value={month} onBlur={descline} onChange={changeMonth} />
                <Button onClick={() => decline(month, 'add')}>
                  <PlusOutlined />
                </Button>
              </div>
              <span>到期时间 {enquiryUserLicenses.licenseEndTime}</span>
            </div>
            <div className="month">
              <p>购买数量</p>
              <div className="operation">
                <Button onClick={() => denumber(number, 'cut')}>
                  <MinusOutlined />
                </Button>
                <Input value={number} onBlur={insnumber} onChange={changeNumber} />
                <Button onClick={() => denumber(number, 'add')}>
                  <PlusOutlined />
                </Button>
              </div>
            </div>
            <div className="month" style={{ marginTop: '8px' }}>
              <p>支付方式</p>
              <div>
                <img src={require('@/assets/img/alipay.png')} alt="" width="32" />
                支付宝
              </div>
            </div>
            <Divider />
            <div className="month" style={{ marginTop: '8px' }}>
              <p>总计</p>
              <div className="payname">{enquiryUserLicenses.totalAmountValue}元</div>
              <div className="paynameenquiry">
                <span>促销价</span>
                {enquiryUserLicenses.receiptAmountValue}
                <span>元</span>
              </div>
            </div>
            <Button type="primary" onClick={enquiryUserpay}>
              立即支付
            </Button>
          </div>
        )}
        {userpayname && (
          <div>
            <p>支付完成前，请不要关闭此支付验证窗口。支付完成后，请根据您的情况点击下面按钮。</p>
            <div>
              <Button type="primary" key="paycomplete" onClick={paycomplete}>
                支付完成
              </Button>
              <Button style={{ marginLeft: '10px' }} key="payquxiao" onClick={payquxiao}>
                取消
              </Button>
            </div>
          </div>
        )}
        {paySuccess && (
          <div>
            <Result
              status="success"
              title="支付成功"
              extra={[
                <Button key="paySure" type="primary" onClick={payquxiao}>
                  确定
                </Button>,
              ]}
            />
          </div>
        )}
        {payError && (
          <div>
            <Result
              status="error"
              title="支付失败"
              subTitle="如果您有任何疑问，请立即联系客服：0571-28284656"
              extra={[
                <Button onClick={payquxiao}>取消</Button>,
                <Button key="continuePay" type="primary" onClick={continuePay}>
                  继续支付
                </Button>,
              ]}
            />
          </div>
        )}
      </Modal>
    </>
  );
};
