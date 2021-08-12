import { useState, useMemo, useRef } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

import type { ModalProps, YDResponse } from '@/models';
import { settingApi } from '@/api';
interface Values {
  iphone: string,
  code: string
}
interface Grade {
  grade: string
}
export default ({ modalDataProps, isModalVisible, onCancel }: ModalProps<Grade>) => {
  const isVisible = useMemo(() => isModalVisible, [isModalVisible]);
  const [content, setContent] = useState('发送验证码');
  const [verifyCodeUuid, setVerifyCodeUuid] = useState('');
  const [totalTime, setTotalTime] = useState(60);
  const totalTimeRef = useRef(totalTime);
  const clock: any = useRef();
  const [form] = Form.useForm();
  // let clock:any;
  const onFinish = async (values: Values) => {
    let result: any;
    // 为企业版修改电话
    if (modalDataProps?.grade !== 'personal' && modalDataProps?.grade !== 'free') {
      const data = {
        contactPhone: values.iphone,
        verifyCode: values.code,
        verifyCodeUuid,
      };
      result = await settingApi.enterpriseUpdate(data);
    } else {
      // 创业板和社区版修改电话
      const data = {
        phone: values.iphone,
        verifyCode: values.code,
        verifyCodeUuid: verifyCodeUuid
      }
      result = await settingApi.changeUserInfo(data);
    }

    if (result.code === 200) {
      clock.current && window.clearInterval(clock.current);
      message.success('联系电话修改成功！');
      onCancel(true);
    }
  };
  // 关闭弹框
  const handleCancel = () => {
    clock.current && window.clearInterval(clock);
    onCancel(false);
  };
  // 60秒倒计时
  const code = (phone: string) => {
    let url = ''
    if (modalDataProps?.grade !== 'personal' && modalDataProps?.grade !== 'free') {
      url = 'sendVerifyCode'
    } else {
      url = 'userSendVerifyCode'
    }
    settingApi[url]({ phone }).then((res: YDResponse<any>) => {
      if (res.code === 200) {
        setVerifyCodeUuid(res.data);
        clock.current = window.setInterval(() => {
          setContent(`${totalTimeRef.current}s后重新发送`);
          totalTimeRef.current--;
          setTotalTime(totalTimeRef.current);
          if (totalTimeRef.current < 0) {
            setTotalTime(60);
            totalTimeRef.current = 60;
            setContent('重新发送验证码');
            window.clearInterval(clock.current);
          }
        }, 1000);
      }
    });
  };
  const code_iphone = async () => {
    try {
      const values = await form.validateFields(['iphone']);
      code(values.iphone);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <>
      <Modal title="修改联系电话" visible={isVisible} footer={null} onCancel={handleCancel}>
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="iphone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入新手机号" style={{ width: '70%' }} />
          </Form.Item>
          <Form.Item>
            <Form.Item name="code" noStyle rules={[{ required: true, message: '请输入6位验证码' }]}>
              <Input placeholder="6位短信验证码" style={{ width: '35%', marginRight: '10px' }} />
            </Form.Item>
            <Button style={{ width: '32%' }} disabled={totalTime < 60} onClick={code_iphone}>
              {content}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
