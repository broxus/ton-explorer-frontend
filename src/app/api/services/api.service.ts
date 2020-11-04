/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Account } from '../models/account';
import { AccountListItem } from '../models/account-list-item';
import { AccountTransactionsRequest } from '../models/account-transactions-request';
import { AccountsRequest } from '../models/accounts-request';
import { AuthInfo } from '../models/auth-info';
import { Block } from '../models/block';
import { BlockListItem } from '../models/block-list-item';
import { BlockRequest } from '../models/block-request';
import { BlockState } from '../models/block-state';
import { BlockchainStats } from '../models/blockchain-stats';
import { BlocksRequest } from '../models/blocks-request';
import { CountResponse } from '../models/count-response';
import { ElectionDatesRequest } from '../models/election-dates-request';
import { ElectionStakesRequest } from '../models/election-stakes-request';
import { GetTimeResponse } from '../models/get-time-response';
import { IdRequest } from '../models/id-request';
import { LimitedIdRequest } from '../models/limited-id-request';
import { Message } from '../models/message';
import { MessageListItem } from '../models/message-list-item';
import { MessagesCountRequest } from '../models/messages-count-request';
import { MessagesRequest } from '../models/messages-request';
import { PastElectionListItem } from '../models/past-election-list-item';
import { SearchRequest } from '../models/search-request';
import { SearchResponse } from '../models/search-response';
import { SearchResponseMessageItem } from '../models/search-response-message-item';
import { StakeTransactionCountRequest } from '../models/stake-transaction-count-request';
import { StakeTransactionListItem } from '../models/stake-transaction-list-item';
import { StakeTransactionListRequest } from '../models/stake-transaction-list-request';
import { TotalStakeListItem } from '../models/total-stake-list-item';
import { TotalStakesRequest } from '../models/total-stakes-request';
import { Transaction } from '../models/transaction';
import { TransactionListItem } from '../models/transaction-list-item';
import { TransactionsCountRequest } from '../models/transactions-count-request';
import { TransactionsRequest } from '../models/transactions-request';
import { ValidatorAccountsRequest } from '../models/validator-accounts-request';
import { ValidatorAccountsResponse } from '../models/validator-accounts-response';
import { ValidatorsState } from '../models/validators-state';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getApiGetTime
   */
  static readonly GetApiGetTimePath = '/api/get-time';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApiGetTime()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiGetTime$Response(params?: {

  }): Observable<StrictHttpResponse<GetTimeResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetApiGetTimePath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetTimeResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApiGetTime$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiGetTime(params?: {

  }): Observable<GetTimeResponse> {

    return this.getApiGetTime$Response(params).pipe(
      map((r: StrictHttpResponse<GetTimeResponse>) => r.body as GetTimeResponse)
    );
  }

  /**
   * Path part for operation getApiStats
   */
  static readonly GetApiStatsPath = '/api/stats';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApiStats()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiStats$Response(params?: {

  }): Observable<StrictHttpResponse<BlockchainStats>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetApiStatsPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BlockchainStats>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApiStats$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiStats(params?: {

  }): Observable<BlockchainStats> {

    return this.getApiStats$Response(params).pipe(
      map((r: StrictHttpResponse<BlockchainStats>) => r.body as BlockchainStats)
    );
  }

  /**
   * Path part for operation postApiSearch
   */
  static readonly PostApiSearchPath = '/api/search';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiSearch()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiSearch$Response(params: {
      body: SearchRequest
  }): Observable<StrictHttpResponse<SearchResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiSearchPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SearchResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiSearch$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiSearch(params: {
      body: SearchRequest
  }): Observable<SearchResponse> {

    return this.postApiSearch$Response(params).pipe(
      map((r: StrictHttpResponse<SearchResponse>) => r.body as SearchResponse)
    );
  }

  /**
   * Path part for operation getApiAuthInfo
   */
  static readonly GetApiAuthInfoPath = '/api/auth-info';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApiAuthInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiAuthInfo$Response(params?: {

  }): Observable<StrictHttpResponse<AuthInfo>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetApiAuthInfoPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthInfo>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApiAuthInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiAuthInfo(params?: {

  }): Observable<AuthInfo> {

    return this.getApiAuthInfo$Response(params).pipe(
      map((r: StrictHttpResponse<AuthInfo>) => r.body as AuthInfo)
    );
  }

  /**
   * Path part for operation postApiAccount
   */
  static readonly PostApiAccountPath = '/api/account';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiAccount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccount$Response(params: {
      body: IdRequest
  }): Observable<StrictHttpResponse<Account>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiAccountPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Account>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiAccount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccount(params: {
      body: IdRequest
  }): Observable<Account> {

    return this.postApiAccount$Response(params).pipe(
      map((r: StrictHttpResponse<Account>) => r.body as Account)
    );
  }

  /**
   * Path part for operation postApiAccountTransactions
   */
  static readonly PostApiAccountTransactionsPath = '/api/account/transactions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiAccountTransactions()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccountTransactions$Response(params: {
      body: AccountTransactionsRequest
  }): Observable<StrictHttpResponse<Array<Transaction>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiAccountTransactionsPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Transaction>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiAccountTransactions$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccountTransactions(params: {
      body: AccountTransactionsRequest
  }): Observable<Array<Transaction>> {

    return this.postApiAccountTransactions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Transaction>>) => r.body as Array<Transaction>)
    );
  }

  /**
   * Path part for operation postApiAccountList
   */
  static readonly PostApiAccountListPath = '/api/account/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiAccountList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccountList$Response(params: {
      body: AccountsRequest
  }): Observable<StrictHttpResponse<Array<AccountListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiAccountListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<AccountListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiAccountList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiAccountList(params: {
      body: AccountsRequest
  }): Observable<Array<AccountListItem>> {

    return this.postApiAccountList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<AccountListItem>>) => r.body as Array<AccountListItem>)
    );
  }

  /**
   * Path part for operation postApiTransaction
   */
  static readonly PostApiTransactionPath = '/api/transaction';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiTransaction()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransaction$Response(params: {
      body: IdRequest
  }): Observable<StrictHttpResponse<Transaction>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiTransactionPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Transaction>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiTransaction$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransaction(params: {
      body: IdRequest
  }): Observable<Transaction> {

    return this.postApiTransaction$Response(params).pipe(
      map((r: StrictHttpResponse<Transaction>) => r.body as Transaction)
    );
  }

  /**
   * Path part for operation postApiTransactionList
   */
  static readonly PostApiTransactionListPath = '/api/transaction/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiTransactionList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransactionList$Response(params: {
      body: TransactionsRequest
  }): Observable<StrictHttpResponse<Array<TransactionListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiTransactionListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TransactionListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiTransactionList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransactionList(params: {
      body: TransactionsRequest
  }): Observable<Array<TransactionListItem>> {

    return this.postApiTransactionList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TransactionListItem>>) => r.body as Array<TransactionListItem>)
    );
  }

  /**
   * Path part for operation postApiTransactionCount
   */
  static readonly PostApiTransactionCountPath = '/api/transaction/count';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiTransactionCount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransactionCount$Response(params: {
      body: TransactionsCountRequest
  }): Observable<StrictHttpResponse<CountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiTransactionCountPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiTransactionCount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiTransactionCount(params: {
      body: TransactionsCountRequest
  }): Observable<CountResponse> {

    return this.postApiTransactionCount$Response(params).pipe(
      map((r: StrictHttpResponse<CountResponse>) => r.body as CountResponse)
    );
  }

  /**
   * Path part for operation postApiMessage
   */
  static readonly PostApiMessagePath = '/api/message';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiMessage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessage$Response(params: {
      body: LimitedIdRequest
  }): Observable<StrictHttpResponse<Array<Message>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiMessagePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Message>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiMessage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessage(params: {
      body: LimitedIdRequest
  }): Observable<Array<Message>> {

    return this.postApiMessage$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Message>>) => r.body as Array<Message>)
    );
  }

  /**
   * Path part for operation postApiMessageList
   */
  static readonly PostApiMessageListPath = '/api/message/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiMessageList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessageList$Response(params: {
      body: MessagesRequest
  }): Observable<StrictHttpResponse<Array<MessageListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiMessageListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<MessageListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiMessageList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessageList(params: {
      body: MessagesRequest
  }): Observable<Array<MessageListItem>> {

    return this.postApiMessageList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<MessageListItem>>) => r.body as Array<MessageListItem>)
    );
  }

  /**
   * Path part for operation postApiMessageCount
   */
  static readonly PostApiMessageCountPath = '/api/message/count';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiMessageCount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessageCount$Response(params: {
      body: MessagesCountRequest
  }): Observable<StrictHttpResponse<CountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiMessageCountPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiMessageCount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiMessageCount(params: {
      body: MessagesCountRequest
  }): Observable<CountResponse> {

    return this.postApiMessageCount$Response(params).pipe(
      map((r: StrictHttpResponse<CountResponse>) => r.body as CountResponse)
    );
  }

  /**
   * Path part for operation postApiSearchMessage
   */
  static readonly PostApiSearchMessagePath = '/api/search/message';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiSearchMessage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiSearchMessage$Response(params: {
      body: SearchRequest
  }): Observable<StrictHttpResponse<Array<SearchResponseMessageItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiSearchMessagePath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<SearchResponseMessageItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiSearchMessage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiSearchMessage(params: {
      body: SearchRequest
  }): Observable<Array<SearchResponseMessageItem>> {

    return this.postApiSearchMessage$Response(params).pipe(
      map((r: StrictHttpResponse<Array<SearchResponseMessageItem>>) => r.body as Array<SearchResponseMessageItem>)
    );
  }

  /**
   * Path part for operation postApiBlock
   */
  static readonly PostApiBlockPath = '/api/block';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiBlock()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlock$Response(params: {
      body: IdRequest
  }): Observable<StrictHttpResponse<Block>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiBlockPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Block>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiBlock$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlock(params: {
      body: IdRequest
  }): Observable<Block> {

    return this.postApiBlock$Response(params).pipe(
      map((r: StrictHttpResponse<Block>) => r.body as Block)
    );
  }

  /**
   * Path part for operation postApiBlockBySeqno
   */
  static readonly PostApiBlockBySeqnoPath = '/api/block/by-seqno';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiBlockBySeqno()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlockBySeqno$Response(params: {
      body: BlockRequest
  }): Observable<StrictHttpResponse<Block>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiBlockBySeqnoPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Block>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiBlockBySeqno$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlockBySeqno(params: {
      body: BlockRequest
  }): Observable<Block> {

    return this.postApiBlockBySeqno$Response(params).pipe(
      map((r: StrictHttpResponse<Block>) => r.body as Block)
    );
  }

  /**
   * Path part for operation postApiBlockLatest
   */
  static readonly PostApiBlockLatestPath = '/api/block/latest';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiBlockLatest()` instead.
   *
   * This method doesn't expect any request body.
   */
  postApiBlockLatest$Response(params?: {

  }): Observable<StrictHttpResponse<Block>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiBlockLatestPath, 'post');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Block>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiBlockLatest$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  postApiBlockLatest(params?: {

  }): Observable<Block> {

    return this.postApiBlockLatest$Response(params).pipe(
      map((r: StrictHttpResponse<Block>) => r.body as Block)
    );
  }

  /**
   * Path part for operation postApiBlockZerostate
   */
  static readonly PostApiBlockZerostatePath = '/api/block/zerostate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiBlockZerostate()` instead.
   *
   * This method doesn't expect any request body.
   */
  postApiBlockZerostate$Response(params?: {

  }): Observable<StrictHttpResponse<BlockState>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiBlockZerostatePath, 'post');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BlockState>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiBlockZerostate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  postApiBlockZerostate(params?: {

  }): Observable<BlockState> {

    return this.postApiBlockZerostate$Response(params).pipe(
      map((r: StrictHttpResponse<BlockState>) => r.body as BlockState)
    );
  }

  /**
   * Path part for operation postApiBlockList
   */
  static readonly PostApiBlockListPath = '/api/block/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiBlockList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlockList$Response(params: {
      body: BlocksRequest
  }): Observable<StrictHttpResponse<Array<BlockListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiBlockListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<BlockListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiBlockList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiBlockList(params: {
      body: BlocksRequest
  }): Observable<Array<BlockListItem>> {

    return this.postApiBlockList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<BlockListItem>>) => r.body as Array<BlockListItem>)
    );
  }

  /**
   * Path part for operation postApiStakeTransactionList
   */
  static readonly PostApiStakeTransactionListPath = '/api/stake-transaction/list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiStakeTransactionList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionList$Response(params: {
      body: StakeTransactionListRequest
  }): Observable<StrictHttpResponse<Array<StakeTransactionListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiStakeTransactionListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<StakeTransactionListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiStakeTransactionList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionList(params: {
      body: StakeTransactionListRequest
  }): Observable<Array<StakeTransactionListItem>> {

    return this.postApiStakeTransactionList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<StakeTransactionListItem>>) => r.body as Array<StakeTransactionListItem>)
    );
  }

  /**
   * Path part for operation postApiStakeTransactionElectionStakes
   */
  static readonly PostApiStakeTransactionElectionStakesPath = '/api/stake-transaction/election-stakes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiStakeTransactionElectionStakes()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionElectionStakes$Response(params: {
      body: ElectionStakesRequest
  }): Observable<StrictHttpResponse<Array<StakeTransactionListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiStakeTransactionElectionStakesPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<StakeTransactionListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiStakeTransactionElectionStakes$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionElectionStakes(params: {
      body: ElectionStakesRequest
  }): Observable<Array<StakeTransactionListItem>> {

    return this.postApiStakeTransactionElectionStakes$Response(params).pipe(
      map((r: StrictHttpResponse<Array<StakeTransactionListItem>>) => r.body as Array<StakeTransactionListItem>)
    );
  }

  /**
   * Path part for operation postApiStakeTransactionsTotalStakes
   */
  static readonly PostApiStakeTransactionsTotalStakesPath = '/api/stake-transactions/total-stakes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiStakeTransactionsTotalStakes()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionsTotalStakes$Response(params: {
      body: TotalStakesRequest
  }): Observable<StrictHttpResponse<Array<TotalStakeListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiStakeTransactionsTotalStakesPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<TotalStakeListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiStakeTransactionsTotalStakes$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionsTotalStakes(params: {
      body: TotalStakesRequest
  }): Observable<Array<TotalStakeListItem>> {

    return this.postApiStakeTransactionsTotalStakes$Response(params).pipe(
      map((r: StrictHttpResponse<Array<TotalStakeListItem>>) => r.body as Array<TotalStakeListItem>)
    );
  }

  /**
   * Path part for operation postApiStakeTransactionCount
   */
  static readonly PostApiStakeTransactionCountPath = '/api/stake-transaction/count';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiStakeTransactionCount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionCount$Response(params: {
      body: StakeTransactionCountRequest
  }): Observable<StrictHttpResponse<CountResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiStakeTransactionCountPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CountResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiStakeTransactionCount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiStakeTransactionCount(params: {
      body: StakeTransactionCountRequest
  }): Observable<CountResponse> {

    return this.postApiStakeTransactionCount$Response(params).pipe(
      map((r: StrictHttpResponse<CountResponse>) => r.body as CountResponse)
    );
  }

  /**
   * Path part for operation postApiValidatorGetAccounts
   */
  static readonly PostApiValidatorGetAccountsPath = '/api/validator/get-accounts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiValidatorGetAccounts()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiValidatorGetAccounts$Response(params: {
      body: ValidatorAccountsRequest
  }): Observable<StrictHttpResponse<ValidatorAccountsResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiValidatorGetAccountsPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ValidatorAccountsResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiValidatorGetAccounts$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiValidatorGetAccounts(params: {
      body: ValidatorAccountsRequest
  }): Observable<ValidatorAccountsResponse> {

    return this.postApiValidatorGetAccounts$Response(params).pipe(
      map((r: StrictHttpResponse<ValidatorAccountsResponse>) => r.body as ValidatorAccountsResponse)
    );
  }

  /**
   * Path part for operation postApiElectionDatesList
   */
  static readonly PostApiElectionDatesListPath = '/api/election-dates-list';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `postApiElectionDatesList()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiElectionDatesList$Response(params: {
      body: ElectionDatesRequest
  }): Observable<StrictHttpResponse<Array<number>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.PostApiElectionDatesListPath, 'post');
    if (params) {


      rb.body(params.body, 'application/json');
    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<number>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `postApiElectionDatesList$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  postApiElectionDatesList(params: {
      body: ElectionDatesRequest
  }): Observable<Array<number>> {

    return this.postApiElectionDatesList$Response(params).pipe(
      map((r: StrictHttpResponse<Array<number>>) => r.body as Array<number>)
    );
  }

  /**
   * Path part for operation getApiValidatorsPastElections
   */
  static readonly GetApiValidatorsPastElectionsPath = '/api/validators/past-elections';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApiValidatorsPastElections()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiValidatorsPastElections$Response(params?: {

  }): Observable<StrictHttpResponse<Array<PastElectionListItem>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetApiValidatorsPastElectionsPath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<PastElectionListItem>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApiValidatorsPastElections$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiValidatorsPastElections(params?: {

  }): Observable<Array<PastElectionListItem>> {

    return this.getApiValidatorsPastElections$Response(params).pipe(
      map((r: StrictHttpResponse<Array<PastElectionListItem>>) => r.body as Array<PastElectionListItem>)
    );
  }

  /**
   * Path part for operation getApiValidatorsState
   */
  static readonly GetApiValidatorsStatePath = '/api/validators/state';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApiValidatorsState()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiValidatorsState$Response(params?: {

  }): Observable<StrictHttpResponse<ValidatorsState>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetApiValidatorsStatePath, 'get');
    if (params) {


    }
    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ValidatorsState>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApiValidatorsState$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApiValidatorsState(params?: {

  }): Observable<ValidatorsState> {

    return this.getApiValidatorsState$Response(params).pipe(
      map((r: StrictHttpResponse<ValidatorsState>) => r.body as ValidatorsState)
    );
  }

}
