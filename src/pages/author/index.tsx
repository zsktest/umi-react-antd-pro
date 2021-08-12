import React,{ useState, useEffect, useRef } from 'react';
import { Table, message, Form, Button, Input, Select, Typography } from 'antd';
import { useModel,history } from 'umi';
import { FormOutlined, CheckOutlined } from '@ant-design/icons';

import { authorApi } from '@/api';
import { Page } from '@/models'
import { Item } from './data'
import AuthorModal from './components/AuthorModal'

import styles from './index.less';

const { Option } = Select;
const { Paragraph } = Typography;
interface Values {
  companyThirdUuid?: string;
  licenseType?: string;
  robotName?: string;
}
interface ItemCell {
  clientName: string;
  companyName: string;
  companyThirdName: string;
  companyThirdUuid: string;
  companyUuid: string;
  createTime: string;
  creatorName: string;
  expireDate: string;
  hwid: string;
  kind: number
  license: string;
  licenseType: string;
  updateTime: string;
  uuid: string;
}
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ItemCell;
  record: ItemCell;
}
export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [enterpriseLicense, setEnterpriseLicense] = useState([])
  const [modalInfo, setModalInfo] = useState({list:[]})

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
    authorApi.listLicense(param).then((res) => {
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

  // 复制
  const doCopy = () => {
    message.success('已复制到剪切板')
  }

  // 表格项
  const columns = [
    {
      title: '客户端名称',
      dataIndex: 'clientName',
      editable: true
    },
    {
      title: '企业名称',
      dataIndex: 'companyThirdName'
    },
    {
      title: '机器码(点击复制)',
      dataIndex: 'hwid',
      width: '270px',
      render: (text: string, record: any) => <Paragraph copyable={{ text: record.hwid, onCopy: doCopy, icon: [<a>{text}</a>, <a>{text}</a>], tooltips: false }}></Paragraph>,
    },
    {
      title: '有效日期',
      dataIndex: '',
      render: (text: string, record: any) => <div> <p>起 {record.createTime.substring(0, 10)}</p><p>止 {record.expireDate.substring(0, 10)}</p></div>
    },
    {
      title: '激活码类型',
      dataIndex: 'licenseType',
      render: (licenseType: string) => <span>{licenseType === 'temp' ? '临时' : '正式'}</span>
    },
    {
      title: '客户端类型',
      dataIndex: 'kind',
      render: (kind: number) => <span>{kind === 10 ? 'studio' : 'robot'}</span>
    },
    {
      title: '操作',
      dataIndex: '',
      width: '14%',
      render: (text: string, record: any) => <Paragraph copyable={{ text: record.license, onCopy: doCopy, icon: [<a>复制激活码</a>, <a>复制激活码</a>], tooltips: false }}></Paragraph>,
    }
  ]
  //处理可编辑单元格逻辑
  const EditableCell = (obj: EditableCellProps) => {
    let {
      title,
      editable,
      children,
      dataIndex,
      record,
      ...restProps
    } = obj
    let childNode = children;

    const [editing, setEditing] = useState(false);
    const [clientName, setLlientName] = useState('')
    const toggleEdit = () => {
      setLlientName(record.clientName)
      setEditing(!editing);
    }
    const changeValue = (e: any) => {
      setLlientName(e.target.value)
    }
    const toggleClose = () => {
      if(clientName){
        const data = {
          clientLicenseUuid: record.uuid,
          clientName: clientName
        }
        authorApi.updateLicense(data).then(res => {
          if (res.code === 200) {
            closeModal(true)
            message.success('企业名称修改成功')
            setEditing(!editing);
          } 
        })
      }else{
        setEditing(!editing);
      }
    }
    if (editable) {
      childNode = editing ? (
        <div className="editable-cell-value-wrap">
          <Input className="font" value={clientName} onChange={changeValue} onPressEnter={toggleClose} /><div className="placeholder"><CheckOutlined className="sure" onClick={toggleClose}/></div>
        </div>
      ) : (
        <div className="editable-cell-value-wrap">
          <div className="font">{children}</div> <div className="placeholder"><FormOutlined className="edit" onClick={toggleEdit} /></div>
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  }
  // 设置表格组件自定义
  const components = {
    body: {
      cell: EditableCell
    },
  };
  
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ItemCell) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });
  // 唤起弹框
  const showModal = () => {
    let obj = {
      list: enterpriseLicense
    }
    setModalInfo(obj)
    setIsModalVisible(true)
  };
  // 关闭弹框
  const closeModal = async (flag: boolean) => {
    if(flag){
      const values = await form.validateFields();
      getTableList(postData,values)
    }
    setIsModalVisible(false)
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
    const values = await form.validateFields();
    getTableList(param,values);
  };
  // 获取企业列表
  const getThirdList = () => {
    const data = {
      page: 1,
      size: 1000
    }
    authorApi.thirdList(data).then(res => {
      if (res.code === 200) {
        setEnterpriseLicense(res.data)
      } else {
        setEnterpriseLicense([])
      }
    })
  }
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData,{});
      getThirdList()
    }
  }, [initialState]);
  const onFinish = (values: Values) => {
    getTableList(postData,values);
  }
  const jumpUrl = () => {
    history.push('/tripartite');
  }
  return (
    <div className={styles.author}>
      <div className="account_title">
        <h1>激活码管理</h1>
        <div className="acconut_rightuser" onClick={jumpUrl}>
          企业管理
        </div>
      </div>
      <div className="search">
        <Form
          name="basic"
          layout="inline"
          onFinish={onFinish}
        >

          <Form.Item
            label="机器码"
            name="robotName"
          >
            <Input placeholder="机器码" allowClear/>
          </Form.Item>

          <Form.Item
            name="companyThirdUuid"
          >
            <Select placeholder="请选择企业" allowClear>
              {enterpriseLicense.length && enterpriseLicense.map((item: Item) => (
                <Option key={item.uuid} value={item.uuid}>{item.thirdName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="licenseType"
          >
            <Select placeholder="请选择激活码类型" allowClear>
              <Option value="temp">临时激活码</Option>
              <Option value="formal">正式激活码</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Button onClick={showModal}>创建激活码</Button>
        </Form>

      </div>
      <div style={{ padding: '0 24px' }}>
        <Table
          rowKey = {(record: ItemCell) => record.uuid}
          components={components}
          columns={mergedColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      {isModalVisible && <AuthorModal modalDataProps={modalInfo} isModalVisible={isModalVisible} onCancel={closeModal} />}
    </div>
  );
}
