import React, { useState, useMemo } from 'react';
import { Form, Select, Modal, message } from 'antd';

import { applicationApi } from '@/api';
import type { ModalProps } from '@/models';

const { Option } = Select;
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 18 },
};

interface ItemOwn {
    account: string;
    accountType: string;
    accountTypeName: string;
    uuid: string;
    userUuid: string;
    key?: any
}
interface ModalDataProps {
    robotUuid: string;
    enterpriseUuid: string;
}
export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalDataProps>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([])

    const [form_confirm] = Form.useForm();

    // 所有者自动补全获取数据
    const onSearch = (val: string) => {
        const data = {
            enterpriseUuid: modalDataProps?.enterpriseUuid,
            key: val
        }
        applicationApi.userList(data).then(res => {
            setOptions(res.data)
        })
    }
    const handleCancel = () => {
        onCancel(false)
    }
    const handleOk = async () => {
        const values = await form_confirm.validateFields();
        if (!values.receiveUserUuid) {
            message.warn('请选择要接受应用的用户')
            return
        }
        setLoading(true)
        const data = {
            enterpriseUuid: modalDataProps?.enterpriseUuid,
            robotUuid: modalDataProps?.robotUuid,
            receiveUserUuid: values.receiveUserUuid
        }
        applicationApi.translateSpecifyRobotOwner(data).then(res => {
            if (res.code === 200) {
                setLoading(false)
                message.success('转移应用owner完成')
                onCancel(true)
            } else {
                setLoading(false)
            }
        })
    }
    return (
        <Modal title="请指定接受员工" visible={isVisible} onOk={handleOk} confirmLoading={loading} onCancel={handleCancel}>
            <Form name="validate_other" {...formItemLayout} form={form_confirm}>
                <Form.Item label="请选择要接受应用的用户" name="receiveUserUuid">
                    <Select
                        showSearch
                        placeholder='员工的中文名称或昵称'
                        defaultActiveFirstOption={false}
                        showArrow
                        filterOption={false}
                        onSearch={onSearch}
                        notFoundContent={null}
                        allowClear
                    >
                        {options.length && options.map((item: ItemOwn) => (
                            <Option key={item.userUuid} value={item.userUuid}>账号：{item.account}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}
