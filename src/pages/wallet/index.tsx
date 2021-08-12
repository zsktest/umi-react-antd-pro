import { useState, useEffect, useRef } from 'react';
import { Dropdown, message, Button, Menu, Collapse, Tooltip } from 'antd';
import { EllipsisOutlined, CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';

import { walletApi } from '@/api';
import PayModal from './components/PayModal'

import styles from './index.less';

const { Panel } = Collapse;
interface Item{
  interfaceCode: string;
  interfaceCostPrice: number;
  interfaceMarketPrice: number;
  interfaceName: string;
  interfacePrice: number;
  maxFreeNum: number;
}

export default function IndexPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [walletQueryname, setWalletQueryname] = useState({ balanceQuota: '', currentMonthConsume: '' });
  const [groupCodeList, setGroupCodeList] = useState({ interfaceGroupDetailBOs: [], avgPrice: '', interfaceGroupDesc: '', interfaceGroupName: '' })
  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  // 钱包详情
  const getwalletQuery = () => {
    walletApi.walletQuery().then(res => {
      if (res.code === 200) {
        setWalletQueryname(res.data)
      } else {
        message.warning(res.msg)
      }
    })
  }
  // 可用收费服务
  const getqueryByInterfaceGroupCode = () => {
    const data = {
      interfaceGroupCode: 'imageRecognition'
    }
    walletApi.queryByInterfaceGroupCode(data).then(res => {
      if (res.code === 200) {
        setGroupCodeList(res.data)
      } else {
        message.warning(res.msg)
      }
    })
  }
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getwalletQuery()
      getqueryByInterfaceGroupCode()

    }
  }, [initialState]);
  //提现
  const showModal = () => {
    message.warning('请联系影刀客服提现')
  }
  // 充值
  const payshow = () => {
    setIsModalVisible(true)
  }
  //关闭支付弹框
  const cancelModel = () => {
    setIsModalVisible(false)
  }
  // 订单
  const pushlist = () => {
    history.push('/order')
  }
  // 详情
  const horepush = () => {
    history.push('/wallet/detail')
  }
  // 面板头内容
  const headerContent = () => {
    return (
      <div className="extended_hader">
        <div className="left">
          <img src={require('../../assets/img/icon_tujian.png')} alt="" />
          <div className="const">
            <p>{groupCodeList.interfaceGroupName}</p>
            <span>{groupCodeList.interfaceGroupDesc}</span>
          </div>
        </div>
        <div className="right">
          <p><span>均价：</span>￥{groupCodeList.avgPrice}元/次</p>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.wallet}>
      <div className="account_title">
        <h1>扩展服务</h1>
        <span className="account_user"></span>
      </div>
      <div className="walletList">
        <div className="title">
          <img src={require('@/assets/img/icon_wallet.png')} alt="" />
          账户余额
        </div>
        <div className="walletcons">
          <div className="walletcons1">
            <div className="left">
              <span>余额</span>
              {walletQueryname.balanceQuota ? <p>￥{walletQueryname.balanceQuota}</p> : <p>￥0.00</p>}
            </div>
            <div className="right">
              <Dropdown overlay={() => (
                <Menu>
                  <Menu.Item>
                    <a href="javascript:;" onClick={showModal}>提现</a>
                  </Menu.Item>
                </Menu>
              )}>
                <EllipsisOutlined />
              </Dropdown>
              <div>
                <Button type="primary" onClick={payshow}>充值</Button>
                <Button onClick={pushlist}>订单</Button>
              </div>
            </div>
          </div>
          <div className="walletcons2">
            <div className="left">
              <span>本月消耗</span>
              {walletQueryname.currentMonthConsume ? <p>￥{walletQueryname.currentMonthConsume}</p> : <p>￥0.00</p>}
            </div>
            <div className="right">
              <div>
                <Button onClick={horepush}>详情</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="title" style={{ marginTop: '40px' }}>
          <img src={require('@/assets/img/icon_service.png')} alt="" />
          可用扩展服务
        </div>
        <div className="constList">
          <Collapse
            expandIconPosition='right'
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : -90} />}
            bordered={false}
            ghost={true}
          >
            <Panel header={headerContent()} key="1">
              <div className="extended_content">
                <div className="constrTop">
                  <p>验证码类型</p>
                  <p>价格(元/次)</p>
                  <p className="max">最大免费次数
                    <Tooltip placement="topRight" title='多类型共享免费次数，一个类型用到最大免费次数，即用完所有免费次数。'>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </p>
                </div>
                <div className="constrBottom">
                  {groupCodeList.interfaceGroupDetailBOs.length && groupCodeList.interfaceGroupDetailBOs.map((item: Item) => (
                    <div key={item.interfaceCode}>
                      <p>{ item.interfaceName }</p>
                      <p>¥{ item.interfaceCostPrice }<em>¥{ item.interfaceMarketPrice }</em></p>
                      <p className="max">{ item.maxFreeNum }</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
      {isModalVisible && <PayModal isModalVisible={isModalVisible} onCancel={cancelModel}/>}
    </div>
  );
}
