import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import { useModel } from 'umi';
import { UnorderedListOutlined } from '@ant-design/icons';

import { orderApi, settingApi } from '@/api';
import { Page } from '@/models'
import PayModal from './components/PayModal';
import ApplyInvoiceModal from './components/ApplyInvoiceModal';
import PerfectInvoice from './components/PerfectInvoice';

import styles from './index.less';
interface Record {
  businessRemark: string;
  createTime: string;
  duration: number;
  offerSpecCount: number;
  offerSpecName: string;
  offerSpecUuid: string;
  orderNo: string;
  orderStatus: string;
  orderStatusName: string;
  prodSpecName: string;
  prodSpecUuid: string;
  receiptAmount: number;
  receiptAmountValue: string;
  timeUnit: string;
  totalAmount: number;
  totalAmountValue: string;
  updateTime: string;
  userOrderUuid: string;
  userTradeUuid: string;
  userUuid: string;
  uuid: string;
  invoiceStatus: string;
}

export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger: false });
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalInfo, setModalInfo] = useState<any>({ list: [] })
  const [payModalVisible, setPayModalVisible] = useState(false)
  const [payModalInfo, setPayModalInfo] = useState({enterpriseUuid:'',userOrderUuid:''})
  const [isAllowApplayInvoice, setIsAllowApplayInvoice] = useState(false)
  const [applayInvoiceVisible,setApplayInvoiceVisible] = useState(false)


  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  // 获取列表
  const getTableList = (data: Page) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
    };
    orderApi.orderList(param).then((res) => {
      if (res.code === 200) {
        const pagination_r = { ...pagination };
        pagination_r.total = res.page.total;
        pagination_r.current = res.page.page;
        setLoading(false);
        setDataSource(res.data);
        setPagination(pagination_r);
      } else {
        setLoading(false);
        setDataSource([]);
      }
    });
  };
  // 获取发票信息
  const getInvoiceInfo = () => {
    orderApi.queryInvoiceConfig({enterpriseUuid: enterpriseUuid.current}).then(res => {
      if (res.code === 200) {
        let form = {}
        if (res.data === undefined || res.data === null || res.data === '') {
          setIsAllowApplayInvoice(false)
          form = {
            invoiceType: ''
          }
        } else {
          setIsAllowApplayInvoice(true)
          form = {
            invoiceType: res.data.invoiceType, // 发票类型
            invoiceTitle: res.data.invoiceTitle, // 发票抬头
            identifyNumber: res.data.identifyNumber, // 纳税人识别号
            bankName: res.data.bankName, // 开户银行名称
            bankAccountNumber: res.data.bankAccountNumber, // 基本开户账号
            registerAddress: res.data.registerAddress, // 注册场所地址
            registerPhone: res.data.registerPhone, // 注册号码
            receiveEmail: res.data.receiveEmail, // 接受邮箱
            contactName: res.data.contactName, // 收件人姓名
            receiveAddress: res.data.receiveAddress, // 发票邮寄地址
            contactPhone: res.data.contactPhone // 联系电话
          }
        }
        setModalInfo(form)
      }
    })
  }
  // 去支付
  const continuePay = (record: Record) => {
    const data = {
      enterpriseUuid: enterpriseUuid.current,
      userOrderUuid: record.userOrderUuid
    }
    settingApi.tradePay(data).then(res => {
      if (res.code === 200) {
        setPayModalInfo(data)
        setPayModalVisible(true)
        window.open(res.data.payUrl, '_blank')
      }
    })
  }
  // 申请发票
  const invoiceOrder = (record: Record) => {
    if (!isAllowApplayInvoice) {
      setIsModalVisible(true)
    } else {
      setPayModalInfo({enterpriseUuid: enterpriseUuid.current,userOrderUuid: record.userOrderUuid})
      setApplayInvoiceVisible(true)
    }
  }
  
  // 表格项
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo'
    },
    {
      title: '描述',
      dataIndex: 'businessRemark'
    },
    {
      title: '金额',
      dataIndex: 'receiptAmountValue'
    },
    {
      title: '日期',
      dataIndex: 'updateTime'
    },
    {
      title: '状态',
      dataIndex: 'orderStatusName'
    },
    {
      title: '操作',
      dataIndex: 'prodSpecName',
      width: '14%',
      render: (text: any, record: Record) => (<span>
        {record.orderStatus === 'waitPay' && <a onClick={() => continuePay(record)}>去支付</a>}
        {record.orderStatus === 'finish' && <span>
          {record.invoiceStatus === 'notApply' ? <a onClick={() => invoiceOrder(record)}>申请发票</a> : <span>已申请</span>}
        </span>}
      </span>)
    }
  ]
  // 唤起弹框
  const showModal = () => {
    setIsModalVisible(true)
  };
  // 关闭弹框
  const closeModal = async (flag: boolean) => {
    if (flag) {
      getTableList(postData)
    }
    setPayModalVisible(false)
    setIsModalVisible(false)
    setApplayInvoiceVisible(false)
    setPayModalInfo({enterpriseUuid:'',userOrderUuid:''})
  }
  /**
   * @description: 表格分页、排序、筛选变化时触发，todo：暂时前端做分页，此功能方法不调用
   * @param {Object} pag：分页
   * @param {Object} filters：筛选
   * @param {Object} sorter：排序
   */
  const handleTableChange = async (pag: any) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    const param = {
      ...postData,
      page: pager.current,
    };
    setPostData(param);
    getTableList(param);
  };
  // 修改发票信息
  const onUpdata = (flag: boolean) => {
    if(flag){
      setIsModalVisible(flag)
      setApplayInvoiceVisible(false)
    }
  }
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData)
      getInvoiceInfo()
    }
  }, [initialState]);
  return (
    <div className={styles.order}>
      <div className="account_title">
        <h1>订单管理</h1>
        <span className="account_user">
          <UnorderedListOutlined />
          {pagination.total}
        </span>
        <div className="acconut_rightuser" onClick={showModal}>
          完善发票信息
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        <Table
          rowKey={(record: Record) => record.uuid}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      {payModalVisible&&<PayModal modalDataProps={payModalInfo} isModalVisible={payModalVisible} onCancel={closeModal} />}
      {isModalVisible && <PerfectInvoice  modalDataProps={modalInfo} isModalVisible={isModalVisible} onCancel={closeModal} />}
      {applayInvoiceVisible && <ApplyInvoiceModal aplayInvoiceInfo={payModalInfo} modalDataProps={modalInfo} isModalVisible={applayInvoiceVisible} onCancel={closeModal} onUpdata={onUpdata}/>}
    </div>
  );
}
