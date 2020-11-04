/* tslint:disable */
import { MessageInfo } from './message-info';
export interface Message {
  body?: string;
  hash: string;
  info: MessageInfo;
  init?: string;
}
