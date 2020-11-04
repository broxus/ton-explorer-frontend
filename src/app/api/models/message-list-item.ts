/* tslint:disable */
export interface MessageListItem {
  bodyHash: string;
  bounce?: boolean;
  bounced?: boolean;
  createdAt?: number;
  createdLt?: string;
  dstAddress?: string;
  dstWorkchain?: number;
  fwdFee?: string;
  ihrFee?: string;
  importFee?: string;
  messageType: string;
  'n': number;
  out: boolean;
  srcAddress?: string;
  srcWorkchain?: number;
  transactionAccountId: string;
  transactionHash: string;
  transactionLt: string;
  transactionTime: number;
  transactionWorkchain: number;
  value?: string;
}
