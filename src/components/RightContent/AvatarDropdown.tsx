import React from 'react';
import { Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';

import HeaderDropdown from '../HeaderDropdown';
import { userApi } from '@/api/user';
import styles from './index.less';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await userApi.logout().then((res) => {
    if (res.code === 200) {
      localStorage.removeItem('ACCESS_TOKEN');
      const { query = {}, pathname } = history.location;
      const { redirect } = query;
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/login' && !redirect) {
        setTimeout(() => {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: pathname,
            }),
          });
          window.location.reload();
        }, 16);
      }
    }
  });
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  // const onMenuClick = useCallback(
  const onMenuClick = async (event: any) => {
    // (event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      setInitialState((s) => ({ ...s, currentUser: undefined }));
      loginOut();
      return;
    }
    history.push(`/account/${key}`);
    // },
  };
  // [],
  // );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout" style={{ width: '50px' }}>
        {/* <LogoutOutlined /> */}
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <span className={styles.nickname}>a</span>
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
