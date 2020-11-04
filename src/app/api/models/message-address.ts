/* tslint:disable */
import { MessageAnycast } from './message-anycast';
export interface MessageAddress {
  address: string;
  addressLength?: number;
  anycast?: MessageAnycast;
  workchain: number;
}
