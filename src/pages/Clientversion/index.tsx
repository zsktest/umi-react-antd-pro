import { useState, useEffect, useRef } from 'react';
import { Modal, Table, message, Form, Upload, Button, Input } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { clientVersionApi } from '@/api';
import { Page } from '@/models'

import styles from './index.less';

const { confirm } = Modal;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};

interface URL {
  url: string;
}
interface Zs {
  url: string;
  response: URL;
}
interface Record {
  clientVersion: string;
  uuid: string;
  [key: string]: any
}
export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, total: 0, current: 1, showSizeChanger:false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [fileListkey, setFileListkey] = useState<any>([]);
  const [installKey, setInstallKey] = useState('');
  const [updateKey, setUpdateKey] = useState('');

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  const authData = useRef({ access_token: localStorage.getItem('ACCESS_TOKEN') });
  const description = useRef('1. 问题修复。\n2. 性能优化。');

  const [form] = Form.useForm();
  // 获取列表
  const getTableList = (data: Page) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
    };
    clientVersionApi.clientVersionList(param).then((res) => {
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
  const handleRead = (key: string) => {
    const data = {
      clientVersionUuid: key,
    };
    clientVersionApi.clientVersionDelete(data).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getTableList(postData);
      }
    });
  };
  const deleteData = (record: Record) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: `确认要删除当前版本${record.clientVersion}？`,
      onOk() {
        handleRead(record.uuid);
      },
      onCancel() {},
    });
  };
  // 表格项
  const columns = [
    {
      title: '版本号',
      dataIndex: 'clientVersion',
      width: '8%',
    },
    {
      title: '安装包地址',
      dataIndex: 'installUrl',
      width: '160',
    },
    {
      title: '升级包地址',
      dataIndex: 'updateUrl',
    },
    {
      title: '发布时间',
      dataIndex: 'updateTime',
      width: '18%',
    },
    {
      title: '版本描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (text: string, record: any) => <a onClick={() => deleteData(record)}>删除</a>,
      width: '8%',
    },
  ];
  const showModal = () => {
    setInstallKey('');
    setUpdateKey('');
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };
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
  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    setFileListkey([]);
    getTableList(postData);
  };
  // 关闭弹框
  const handleOk = async () => {
    try {
      setLoadings(true);
      const values = await form.validateFields();
      const data = {
        ...values,
        installKey,
        updateKey,
      };
      clientVersionApi.clientVersionCreate(data).then((res) => {
        if (res.code === 200) {
          setLoadings(false);
          setIsModalVisible(false);
          message.success('版本添加成功!');
          getTableList(postData);
        } else {
          setLoadings(false);
          setIsModalVisible(true);
        }
      });
    } catch (errorInfo) {
      setLoadings(false)
      console.log('Failed:', errorInfo);
    }
  };
  // 上传版本
  const handleChange = (info: any) => {
    let fileList_r: Zs[] = [...info.fileList];
    fileList_r = fileList_r.slice(-1);
    fileList_r = fileList_r.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    if (info.file.response) {
      setInstallKey(info.file.response.data);
    }
    setFileList(fileList_r);
  };
  // 上传升级包
  const handleChangekey = (info: any) => {
    let fileList_r: Zs[] = [...info.fileList];
    fileList_r = fileList_r.slice(-1);
    fileList_r = fileList_r.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    if (info.file.response) {
      setUpdateKey(info.file.response.data);
    }
    setFileListkey(fileList_r);
  };
  // 删除安装包
  const removeInstall = () => {
    setInstallKey('');
  };
  // 删除升级包
  const removeUpdate = () => {
    setUpdateKey('');
  };
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData);
    }
  }, [initialState]);
  return (
    <div className={styles.clientversion}>
      <div className="account_title">
        <h1>客户端版本管理</h1>
        <div className="acconut_rightuser" onClick={showModal}>
          <PlusOutlined />
          客户端版本
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
      <Modal
        title="新增版本"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadings}
      >
        <Form
          name="validate_other"
          form={form}
          {...formItemLayout}
          initialValues={{ description: description.current }}
        >
          <Form.Item
            name="clientVersion"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="a.b.c格式的版本号" />
          </Form.Item>
          <Form.Item
            name="description"
            label="版本说明"
            rules={[{ required: true, message: '请输入版本说明' }]}
          >
            <TextArea placeholder="版本说明" rows={5} />
          </Form.Item>
          <Form.Item label="文件上传">
            <Upload
              name="file"
              action="/api/v1/sys/clientVersion/upload/temp"
              data={authData.current}
              fileList={fileList}
              onChange={handleChange}
              onRemove={removeInstall}
            >
              <Button icon={<UploadOutlined />}>上传安装包</Button>
            </Upload>
            <div style={{ height: '10px' }}></div>
            <Upload
              name="file"
              data={authData.current}
              fileList={fileListkey}
              action="/api/v1/sys/clientVersion/upload/temp"
              onChange={handleChangekey}
              onRemove={removeUpdate}
            >
              <Button>上传升级包(可选)</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
