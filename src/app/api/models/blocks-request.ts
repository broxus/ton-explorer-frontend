/* tslint:disable */
export interface BlocksRequest {
  fromTs?: number;
  limit: number;
  offset: number;
  skipEmpty: boolean;
  toTs?: number;
}
