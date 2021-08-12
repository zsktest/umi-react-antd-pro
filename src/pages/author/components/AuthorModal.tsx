import { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { useModel } from 'umi';

import type { ModalProps } from '@/models';
import { authorApi } from '@/api';
import { Item } from './../data'



interface ModalDataProps {
    list: Array<Item>;
}
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;

export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalDataProps>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [loadings, setLoadings] = useState(false)
    const [licenseType, setLicenseType] = useState('')
    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');

    const [form] = Form.useForm();

    // 关闭弹框
    const handleCancel = () => {
        onCancel(false);
    };
    // 弹框确定
    const handleOK = async () => {
        try {
            setLoadings(true)
            const values = await form.validateFields();
            console.log(values)
            
            authorApi.createLicense(enterpriseUuid.current, values).then(res => {
                setLoadings(false)
                if (res.code === 200) {
                    message.success('临时激活码创建成功')
                    onCancel(true);
                } 
            })
        } catch (errorInfo) {
            setLoadings(false)
            console.log('Failed:', errorInfo);
        }
    }
    useEffect(() => {
        if (isModalVisible) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;

        }
    }, [isModalVisible]);
    // 激活码类型选择
    const changeCode = (e: string) => {
        setLicenseType(e)
    }
    return (
        <>
            <Modal title="创建激活码" visible={isVisible} onCancel={handleCancel} onOk={handleOK} confirmLoading={loadings}>
                <Form
                    name="validate_other"
                    form={form}
                    {...formItemLayout}
                    initialValues={{ expireDays: '14' }}
                >
                    <Form.Item
                        name="clientName"
                        label="客户端名称"
                        rules={[
                            { required: true, message: '客户端名称不能为空' }
                        ]}
                    >
                        <Input placeholder="客户端名称" />
                    </Form.Item>
                    <Form.Item
                        name="hwid"
                        label="机器码"
                        rules={[{ required: true, message: '机器码不能为空' },
                        { pattern: /^[A-F\d]{56}$/, message: '请输入正确的56位机器码' }]}
                    >
                        <Input placeholder="机器码" />
                    </Form.Item>
                    <Form.Item
                        name="kind"
                        label="客户端类型"
                        rules={[{ required: true, message: '请选择激活码类型' }]}
                    >
                        <Select placeholder="请选择类型">
                            <Option value="11">robot</Option>
                            <Option value="10">studio</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="licenseType"
                        label="激活码类型"
                        rules={[{ required: true, message: '请选择客户端类型' }]}
                    >
                        <Select placeholder="请选择激活码类型" onChange={changeCode}>
                            <Option value="temp">临时激活码</Option>
                            <Option value="formal">正式激活码</Option>
                        </Select>
                    </Form.Item>
                    {licenseType === 'temp' && <Form.Item
                        name="expireDays"
                        label="有效时间"
                    >
                        <Select placeholder="请选择有效时间">
                            <Option value="14">14天</Option>
                            <Option value="45">45天</Option>
                        </Select>
                    </Form.Item>}
                    <Form.Item
                        name="companyThirdUuid"
                        label="企业名称"
                    >
                        <Select placeholder="请选择企业">
                            {modalDataProps?.list && modalDataProps.list.length && modalDataProps.list.map((item: Item) => (
                                <Option key={item.uuid} value={item.uuid}>{item.thirdName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
