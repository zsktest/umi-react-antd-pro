import { useState, useMemo, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

import type { ModalProps, SettingFormItemType } from '@/models';
import { settingApi } from '@/api';
interface Values {
  email?: string;
  contacts?: string
}
interface Public {
  title: string;
  type: string;
  isfooter: boolean;
}
interface Rules {
  message: string;
  required? : boolean;
  whitespace? : boolean;
}
interface ListArray {
  type: string;
  placeholder: string;
  rules: Rules[],
  code: string,
  dependencies?: string[],
  label?: string
}
interface ModalDataProps {
  public: Public
  list: ListArray[]
}
export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<ModalDataProps>) => {
  const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
  const [modelTitle, setModelTitle] = useState<string>();
  const [isFooter, setIsFooter] = useState<boolean|undefined>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      setModelTitle(modalDataProps?.public.title);
      setIsFooter(modalDataProps?.public.isfooter);
    }
  }, [isModalVisible]);

  const onFinish = async (values: Values) => {
    let data = {};
    if (modalDataProps?.public.type === 'email') {
      // 编辑邮箱参数
      data = {
        contactEmail: values.email,
      };
    }
    if (modalDataProps?.public.type === 'contacts') {
      // 编辑联系人参数
      data = {
        contactMan: values.contacts,
      };
    }
    settingApi.enterpriseUpdate(data).then((res) => {
      if (res.code === 200) {
        if (modalDataProps?.public.type === 'email') {
          message.success('邮箱修改成功！');
        }
        if (modalDataProps?.public.type === 'contacts') {
          message.success('联系人修改成功！');
        }
        onCancel(true);
      } 
    });
  };
  // 关闭弹框
  const handleCancel = () => {
    onCancel(false);
  };
  const handelOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        password: values.pass,
      };
      if (modalDataProps?.public.type === 'password') {
        settingApi.changePwd(data).then((res) => {
          if (res.code === 200) {
            message.success('密码修改成功');
            onCancel(true);
          }
        });
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  // 表单组件
  const components = {
    input: ({ placeholder }: { placeholder: string }) => (
      <Input style={{ width: '70%' }} placeholder={placeholder} />
    ),
    btn: ({ placeholder }: { placeholder: string }) => (
      <Button type="primary" htmlType="submit">
        {placeholder}
      </Button>
    ),
    password: ({ placeholder }: { placeholder: string }) => (
      <Input.Password style={{ width: '70%' }} placeholder={placeholder} />
    ),
  };
  return (
    <>
      {!isFooter && (
        <Modal title={modelTitle} visible={isVisible} footer={null} onCancel={handleCancel}>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onFinish}
          >
            {modalDataProps?.list &&
              modalDataProps.list.length > 0 &&
              modalDataProps.list.map((n: SettingFormItemType) => {
                const { type } = n;
                const C = components[type];
                return (
                  <Form.Item
                    key={n.code ? n.code : n.type}
                    name={n.code}
                    rules={n.rules ? n.rules : []}
                  >
                    {C(n)}
                  </Form.Item>
                );
              })}
          </Form>
        </Modal>
      )}
      {isFooter && (
        <Modal title={modelTitle} visible={isVisible} onCancel={handleCancel} onOk={handelOk}>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
            onFinish={onFinish}
          >
            {modalDataProps?.list &&
              modalDataProps.list.length > 0 &&
              modalDataProps.list.map((n: SettingFormItemType) => {
                const { type } = n;
                const C = components[type];
                return (
                  <Form.Item
                    key={n.code ? n.code : n.type}
                    label={n.label}
                    name={n.code}
                    rules={n.rules ? n.rules : []}
                  >
                    {C(n)}
                  </Form.Item>
                );
              })}
          </Form>
        </Modal>
      )}
    </>
  );
};
