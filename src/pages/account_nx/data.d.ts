export type DataType = {
  account: string;
  accountType: string;
  accountTypeName: string;
  createTime: string;
  email: string;
  enterpriseUuid: string;
  expiredTime: string;
  loginAccount: string;
  name: string;
  password: string;
  phone: string;
  role: string;
  roleName: string;
  status: string
  updateTime: string;
  userLicense: any;
  userUuid: string;
  uuid: string;
};

export type ModalAccountType = {
  account: string;
  accountType: string;
  email: string;
  name: string;
  passwordType?: string;
  password?: string;
  userLicenseUuid?: string;
  phone: string;
  role: string;
  enterpriseUserUuid?: string;
  enableExtraAccount: boolean;
  userLicense: any;
}

export type ModalEnterpriseLicenseType = {
  uuid: string;
  endTime: string;
}

export type ModalPasswordType = {
  passwordType?: string;
  userUuid: string;
  customPassword: string;
}

export type ModalLicenseType = {
  userLicenseUuid?: string;
  userUuid: string;
}

export type ModalRefeeType = {
  duration?: number;
  userLicenseUuids: string;
}

export type UserInfoType = {
  loginAccount: string;
  phone: string;
  createTime: string;
  email: string;
  expiredTime: string;
  password: string;
}

export type AccumulatedDataType = {
  name: string;
  remark: string;
  value: number;
}