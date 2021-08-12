import { useState, useMemo, useEffect } from 'react';
import { Modal, Button, message, Form, Divider } from 'antd';

import { orderApi } from '@/api';

import styles from './index.less'

interface ModalPropsTpe {
    key?: string;
}
interface AplayInvoiceInfo {
    enterpriseUuid: string;
    userOrderUuid: string
}
interface ModalProps<T> {
    onCancel: (flag: boolean) => void;
    isModalVisible: boolean;
    modalDataProps?: T;
    onUpdata: (flag: boolean) => void;
    aplayInvoiceInfo: AplayInvoiceInfo
}

export default ({ modalDataProps,aplayInvoiceInfo, isModalVisible, onCancel, onUpdata }: ModalProps<ModalPropsTpe>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [initialValues, setInitialValues] = useState<any>({})
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setInitialValues(modalDataProps)
    }, [isModalVisible])
    // 关闭弹框
    const handleCancel = () => {
        onCancel(false);
    };
    // 修改发票信息
    const updateInvoice = () => {
        onUpdata(true)
    }
    // 确认并开票
    const handleOk = () => {
        setLoading(true)
        orderApi.applyInvoice(aplayInvoiceInfo).then(res => {
            if (res.code === 200) {
                message.success('发票申请成功')
                setLoading(false)
                onCancel(true);
            } else {
                setLoading(false)
            }
        })
    }
    const footerButtonList = () => {
        const footer = [
            <Button key="back" onClick={updateInvoice}>
                修改
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                确认并开票
            </Button>
        ]
        return footer
    }
    return (
        <>
            <Modal title="确认发票信息" visible={isVisible} footer={footerButtonList()} onCancel={handleCancel} className={styles.applyInvoice}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 17 }}
                    className="modelname"
                >
                    <Form.Item
                        label="发票类型"
                    >
                        <span>{initialValues.invoiceType === 'common' ? '增值税普通发票' : '增值税专用发票'}</span>
                    </Form.Item>
                    <Form.Item
                        label="发票抬头"
                        name="invoiceTitle"
                    >
                        <span>{initialValues.invoiceTitle}</span>
                    </Form.Item>
                    <Form.Item
                        label="纳税人识别号"
                        name="identifyNumber"
                    >
                        <span>{initialValues.identifyNumber}</span>
                    </Form.Item>
                    <Form.Item
                        label="开户银行名称"
                        name="bankName"
                    >
                        <span>{initialValues.bankName}</span>
                    </Form.Item>
                    <Form.Item
                        label="基础开户账号"
                        name="bankAccountNumber"
                    >
                        <span>{initialValues.bankAccountNumber}</span>
                    </Form.Item>
                    <Form.Item
                        label="注册场所地址"
                        name="registerAddress"
                    >
                        <span>{initialValues.registerAddress}</span>
                    </Form.Item>
                    <Form.Item
                        label="注册号码"
                        name="registerPhone"
                    >
                        <span>{initialValues.registerPhone}</span>
                    </Form.Item>
                    <Divider className="divider" orientation="left" dashed={true} >发票寄送信息</Divider>
                    {initialValues.invoiceType === 'common' && <Form.Item
                        label="邮箱"
                        name="receiveEmail"
                    >
                        <span>{initialValues.receiveEmail}</span>
                    </Form.Item>}
                    {initialValues.invoiceType === 'VAT' && <div>
                        <Form.Item
                            label="收件人"
                            name="contactName"
                        >
                            <span>{initialValues.contactName}</span>
                        </Form.Item>
                        <Form.Item
                            label="收件地址"
                            name="receiveAddress"
                        >
                            <span>{initialValues.receiveAddress}</span>
                        </Form.Item>
                        <Form.Item
                            label="联系电话"
                            name="contactPhone"
                        >
                            <span>{initialValues.contactPhone}</span>
                        </Form.Item>
                    </div>}
                </Form>
            </Modal>
        </>
    );
};