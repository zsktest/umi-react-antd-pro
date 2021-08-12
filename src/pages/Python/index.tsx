import { useState, useEffect, useRef } from 'react';
import { Modal, Table, message, Form, Upload, Button } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { Page } from '@/models'
import { pythonApi } from '@/api';

import styles from './index.less';

const { confirm } = Modal;
interface Record {
  packageName: string,
  fileName: string
}
interface URL {
  url: string;
  code: number
}
interface Zs {
  url: string;
  response: URL;
}
interface File {
  name:string;
  key?: any
}
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
export default function IndexPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({ page: 1, size: 10 });
  const [pagination, setPagination] = useState({ showQuickJumper: true, showSizeChanger:false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState<any>([]);

  const { initialState } = useModel<any>('@@initialState');
  const enterpriseUuid = useRef('');
  const authData = useRef({ access_token: localStorage.getItem('ACCESS_TOKEN') });
  const listmsg = useRef(1);
  // 获取列表
  const getTableList = (data: Page) => {
    setLoading(true);
    const param = {
      ...data,
      enterpriseUuid: enterpriseUuid.current,
    };
    pythonApi.pypiList(param).then((res) => {
      if (res.code === 200) {
        setLoading(false);
        setDataSource(res.data);
      } else {
        setLoading(false);
        setDataSource([]);
      }
    });
  };
  // 删除
  const handleRead = (key: string) => {
    const data = {
      fileName: key,
    };
    pythonApi.pypiDelete(data).then((res) => {
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
      content: `确认要删除当前依赖包${record.packageName}？`,
      onOk() {
        handleRead(record.fileName);
      },
      onCancel() {},
    });
  };
  // 表格项
  const columns = [
    {
      title: '依赖包',
      dataIndex: 'packageName',
      width: '10%',
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: '10%',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
    },
    {
      title: '文件',
      dataIndex: 'fileName',
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
    setIsModalVisible(true);
  };
  /**
   * @description: 表格分页、排序、筛选变化时触发，todo：暂时前端做分页，此功能方法不调用
   * @param {Object} pag：分页
   * @param {Object} filters：筛选
   * @param {Object} sorter：排序
   */
  const handleTableChange = (pag: any) => {};
  // 弹框取消
  const handleCancel = () => {
    setIsModalVisible(false);
    setFileList([]);
    getTableList(postData);
  };
  // 上传版本
  const handleChange = (info: any) => {
    listmsg.current = 1;
    // eslint-disable-next-line no-unused-vars
    let fileList_r: Zs[]= [...info.fileList];
    fileList_r = fileList_r.map((file) => {
      if (file.response) {
        if (file.response.code === 400) {
          message.warning(info.file.response.msg);
          listmsg.current = 2;
        } else {
          file.url = file.response.url;
        }
      }
      return file;
    });
    setFileList(fileList_r);
    if (listmsg.current === 2) {
      setFileList([]);
    }
  };
  // 删除版本
  const remove = (file: File) => {
    handleRead(file.name);
  };
  useEffect(() => {
    if (initialState.currentUser) {
      enterpriseUuid.current = initialState.currentUser.enterpriseUuid;
      getTableList(postData);
    }
  }, [initialState]);
  return (
    <div className={styles.python}>
      <div className="account_title">
        <h1>Python包管理</h1>
        <div className="acconut_rightuser" onClick={showModal}>
          <PlusOutlined /> Python包
        </div>
      </div>
      <div style={{ padding: '0 24px' }}>
        <Table
          rowKey = {(record: any) => record.fileName}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      <Modal title="上传Python包" visible={isModalVisible} footer={null} onCancel={handleCancel}>
        <Form name="validate_other" {...formItemLayout}>
          <Form.Item label="文件上传">
            <Upload
              name="file"
              action="/api/v1/sys/pypi/upload"
              data={authData.current}
              accept=".whl, .egg"
              fileList={fileList}
              onRemove={remove}
              onChange={handleChange}
            >
              <Button icon={<UploadOutlined />}>上传安装包</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
