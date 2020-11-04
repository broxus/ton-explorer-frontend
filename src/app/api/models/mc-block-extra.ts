/* tslint:disable */
import { AllShardsInfo } from './all-shards-info';
import { BlockchainConfig } from './blockchain-config';
export interface McBlockExtra {
  config?: BlockchainConfig;
  isKeyBlock: boolean;
  shardHashes: AllShardsInfo;
}
