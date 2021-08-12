import { useState, useEffect } from 'react';
import { Modal, Alert, Form, Button, message, Input, Radio, Divider } from 'antd';
import { useModel } from 'umi';

import type { ModalProps } from '@/models';
import { orderApi } from '@/api';

import styles from './index.less'

interface ModalPropsTpe {
    invoiceType: string;
    key?: string;
}
export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalPropsTpe>) => {
    const [invoiceType, setInvoiceType] = useState('common')
    const [loadings, setLoadings] = useState(false)
    const [initialValues, setInitialValues] = useState<any>({})
    const [isVisible, setIsVisible] = useState(false)
    const { initialState } = useModel<any>('@@initialState');
    const [form] = Form.useForm();
    useEffect(() => {
        if (modalDataProps?.invoiceType) {
            setInvoiceType(modalDataProps?.invoiceType)
        }
        setInitialValues(modalDataProps)
        setIsVisible(isModalVisible)
    }, [isModalVisible])
    // 关闭弹框
    const handleCancel = () => {
        onCancel(false);
    };
    // 表单确认
    const onFinish = async () => {
        try {
            setLoadings(true)
            const values = await form.validateFields();
            const result: any = orderApi.updateInvoiceConfig(initialState.currentUser.enterpriseUuid,values);
            if(result.code){
                message.success('密码修改成功');
                setLoadings(false)
                onCancel(true)
            }
        } catch (errorInfo) {
            setLoadings(false)
            console.log('Failed:', errorInfo);
        }
    }
    // 发票类型选择
    const onChange = (e: any) => {
        setInvoiceType(e.target.value)
    }
    return (
        <>
            <Modal className={styles.perfectInvoice} title="完善发票信息" visible={isVisible} footer={null} onCancel={handleCancel}>
                <Alert message="请在申请发票前先完善发票信息" banner style={{ margin: '-24px -24px 24px -24px' }} />
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 17 }}
                    initialValues={{ ...initialValues }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="发票类型"
                        name="invoiceType"
                    >
                        <Radio.Group onChange={onChange}>
                            <Radio value='common'>增值税普通发票</Radio>
                            <Radio value='VAT'>增值税专用发票</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="发票抬头"
                        name="invoiceTitle"
                        rules={[{ required: true, message: '发票抬头不能为空' }]}
                    >
                        <Input placeholder="请输入发票抬头" />
                    </Form.Item>
                    <Form.Item
                        label="纳税人识别号"
                        name="identifyNumber"
                        rules={[{ required: true, message: '纳税人识别号不能为空' }]}
                    >
                        <Input placeholder="请输入纳税人识别号" />
                    </Form.Item>
                    <Form.Item
                        label="开户银行名称"
                        name="bankName"
                    >
                        <Input placeholder="请输入开户行名称" />
                    </Form.Item>
                    <Form.Item
                        label="基础开户账号"
                        name="bankAccountNumber"
                    >
                        <Input placeholder="请输入开户账号" />
                    </Form.Item>
                    <Form.Item
                        label="注册场所地址"
                        name="registerAddress"
                    >
                        <Input placeholder="请输入注册场地地址" />
                    </Form.Item>
                    <Form.Item
                        label="注册号码"
                        name="registerPhone"
                    >
                        <Input placeholder="请输入注册号码" />
                    </Form.Item>
                    <Divider className="divider" orientation="left" dashed={true} >发票寄送信息</Divider>
                    {invoiceType === 'common' && <Form.Item
                        label="邮箱"
                        name="receiveEmail"
                        rules={[{ required: true, message: '邮箱不能为空！' },
                        { type: 'email', message: '请输入正确的邮箱地址！' }]}
                    >
                        <Input placeholder="请输入邮箱地址" />
                    </Form.Item>}
                    {invoiceType === 'VAT' && <div>
                        <Form.Item
                            label="收件人"
                            name="contactName"
                            rules={[{ required: true, message: '发票抬头不能为空' }]}
                        >
                            <Input placeholder="请输入收件人" />
                        </Form.Item>
                        <Form.Item
                            label="收件地址"
                            name="receiveAddress"
                            rules={[{ required: true, message: '发票抬头不能为空' }]}
                        >
                            <Input placeholder="请输入收件地址" />
                        </Form.Item>
                        <Form.Item
                            label="联系电话"
                            name="contactPhone"
                            rules={[{ required: true, message: '请输入手机号' },
                            { message: '请输入正确的手机号码', pattern: /^1[3456789]\d{9}$/ }]}
                        >
                            <Input placeholder="请输入联系电话" />
                        </Form.Item>
                    </div>}
                </Form>
                <div className="btn">
                    <Button type="primary" loading={loadings} onClick={onFinish}>完成</Button>
                </div>
            </Modal>
        </>
    );
};