import { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Form, Radio, DatePicker, Button, Input, message, Typography, Result } from 'antd';
import { MinusOutlined, PlusOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';

import type { ModalProps } from '@/models';
import { licenceApi } from '@/api';

import styles from './LicenceModal.less';

const { Paragraph } = Typography;
const { TextArea } = Input;

interface Licensetowname {
    enterpriseName: string;
    licenseExpiredDate?: string;
    licenseExpiredTime?: string;
    licenseQuota: number;
    licenseSourceName: string;
}
interface ModalDataProps {
    type: string;
    uuid?: any;
}
const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalDataProps>) => {
    const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
    const [modelTitle, setModelTitle] = useState<string>()
    const [number, setNumber] = useState(1)
    const [licensetowname, setLicensetowname] = useState<Licensetowname>({ enterpriseName: '', licenseExpiredDate: '', licenseQuota: 1, licenseSourceName: '' })
    const [licenType, setLicenType] = useState<string>()
    const [licensereename, setLicensereename] = useState({ grantRequest: '' })
    const [formData, setFormData] = useState({})
    const [licenssCop, setLicenssCop] = useState(false)
    const [imports, setImports] = useState<string>()
    const [licenssuccname, setLicenssuccname] = useState<Licensetowname>({ enterpriseName: '', licenseExpiredTime: '', licenseQuota: 1, licenseSourceName: '' })

    const { initialState } = useModel<any>('@@initialState');
    const enterpriseUuid = useRef('');
    const getNumber = useRef(1);
    const [form] = Form.useForm();

    // 关闭弹框
    const handleCancel = () => {
        onCancel(false);
    };
    // 获取许可证详情
    const grantDetail = (userLicenseGrantUuid: string) => {
        const data = {
            enterpriseUuid: enterpriseUuid.current,
            userLicenseGrantUuid
        }
        licenceApi.grantDetail(data).then(res => {
            if (res.code === 200) {
                setModelTitle('创建许可证订单');
                setLicensereename(res.data)
                setImports(res.data.grantCipher)
            }
        })
    }
    useEffect(() => {
        if (isModalVisible) {
            enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
            switch (modalDataProps?.type) {
                case 'pulicence':
                    setModelTitle('激活许可证订单');
                    setLicenType(`${modalDataProps?.type}_complete`)
                    break;
                case 'paylicence':
                    setModelTitle('创建许可证订单');
                    setLicenType(`${modalDataProps?.type}_first`)
                    break;
                case 'Readsee':
                    setLicenssCop(true)
                    grantDetail(modalDataProps?.uuid)
                    setLicenType(`${modalDataProps?.type}_complete`)
                    break;
                case 'Read':
                    grantDetail(modalDataProps?.uuid)
                    setLicenType(`${modalDataProps?.type}_complete`)
                    break;

            }
        }
    }, [isModalVisible]);
    //数量框失去焦点
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
    }
    //数量输入
    const changeNumber = (e: any) => {
        getNumber.current = e.target.value;
        setNumber(e.target.value);
    }
    // 增建数量按钮
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
    }
    // 下一步数据提交
    const nextTick = async () => {
        try {
            const values = await form.validateFields();
            let data = {
                licenseExpiredDate: values.licenseExpiredDate.format('YYYY-MM-DD'),
                licenseQuota: number,
                licenseSource: values.licenseSource
            }
            setFormData(data)
            licenceApi.grantEvaluate(enterpriseUuid.current, data).then(res => {
                if (res.code === 200) {
                    setLicensetowname(res.data)
                    setLicenType(`${modalDataProps?.type}_second`)
                }
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }
    const disabledDate = (current: any) => {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
    }
    // 上一步
    const previousStep = () => {
        setLicenType(`${modalDataProps?.type}_first`)

    }
    // 提交
    const submit = () => {
        setModelTitle('激活许可证订单');
        licenceApi.grantCreate(enterpriseUuid.current, formData).then(res => {
            if (res.code === 200) {
                setLicensereename(res.data)
                setLicenType(`${modalDataProps?.type}_complete`)
                setImports('')
            }
        })

    }
    // 复制许可证
    const doCopy = () => {
        message.success('订单信息已复制到剪切板')
    }
    // 复制激活码
    const doCopyname = () => {
        message.success('订单激活码复制到剪切板')
    }
    // 激活操作
    const Clicensefou = () => {
        const data = {
            enterpriseUuid: enterpriseUuid.current,
            grantCipher: imports
        }
        licenceApi.grantImport(data).then(res => {
            if (res.code === 200) {
                setLicenssuccname(res.data)
                setLicenType('success')
            } else {
                message.warning(res.msg)
            }
        })
    }
    // 激活码onChange事件
    const changeCode = (e: any) => {
        setImports(e.target.value)
    }
    // 完成验证确定按钮
    const Clicensecel = () => [
        onCancel(true)
    ]
    return (
        <>
            <Modal title={modelTitle} visible={isVisible} footer={null} onCancel={handleCancel}>
                {licenType === 'paylicence_first' && <div className={styles.licenceModal}>
                    <Form
                        name="validate_other"
                        form={form}
                        {...formItemLayout}
                        initialValues={{ licenseSource: 'base' }}
                    >
                        <Form.Item
                            name="licenseSource"
                            label="账号类型："
                        >
                            <Radio.Group>
                                <Radio value="base">套餐</Radio>
                                <Radio value="extra">临时</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="licenseExpiredDate"
                            label="到期时间："
                            rules={[{ required: true, message: '请选择日期' }]}
                        >
                            <DatePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
                        </Form.Item>
                        <Form.Item label="许可证数量：">
                            <div className="operation">
                                <Button onClick={() => denumber(number, 'cut')}>
                                    <MinusOutlined />
                                </Button>
                                <Input value={number} onBlur={insnumber} onChange={changeNumber} />
                                <Button onClick={() => denumber(number, 'add')}>
                                    <PlusOutlined />
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>}
                {licenType === 'paylicence_second' && <div className={styles.information}>
                    <p>确认订单信息</p>
                    <div className="informationcoms">
                        <div>
                            <span>账号类型</span>
                            {licensetowname.licenseQuota === 1 ? <p>套餐</p> : <p>临时</p>}
                        </div>
                        <div>
                            <span>采购企业</span>
                            <p>{licensetowname.enterpriseName}</p>
                        </div>
                        <div>
                            <span>许可证数量</span>
                            <p>{licensetowname.licenseQuota}</p>
                        </div>
                        <div>
                            <span>到期时间</span>
                            <p>{licensetowname.licenseExpiredDate}</p>
                        </div>
                    </div>
                </div>}
                {(licenType === 'paylicence_complete' || licenType === 'pulicence_complete' || licenType === 'Read_complete' || licenType === 'Readsee_complete') && <div className={styles.information_code}>
                    {licenType !== 'pulicence_complete' && <div className="return_license">
                        <div className="return_licensetop">订单信息</div>
                        <div className="return_licensetestarea">
                            <TextArea placeholder="许可证" disabled rows={5} autoSize={{ minRows: 5, maxRows: 5 }} value={licensereename.grantRequest} />
                            <Paragraph copyable={{ text: licensereename.grantRequest, onCopy: doCopyname, icon: [<div><CopyOutlined />复制</div>, <div><CopyOutlined />复制</div>], tooltips: false }}></Paragraph>
                        </div>
                        <p>如需获订单激活码，请将订单信息提交给影刀</p>
                    </div>}
                    <div className="return_license" >
                        <div className="return_licensetop">订单激活码</div>
                        <div className={licenssCop ? 'return_licensetestarea' : ''}>
                            <TextArea
                                placeholder="订单激活码"
                                disabled={licenssCop}
                                value={imports}
                                rows={5}
                                onChange={changeCode}
                                autoSize={{ minRows: 5, maxRows: 5 }}
                                style={{ wordBreak: 'break-all' }} />
                            {licenssCop && <Paragraph copyable={{ text: licensereename.grantRequest, onCopy: doCopy, icon: [<div><CopyOutlined />复制</div>, <div><CopyOutlined />复制</div>], tooltips: false }}></Paragraph>}
                        </div>
                    </div>
                </div>}
                {licenType === 'success' && <div className={styles.success}>
                    <Result
                        status="success"
                        title="激活成功"
                        subTitle="您已成功激活以下产品"
                        extra={[
                            <div className="informationcoms" key="desc">
                                <div>
                                    <span>账号类型</span>
                                    {licenssuccname.licenseQuota === 1 ? <p>套餐</p> : <p>临时</p>}
                                </div>
                                <div>
                                    <span>采购企业</span>
                                    <p>{licenssuccname.enterpriseName}</p>
                                </div>
                                <div>
                                    <span>许可证数量</span>
                                    <p>{licenssuccname.licenseQuota}</p>
                                </div>
                                <div>
                                    <span>到期时间</span>
                                    <p>{licenssuccname.licenseExpiredTime}</p>
                                </div>
                            </div>,
                            <Button type="primary" key="console" onClick={Clicensecel} style={{ marginTop: '32px' }}>
                                完成
                            </Button>
                        ]}
                    />
                </div>}
                <div className={styles.primary}>
                    {licenType === 'paylicence_first' && <Button type="primary" onClick={nextTick}>下一步</Button>}
                    {licenType === 'paylicence_second' && <div><Button type="primary" onClick={submit}>提交</Button><Button style={{ marginLeft: '8px' }} onClick={previousStep}>上一步</Button></div>}
                    {(licenType === 'paylicence_complete' || licenType === 'pulicence_complete' || licenType === 'Read_complete' || licenType === 'Readsee_complete') && <Button type="primary" onClick={Clicensefou}>激活</Button>}
                </div>
            </Modal>
        </>
    );
};
