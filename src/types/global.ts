import Hapi, { MergeType } from '@hapi/hapi';


export interface ICredentials extends Hapi.AuthCredentials {
  [key: string]: unknown;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  firebase: {
    identities: {};
    sign_in_provider: 'custom';
  };
  uid: string;
  email: string;
  user?: {
    uid: string;
    email: string;
  };
}

export interface IRequestAuth extends Hapi.RequestAuth {
  credentials: ICredentials;
}

export interface IRequest extends Hapi.Request {
  auth: IRequestAuth;
}

export interface IApiErrorResponse {
    success: false;
    error: string;
    code?: string;
  }