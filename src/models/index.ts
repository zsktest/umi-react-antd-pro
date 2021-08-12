export interface YDResponse<T> {
  success: boolean;
  data: T;
  code: number;
  requestId: string;
  page?: any;
  msg?: string;
}

export interface ListParams {
  page: number;
  size: number;
  [key: string]: any;
}

export interface TreeDataType extends ModalMenuDataType {
  key: string | undefined;
  title: string | undefined;
  deptId?: number;
  deptName?: string;
  menuId?: string;
  name?: string;
  children?: Array<TreeDataType>;
}

export type FlagType = boolean;

export interface ModalProps<T> {
  onCancel: (flag: FlagType) => void;
  isModalVisible: FlagType;
  modalDataProps?: T;
}

export type ListType = { [key: string]: any } & ModalRoleDataType & ModalMenuDataType;

export interface ModalDepartmentType {
  parentId: string;
  deptName: string;
  deptId: string;
}

export interface ModalEmployeeType {
  userId?: number;
  name: string;
  nickName: string;
  phone: string;
  email: string;
  paswordType: string;
  password: string;
  roleIds: Array<number>;
  deptId: string;
  postId: string;
}
export interface ModalRoleDataType {
  roleId: number;
  roleName: string;
  roleCode: string;
  treeData?: Array<TreeDataType>;
}

export interface ModalMenuDataType {
  menuId?: string;
  name?: string;
  parentId?: string;
  path?: string;
  type: string;
}

export interface SettingFormItemType {
  type: string;
  placeholder: string;
  [key: string]: any;
  code: string;
}
export interface ModalCharts {
  field?: string;
  days?: string;
}
export interface Page{
  page: number;
  size: number
}
export interface AnyType {
  [key: string]: any
}
