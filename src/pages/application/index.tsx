import React, { useState, useEffect, useRef } from 'react';
import { Table, message, Form, Button, Input, Select, Dropdown, Menu, Modal } from 'antd';
import { Link, useModel } from 'umi';
import { CaretDownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { applicationApi, userApi } from '@/api';
import { Page } from '@/models'
import TransferModal from './components/TransferModal'

import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;
interface Values {
  companyThirdUuid?: string;
  licenseType?: string;
  robotName?: string;
}
interface ItemOwn {
  account: string;
  accountType: string;
  accountTypeName: string;
  uuid: string;
  userUuid: string;
  key?: any
}
interface Record {
  createTime: string;
  currentAcquireCount: number;
  developTime: string;
  enterpriseUuid: string;
  ownerName: string;
  ownerUuid: string;
  robotGrade: string;
  robotGradeName: string;
  robotIcon: string;
  robotName: string;
  robotType: string;
  robotTypeName: string;
  robotUuid: string;
  updateTime: string;
  key?: any
}
export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({ robotUuid: '', enterpriseUuid: '' })
  const [options, setOptions] = useState([])

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');

  const [form] = Form.useForm();
  // 获取列表
  const getTableList = (data: Page, values: Values) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
      ...values
    };
    applicationApi.applicaList(param).then((res) => {
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
  // 转交所有者
  const confirmFn = (record: Record) => {
    let obj = {
      robotUuid: record.robotUuid,
      enterpriseUuid: enterpriseUuid.current
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  }
  // 关闭弹框
  const closeModal = async (flag: boolean) => {
    if (flag) {
      const values = await form.validateFields();
      getTableList(postData, values)
    }
    setIsModalVisible(false)
  }
  const getdelete = async (record: Record) => {
    const data = {
      enterpriseUuid:enterpriseUuid.current,
      robotUuid: record.robotUuid
    }
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: record.robotType ===  "app" ? '应用在此处删除后，开发应用列表、获取应用列表和企业市场中，都不再显示，且不可恢复。' : '指令集删除后，不影响应用运行',
      onOk() {
        applicationApi.deleteRobot(data).then(res => {
          if (res.code === 200) {
            message.success('应用删除成功')
            closeModal(true)
          }
        })
      }
    });
  }
  // 表格项
  const columns = [
    {
      title: '应用名称',
      dataIndex: 'robotName'
      // width: '20%'
    },
    {
      title: '类型',
      dataIndex: 'robotTypeName'
    },
    {
      title: '归属账号',
      dataIndex: 'ownerName'
    },
    {
      title: '最近更新',
      dataIndex: 'updateTime'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    },
    // {
    //   title: '获取人数',
    //   dataIndex: 'currentAcquireCount'
    // },
    {
      title: '操作',
      dataIndex: '',
      width: '14%',
      render: (text: any, record: Record) => (
        <span>
          <Link to={'application/detail?robotUuid='+record.robotUuid}>查看</Link>
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="confirm">
                <a onClick={() => confirmFn(record)}>
                  转交所有者
                </a>
              </Menu.Item>
              <Menu.Item key="delete">
                <a onClick={() => getdelete(record)}>
                  删除
                </a>
              </Menu.Item>
            </Menu>
          } placement="bottomLeft" arrow>
            <a style={{ marginLeft: '10px' }}>更多 <CaretDownOutlined /></a>
          </Dropdown>
        </span>)
    }
  ]
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
    const values = await form.validateFields();
    getTableList(param, values);
  };
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData, {});
      userApi.recordLog({ spm: 'o.c' });
    }
  }, [initialState]);
  const onFinish = (values: Values) => {
    getTableList(postData, values);
  }
  // 所有者自动补全获取数据
  const onSearch = (val: string) => {
    const data = {
      enterpriseUuid: enterpriseUuid.current,
      key: val
    }
    applicationApi.userList(data).then(res => {
      setOptions(res.data)
    })
  }
  return (
    <div className={styles.application}>
      <div className="account_title">
        <h1>应用管理</h1>
      </div>
      <div className="search">
        <Form
          name="basic"
          layout="inline"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="应用名称"
            name="robotName"
          >
            <Input placeholder="请输入应用名称" allowClear />
          </Form.Item>

          <Form.Item
            label="所有者"
            name="robotOwnerUuid"
          >
            <Select
              showSearch
              placeholder='员工的中文名称或昵称'
              defaultActiveFirstOption={false}
              showArrow
              allowClear
              filterOption={false}
              onSearch={onSearch}
              notFoundContent={null}
            >
              {options.length && options.map((item: ItemOwn) => (
                <Option key={item.userUuid} value={item.userUuid}>账号：{item.account}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="排序"
            name="sortBy"
          >
            <Select placeholder="选择时间" allowClear>
              <Option value="createTime">创建时间</Option>
              <Option value="updateTime">更新时间</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>

      </div>
      <div style={{ padding: '0 24px' }}>
        <Table
          rowKey={(record: Record) => record.robotUuid}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      {isModalVisible && <TransferModal modalDataProps={modalInfo} isModalVisible={isModalVisible} onCancel={closeModal} />}
    </div>
  );
}
