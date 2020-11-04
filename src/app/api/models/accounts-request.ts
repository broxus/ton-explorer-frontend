/* tslint:disable */
export interface AccountsRequest {
  asc: boolean;
  fromTs?: number;
  limit: number;
  offset: number;
  orderColumn: string;
  toTs?: number;
}
