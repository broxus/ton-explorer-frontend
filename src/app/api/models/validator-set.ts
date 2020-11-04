/* tslint:disable */
import { Validator } from './validator';
export interface ValidatorSet {
  list?: Array<Validator>;
  main: number;
  total: number;
  totalWeight: string;
  utimeSince: number;
  utimeUntil: number;
}
