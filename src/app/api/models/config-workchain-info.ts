/* tslint:disable */
import { ConfigWorkchainFormat } from './config-workchain-format';
export interface ConfigWorkchainInfo {
  acceptMsgs: boolean;
  active: boolean;
  actualMinSplit: number;
  basic: boolean;
  enabledSince: number;
  flags: number;
  format: ConfigWorkchainFormat;
  maxSplit: number;
  minSplit: number;
  version: number;
  zerostateFileHash: string;
  zerostateRootHash: string;
}
