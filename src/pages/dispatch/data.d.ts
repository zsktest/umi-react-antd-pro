export type robotrightdataType = {
  createTime: string;
  creatorUuid: string;
  cronInterface: any;
  description: string;
  enabled: false
  executeScope: string;
  name: string;
  executeScopeName: string;
  robotClientUuids: {[]};
  robots: any;
  uuid: string;
  sceneName: string;
  runTimes: string;
  sourceUuid: string;
  statusName: string;
  status: string;
  robotClientUuid: string;
  actions: any;
  img: string;
  currentRobotName: string;
  currentSceneInstUuid: string;
};
export type ModalEnterpriseLicenseType = {
  uuid: string;
  endTime: string;
}

export type FlagType = boolean;

export interface ModalProps<T> {
  onCancel: (flag: FlagType, key:any) => void;
  isModalVisible: FlagType;
  modalDataProps?: any;
}

export type ModalAccountType = {
  id: string,
  method: string,
  params: {}
}