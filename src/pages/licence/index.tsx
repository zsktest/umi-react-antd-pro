import { useState, useEffect, useRef } from 'react';
import { Modal, Table, message, Badge } from 'antd';
import { UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { licenceApi } from '@/api';
import LicenceModal from './components/LicenceModal';
import { Page } from '@/models';

import styles from './index.less';

const { confirm } = Modal;
interface Record {
  uuid: string;
  key?: any;
}
export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState<any>({})
 

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  // 获取列表
  const getTableList = (data: Page) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
    };
    licenceApi.grantList(param).then((res) => {
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
  // 删除
  const deleteData = (key: string) => {
    const data = {
      userLicenseGrantUuid: key,
      enterpriseUuid: enterpriseUuid.current,
    };
    licenceApi.grantDelete(data).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getTableList(postData);
      }
    });
  };
  const getdelete = (record: Record) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除当前套餐?',
      onOk() {
        deleteData(record.uuid);
      },
      onCancel() {},
    });
  };
  // 查看
  const handleReadsee = (record: any) => {
    let obj = {
      type:'Readsee',
      uuid: record.uuid
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  };
  // 激活
  const handleRead = (record: any) => {
    let obj = {
      type:'Read',
      uuid: record.uuid
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  };

  // 表格项
  const columns = [
    {
      title: '订单描述',
      dataIndex: 'licenseSourceName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '到期时间',
      dataIndex: 'licenseExpiredTime',
    },
    {
      title: '账号类型',
      dataIndex: 'licenseSource',
      render: (licenseSource: string) => (
        <p style={{ margin: 0 }}>{licenseSource === 'extra' ? '附加' : '套餐'}</p>
      ),
    },
    {
      title: '状态',
      dataIndex: 'grantStatusName',
      render: (text:string, record: any) => (
        <>
          <Badge status={record.grantStatus === 'authorized' ? 'success' : 'processing'} />{' '}
          {record.grantStatusName}
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'prodSpecName',
      width: '14%',
      render: (text:string, record: any) => (
        <>
          {record.grantStatus === 'authorized' && (
            <a
              onClick={() => {
                handleReadsee(record);
              }}
            >
              查看
            </a>
          )}
          {record.grantStatus === 'unauthorized' && (
            <a
              onClick={() => {
                handleRead(record);
              }}
            >
              激活
            </a>
          )}
          {record.grantStatus === 'unauthorized' && (
            <a
              style={{ marginLeft: '10px' }}
              onClick={() => {
                getdelete(record);
              }}
            >
              删除
            </a>
          )}
        </>
      ),
    },
  ];
  /**
   * @description: 表格分页、排序、筛选变化时触发，todo：暂时前端做分页，此功能方法不调用
   * @param {Object} pag：分页
   * @param {Object} filters：筛选
   * @param {Object} sorter：排序
   */
  const handleTableChange = (pag: any) => {
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
  // 弹框取消
  const closeModal = (status: boolean) => {
    //为true，激活成功，需更新列表
    if(status){
      getTableList(postData);
    }
    setIsModalVisible(false)
  }
  // 导入订单激活码
  const pulicence = () => {
    let obj = {
      type:'pulicence',
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  };
  // 创建许可证订单
  const paylicence = () => {
    let obj = {
      type:'paylicence',
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  };

  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData);
    }
  }, [initialState]);
  return (
    <div className={styles.licence}>
      <div className="account_title">
        <h1>许可证列表</h1>
        <span className="account_user">
          <UnorderedListOutlined />
          {pagination.total}
        </span>
        <div className="acconut_right" onClick={pulicence}>
          导入订单激活码
        </div>
        <div className="acconut_rightuser" onClick={paylicence}>
          创建许可证订单
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        <Table
          rowKey = {(record: Record) => record.uuid}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      {isModalVisible && <LicenceModal modalDataProps={modalInfo} isModalVisible={isModalVisible} onCancel={closeModal} />}
    </div>
  );
}
