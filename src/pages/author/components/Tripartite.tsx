import React,{ useState, useEffect, useRef } from 'react';
import { Table, message, Form, Button, Input } from 'antd';
import { useModel } from 'umi';
import { FormOutlined, CheckOutlined } from '@ant-design/icons';

import { authorApi } from '@/api';
import { Page } from '@/models'

import styles from './../index.less';


interface Values {
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
  thirdName:''
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

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');

  const [form] = Form.useForm();
  // 获取列表
  const getTableList = (data: Page, values: Values) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
      key: values.robotName ? values.robotName : ''
    };
    authorApi.thirdList(param).then((res) => {
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

  // 表格项
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'thirdName',
      editable: true
    },
    {
      title: '开始时间',
      dataIndex: 'startTime'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
        title: 'robot额度',
        dataIndex: 'robotQuota',
      render: (text: string, record: any) => <span>{ record.robotLicenseCount }/{ record.robotQuota }</span>
    },
    {
        title: 'studio额度',
        dataIndex: 'studioQuota',
      render: (text: string, record: any) => <span>{ record.studioLicenseCount }/{ record.studioQuota }</span>
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
    const [thirdName, setThirdName] = useState('')
    const toggleEdit = () => {
        setThirdName(record.thirdName)
      setEditing(!editing);
    }
    const changeValue = (e: any) => {
        setThirdName(e.target.value)
    }
    const toggleClose = () => {
      if(thirdName){
        const data = {
          companyThirdUuid: record.uuid,
          thirdName: thirdName
        }
        authorApi.thirdUpdateName(data).then(res => {
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
          <Input className="font" value={thirdName} onChange={changeValue} onPressEnter={toggleClose} /><div className="placeholder"><CheckOutlined className="sure" onClick={toggleClose}/></div>
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
  
  // 关闭弹框
  const closeModal = async (flag: boolean) => {
    if(flag){
      const values = await form.validateFields();
      getTableList(postData,values)
    }
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
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData,{});
    }
  }, [initialState]);
  const onFinish = (values: Values) => {
    getTableList(postData,values);
  }
  return (
    <div className={styles.author}>
      <div className="account_title">
        <h1>企业管理</h1>
      </div>
      <div className="search">
        <Form
          name="basic"
          layout="inline"
          onFinish={onFinish}
        >

          <Form.Item
            label="企业名称"
            name="robotName"
          >
            <Input placeholder="企业名称" allowClear/>
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
          rowKey = {(record: ItemCell) => record.uuid}
          components={components}
          columns={mergedColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
}
