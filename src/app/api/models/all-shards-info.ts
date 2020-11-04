/* tslint:disable */
import { ShardHash } from './shard-hash';
export interface AllShardsInfo {
  maxShardGenUtime: number;
  minShardGenUtime: number;
  shards?: Array<ShardHash>;
}
