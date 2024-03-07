export interface IX509 {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: string;
}

export interface IAdminConfig {
  id: string,
  secret: string
}

export interface IStandardResponse {
  message: string,
  status: number
}

export interface IChaincodeResponse {
  data: string,
  status: number
}

export interface IUsersData {
  id: number;
  org: string;
  admin_Id: string;
  admin_data: IX509;
}

export interface IGetUser {
  org: string;
  user_Id: string;
}

export interface IProfile {
  walletAddressHLF: string;
  first_name: string;
  last_name?: string;
  email?: string;
  mobile_number: string;
}

