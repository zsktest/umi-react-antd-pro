import { useEffect, useState, useRef } from "react";
import { Form, Input, Button, message } from 'antd';
import { IdcardOutlined, UserOutlined, PhoneOutlined, LockOutlined, CarryOutOutlined, Space } from "@ant-design/icons";
import { useLocation, history } from "umi";

import { clientEnterpriseApi } from "@/api";

export default ()=>{
  const [inviteLinklist, setInviteLinklist] = useState();
  const [enterpriseIcon, setEnterpriseIcon] = useState();
  const [ currentAccount, setCurrentAccount] = useState('');
  const location:any = useLocation();
  //const history = useHistory();
  const [form] = Form.useForm();

  const [verifyCodeUuid, setVerifyCodeUuid] = useState();
  const [contentBut, setContentBut] = useState('发送验证码');
  const [totalTime, setTotalTime] = useState(60);
  const [phoneEnble, setPhoneEnble] = useState(false); 


  useEffect(()=>{
    const params = {
      inviteLinkCode: location.query.inviteKey
    }
    clientEnterpriseApi.queryApplyEnterpriseInfo(params).then(res=>{
      if(res.success) {
        setInviteLinklist(res.data);
        setEnterpriseIcon(res.data.enterpriseIcon||'https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/images/f7/05/ab1a364b117127f08fe0ba32cda7.jpg')
      }
    })
  },[])

  const getAccount = (e)=>{
    setCurrentAccount(e.target.value);
  }

  const onSubmit=()=>{
    const formData = form.getFieldsValue();
    if (!formData.name) {
      message.error('姓名不能为空！')
      return false
    }
    if (!formData.account) {
      message.error('登录账号不能为空！')
      return false
    }
    if (/[`~!@#$%^&*()_+<>?:"{/;'[\]]/.test(formData.account)) {
      message.error('不能使用特殊字符！')
      return false
    }
    if (!formData.password) {
      message.error('密码不能为空！')
      return false
    }
    if (!formData.phone) {
      message.error('手机号不能为空！')
      return false
    }
    if (!formData.verifyCode) {
      message.error('验证码不能为空！')
      return false
    }
    if (formData.verifyCode && (formData.verifyCode.length < 6)) {
      message.error('验证码须6位数')
      return false
    }
    clientEnterpriseApi.approvalApplyAccount({...formData, verifyCodeUuid, inviteLinkCode: location.query.inviteKey }).then(res=>{
      if(res.success) {
        history.push({
          pathname: '/client/invitation/success',
          query: {
            inviteKey: location.query.inviteKey,
            user: formData.account + '@' + inviteLinklist?.abbr,
            registerStatus: res.data.registerStatus
          },
        })
      }
    })
  }

  const sendVerifyCode = ()=>{
    const phone = form.getFieldValue("phone");
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
      message.error('请输入正确的手机号！')
      return false
    }
    setPhoneEnble(true);
    clientEnterpriseApi.applySendVerifyCode({phone}).then(res=>{
      if(res.success) {
        setTotalTime(60);
        setVerifyCodeUuid(res.data.verifyCodeUuid);
      }
    })
  }

  let timer:any = null;

  useEffect(()=>{
    if(verifyCodeUuid) {
      timer = setInterval(()=>{
        setContentBut(`${totalTime}s后重新发送`);
        let count = totalTime-1;
        setTotalTime(count);
        if(totalTime<0) {
          clearInterval(timer);
          setContentBut(`重新发送验证码`);
          setPhoneEnble(false);
        }
      }, 1000)
    } else {
      setContentBut('发送验证码');
    }
    return ()=> timer && clearInterval(timer);
  }, [verifyCodeUuid, totalTime])

  const downClient = ()=>{
    window.open('https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/client/ShadowBotSetup.exe');
    const params = {
      spm: 'w.a',
      tags: 'src:console'
    }
    clientEnterpriseApi.recordLog(params).then(res=>{})
  }

  return (
    <div className="enterprise-share">
      <div className="main">
        <img src={require("@/assets/img/bg_down.png")} alt="" className="bg_down"/>
        <div className="left">
          <div className="left_blans">
            <a href="https://www.winrobot360.com/" target="_blank"><img src="https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/home/img/logo_fort.png" alt="RPA"/></a>
          </div>
          <div className="title">影刀, 每一个人都能用的RPA</div>
          <div className="vides">
            <video loop muted autoPlay={true}>
              <source src={require("@/assets/img/new.mp4")} type="video/mp4"/>
            </video>
            <img src={require("@/assets/img/bg_circle_big.png")} alt="RPA" className="bg_circle_small"/>
            <img src={require("@/assets/img/bg_dot.png")} alt="RPA" className="bg_dot"/>
            <img src={require("@/assets/img/cute2.png")} alt="RPA" className="cute2"/>
            <img src={require("@/assets/img/cute1.png")} alt="RPA" className="cute1"/>
            <img src={require("@/assets/img/bg_others.png")} alt="RPA" className="bg_others"/>
          </div>
          <div className="footer1">
            <img src={require("@/assets/img/man.png")} alt="RPA" className="man"/>
            <div>
              <img src={require("@/assets/img/erweima.png")} alt="RPA" className="chare_erweima"/>
              <p>小助手微信</p>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="share_banner">
            <a href="TypeScript:;" onClick={downClient} className="downClient">免费下载</a>
            <img src={require("@/assets/img/bg_circle_big2.png")} alt="RPA" className="bg_circle_big2"/>
            <img src={require("@/assets/img/bg_circle_small.png")} alt="RPA" className="bg_circle_small"/>
          </div>
          <div className="share_body_right">
            <div className="enterprise_top">
              <img src={enterpriseIcon} alt=""/>
              <h1><span>{ inviteLinklist?.inviteUserName }</span>邀请你加入</h1>
              <div>{ inviteLinklist?.enterpriseName }</div>
            </div>
            <div className="enterprise_input">
              <Form
                name="basic"
                form={form}
              >
                <Form.Item
                  name="name"
                  style={{marginBottom: 20}}
                  //rules={[{ required: true, message: '请输入员工姓名' }]}
                >
                  <Input style={{height: 40}} prefix={<IdcardOutlined style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请输入姓名"/>
                </Form.Item>
                <Form.Item
                  name="account"
                  style={{marginBottom: 20}}
                >
                  <Input style={{height: 40}} onChange={getAccount} prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请输入登录账号"/>
                </Form.Item>
                <Form.Item
                  className="useraccount"
                  style={{marginBottom:5,marginTop:-20}}
                >
                  <div style={{height: 20,lineHeight: '8px'}}>{`${currentAccount}@${inviteLinklist?.abbr}`}</div>
                </Form.Item>
                <Form.Item
                  name="password"
                  style={{marginBottom: 20}}
                >
                  <Input style={{height: 40}} prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请设置密码"/>
                </Form.Item>
                <Form.Item
                  name="phone"
                  style={{marginBottom: 20}}
                >
                  <Input style={{height: 40}} prefix={<PhoneOutlined style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="用于找回密码"/>
                </Form.Item>
                <Form.Item
                  
                  style={{marginBottom: 20}}
                >
                  <Form.Item noStyle name="verifyCode">
                    <Input style={{height: 40, width: '60%'}} prefix={<CarryOutOutlined style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请输入短信验证码" />
                  </Form.Item>
                  <Button style={{height: 40, width: '38%',float:'right'}} disabled={phoneEnble} onClick={sendVerifyCode}>{contentBut}</Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" style={{width: '100%',height: 40}} onClick={onSubmit}>确认加入</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}