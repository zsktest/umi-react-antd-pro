import { useEffect, useState, useRef } from "react";
import { Result } from 'antd';
import { useLocation } from "umi";

import { clientEnterpriseApi } from "@/api";

export default ()=>{
  const [inviteLinklist, setInviteLinklist] = useState<string>();
  const [user, setUser] = useState();
  const [sub, setSub] = useState<string>();
  const location:any = useLocation();



  useEffect(()=>{
    const params = {
      inviteLinkCode: location.query.inviteKey
    }
    setUser(location.query.user);
    clientEnterpriseApi.queryApplyEnterpriseInfo(params).then(res=>{
      if(res.success) {
        if (location.query.registerStatus === 'r') {
          setInviteLinklist('注册成功');
          setSub('快去下载客户端，体验影刀自动化办公吧！')
        } else {
          setInviteLinklist('申请成功');
          setSub('待管理员审批通过');
        }
      }
    })
  },[])
  const downClient = ()=>{
    window.open('https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/client/ShadowBotSetup.exe')
    const params = {
      spm: 'w.a',
      tags: 'src:console'
    }
    clientEnterpriseApi.recordLog(params).then(res=>{})
  }

  return (
    <div className="enterprise-success">
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
            <a onClick={downClient} href="TypeScript:;" className="downClient">免费下载</a>
            <img src={require("@/assets/img/bg_circle_big2.png")} alt="RPA" className="bg_circle_big2"/>
            <img src={require("@/assets/img/bg_circle_small.png")} alt="RPA" className="bg_circle_small"/>
          </div>
          <div className="share_body_right">
            <Result status="success" title={inviteLinklist} subTitle={sub} ></Result>
            <div className="enterprise_process">
              <h1>使用提示:</h1>
              <ul>
                <li>
                  <div className="enterprise_process1"><span>1</span></div>
                  <div className="enterprise_process2"></div>
                  <div className="enterprise_process3">下载并安装<a onClick={downClient}>影刀客户端</a></div>
                  <div className="enterprise_process4">安装影刀PC客户端<br />下载地址<a>www.winrobot360.com</a></div>
                </li>
                <li>
                  <div className="enterprise_process1"><span>2</span></div>
                  <div className="enterprise_process5">使用账号<span>【{ user }】</span>登录影刀企业版</div>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}