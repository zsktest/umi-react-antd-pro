import { useState, useMemo } from 'react';
import { Modal, Button, Result } from 'antd';

import type { ModalProps } from '@/models';
import { settingApi } from '@/api';

interface ModalPropsTpe {
    enterpriseUuid: string;
    userOrderUuid: string;
}
export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalPropsTpe>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [userpayname, setUserpayname] = useState(true);
    const [paySuccess, setPaySuccess] = useState(false);
    const [payError, setPayError] = useState(false);

    // 关闭弹框
    const handleCancel = () => {
        onCancel(true);
    };
    // 支付完成确定
    const paycomplete = () => {
        const data = {
            userOrderUuid: modalDataProps?.userOrderUuid,
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
            enterpriseUuid: modalDataProps?.enterpriseUuid,
            userOrderUuid: modalDataProps?.userOrderUuid,
        };
        settingApi.tradePay(data).then((res) => {
            if (res.code === 200) {
                setPayError(false);
                setUserpayname(true);
                window.open(res.data.payUrl, '_blank');
            } 
        });
    }
    return (
        <>
            <Modal title="支付订单" visible={isVisible} footer={null} onCancel={handleCancel}>
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