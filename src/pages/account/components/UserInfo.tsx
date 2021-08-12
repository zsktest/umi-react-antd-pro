import { useEffect, useState } from 'react';
import { useLocation } from 'umi';
import ProCard from "@ant-design/pro-card";

import { accountApi } from '@/api';
import { UserInfoType } from '../data.d';

import styles from '../index.less';

export default ()=>{
  const [userInfo, setUserInfo]=useState<UserInfoType>()
  const search:any = useLocation();

  useEffect(()=>{
    accountApi.userDta({userUuid: search?.query?.userUuid}).then(res=>{
      if(res.success) {
        setUserInfo({
          loginAccount: res.data.loginAccount,
          phone: res.data.phone,
          email: res.data.email,
          createTime: res.data.createTime,
          expiredTime: res.data.expiredTime,
          password: res.data.password
        })
      }
    })
  }, [])

  return (
    <ProCard title="用户信息" className={styles.userInfo}>
      <ProCard colSpan={12} className="box-column">
        <p><span>登录账号：</span><span>{userInfo?.loginAccount}</span></p>
        <p><span>创建时间：</span><span>{userInfo?.createTime}</span></p>
        <p><span>到期时间：</span><span>{userInfo?.expiredTime}</span></p>
      </ProCard>
      <ProCard colSpan={12} className="box-column">
      <p><span>手机号：</span><span>{userInfo?.phone}</span></p>
      <p v-if="detailTop.email"><span>邮箱：</span><span>{userInfo?.email}</span></p>
      <p><span>初始密码：</span><span>{userInfo?.password}</span></p>
      </ProCard>
    </ProCard>
  )
}