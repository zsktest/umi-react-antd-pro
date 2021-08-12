import { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Button, message, Divider, Result } from 'antd';
import { useModel } from 'umi';

import type { ModalProps, AnyType } from '@/models';
import { settingApi, walletApi } from '@/api';

import styles from './PayModal.less';
interface Item {
    uuid: string;
    receiptAmount: number;
    amount: number
    amountValue: string;
    code: string;
    discountAmount: number
    discountAmountValue: string;
    duration: number;
    name: string;
    offerSpecUuid: string;
    prodSpecCode: string;
    prodSpecName: string;
    receiptAmountValue: string;
    timeUnit: string;
}
const selectedDenominationObj = {
    amount: 0,
    amountValue: "",
    code: "",
    discountAmount: 0,
    discountAmountValue: '',
    duration: 0,
    name: "",
    offerSpecUuid: "",
    prodSpecCode: "",
    prodSpecName: "",
    receiptAmount: 0,
    receiptAmountValue: "",
    timeUnit: "",
    uuid: "",
}
export default ({ isModalVisible, onCancel }: ModalProps<AnyType>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [userpay, setUserpay] = useState(true);
    const [userpayname, setUserpayname] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);
    const [payError, setPayError] = useState(false);
    const [userOrderUuid, setUserOrderUuid] = useState<any>({});
    const [queryOnSalename, setQueryOnSalename] = useState([])
    const [selectedDenomination, setSelectedDenomination] = useState({ ...selectedDenominationObj })

    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');

    // 关闭弹框
    const handleCancel = () => {
        if(userpay){
            onCancel(false);
        }else{
            onCancel(true);
        }
    };
    // 钱包购买列表
    const getsaleQueryOnSale = () => {
        const data = {
            prodSpecCode: 'recharge'
        }
        walletApi.saleQueryOnSale(data).then(res => {
            if (res.code === 200) {
                setSelectedDenomination(res.data[0])
                setQueryOnSalename(res.data)
            } else {
                message.warning(res.msg)
            }
        })
    }
    useEffect(() => {
        if (isModalVisible) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
            getsaleQueryOnSale()
        }
    }, [isModalVisible]);

    // 点击支付按钮
    const enquiryUserpay = () => {
        const data = {
            offerSpecCode: selectedDenomination.code
        };
        walletApi.orderWithAlipay(data).then((res) => {
            if (res.code === 200) {
                setUserpay(false);
                setUserpayname(true);
                //   // payUrl
                setUserOrderUuid(res.data);
                window.open(res.data.payUrl, '_blank');
            } else {
                message.warning(res.msg);
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
            } else {
                message.warning(res.msg);
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
            } else {
                message.warning(res.msg);
            }
        });
    }
    // 选择面额
    const ication_select = (item: Item) => {
        setSelectedDenomination(item)
    }
    return (
        <>
            <Modal title="钱包充值" visible={isVisible} footer={null} onCancel={handleCancel}>
                {userpay && (
                    <div className={styles.userpay}>
                        <div className="month">
                            <p>购买面额</p>
                            <div className="last">
                                <ul>
                                    {
                                        queryOnSalename.length && queryOnSalename.map((item: Item) => (
                                            <li key={item.uuid} onClick={() => ication_select(item)} className={selectedDenomination.uuid === item.uuid ? 'act' : ''}>
                                                <p>¥{item.receiptAmount / 100}卡券</p>
                                                <span>{item.receiptAmount / 100}元</span>
                                                <img src={require('@/assets/img/selected.png')} alt=""></img>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <p><span></span>钱包余额可用于支付多项收费服务</p>
                                <p><span></span>支付后可在订单管理中申请开票</p>
                            </div>
                        </div>
                        <div className="month" style={{ marginTop: '8px' }}>
                            <p>支付方式</p>
                            <div>
                                <img src={require('@/assets/img/alipay.png')} alt="" width="32" />
                                支付宝
                            </div>
                        </div>
                        <Divider dashed />
                        <div className="month" style={{ marginTop: '8px' }}>
                            <p>总计</p>
                            <div className="payname">{selectedDenomination.receiptAmount / 100}元</div>
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
                                <Button key='payquxiao' onClick={payquxiao}>取消</Button>,
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
