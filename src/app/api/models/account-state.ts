/* tslint:disable */
import { MapSimpleLib } from './map-simple-lib';
import { TickTock } from './tick-tock';
export interface AccountState {
  code?: string;
  data?: string;
  kind: string;
  library: MapSimpleLib;
  special?: TickTock;
  splitDepth?: number;
  stateHash?: string;
}
