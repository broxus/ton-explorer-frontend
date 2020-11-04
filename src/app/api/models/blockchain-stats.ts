/* tslint:disable */
import { MapBlockchainStatsCounts } from './map-blockchain-stats-counts';
export interface BlockchainStats {
  counts: MapBlockchainStatsCounts;
  maxSeqno: number;
  totalSupply: string;
  volume24: string;
}
