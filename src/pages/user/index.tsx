import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, history, useModel } from 'umi';
import { userApi } from '@/api/user';

import styles from './index.less';

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [grant_type] = useState<string>('password');
  const [scope] = useState<string>('all');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await userApi.getInfo();
    if (userInfo.code === 200) {
      const userInfoName = userInfo.data;
      setInitialState({
        ...initialState,
        currentUser: userInfoName,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      userApi.recordLog({ spm: 'o.a' });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const log = async () => {
    userApi.recordLog({ spm: 'o.a.1' });
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      // 登录
      const msg = await userApi.login({ ...values, grant_type, scope });
      if (msg.code === '200') {
        await log();
        localStorage.setItem('ACCESS_TOKEN', msg.access_token);
        await fetchUserInfo();
        message.success('登录成功！');
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/home');
        return;
      }
      // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {}
    setSubmitting(false);
  };
  // const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <img src={require('@/assets/logo1.png')} alt="" />
      <div className={styles.content}>
        <div className={styles.main}>
          <h2>控制台登录</h2>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '确认',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams);
            }}
          >
            {/* {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={'账户或密码错误（admin/ant.design)'}
              />
            )} */}
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'账号'}
              rules={[
                {
                  required: true,
                  message: <span>请输入账号!</span>,
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: <span>请输入密码！</span>,
                },
              ]}
            />
            <div
              style={{
                marginBottom: 24,
                lineHeight: '40px',
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                {/* <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" /> */}
                <div>自动登录</div>
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码?
              </a>
            </div>
          </ProForm>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.copyright}>@版权所有 杭州分叉智能科技有限公司 浙ICP备：1947732</div>
      </div>
    </div>
  );
}
