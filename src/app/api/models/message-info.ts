/* tslint:disable */
import { MessageAddress } from './message-address';
export interface MessageInfo {
  bounce?: boolean;
  bounced?: boolean;
  createdAt?: number;
  createdLt?: string;
  dest?: MessageAddress;
  fwdFee?: string;
  ihrDisabled?: boolean;
  ihrFee?: string;
  importFee?: string;
  kind: string;
  src?: MessageAddress;
  value?: string;
}
