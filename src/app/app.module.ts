import {BrowserModule} from '@angular/platform-browser';
import {forwardRef, NgModule, Provider} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AlertModule, BsDropdownModule, PaginationModule} from 'ngx-bootstrap';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {ApiModule} from './api/api.module';
import {MainPageComponent} from './main-page/main-page.component';
import {BlockPageComponent} from './block-page/block-page.component';
import {BlocksListComponent} from './blocks-list/blocks-list.component';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {NumberWithSpacesPipe} from './number-with-commas.pipe';
import BigNumber from 'bignumber.js';
import {HashPipe} from './hash.pipe';
import {TimePipe} from './time.pipe';
import {AmountPipe} from './amount.pipe';
import {AddressPipe} from './address.pipe';
import {AccountSquareComponent} from './account-square/account-square.component';
import {HeaderComponent} from './header/header.component';
import {SearchFieldComponent} from './search-field/search-field.component';
import {LanguageSelectComponent} from './language-select/language-select.component';
import {CookieService} from 'ngx-cookie-service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TransactionsListComponent} from './transactions-list/transactions-list.component';
import {TransactionPageComponent} from './transaction-page/transaction-page.component';
import {MessagesListComponent} from './messages-list/messages-list.component';
import {AccountsListComponent} from './accounts-list/accounts-list.component';
import {AccountPageComponent} from './account-page/account-page.component';
import {ValidatorsListComponent} from './validators-list/validators-list.component';
import {ValidatorPageComponent} from './validator-page/validator-page.component';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import {ClipboardModule} from 'ngx-clipboard';
import {TransactionsComponent} from './transactions/transactions.component';
import {MessagesComponent} from './messages/messages.component';
import {ShardPipe} from './shard.pipe';
import {MessagePageComponent} from './message-page/message-page.component';
import {ValidatorsComponent} from './validators/validators.component';
import {StakesComponent} from './stakes/stakes.component';
import {StakesListComponent} from './stakes-list/stakes-list.component';
import {TransactionMessagesComponent} from './transaction-messages/transaction-messages.component';
import {AuthComponent} from './auth/auth.component';
import {environment} from '../environments/environment';
import {AuthInterceptor} from './auth/auth.interceptor';
import {UserInfoSharedService} from './auth/user-info-shared.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

BigNumber.config({ERRORS: false});

export const API_AUTH_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true
};

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    BlockPageComponent,
    BlocksListComponent,
    NumberWithSpacesPipe,
    HashPipe,
    TimePipe,
    AmountPipe,
    AddressPipe,
    ShardPipe,
    AccountSquareComponent,
    HeaderComponent,
    SearchFieldComponent,
    LanguageSelectComponent,
    TransactionsListComponent,
    TransactionPageComponent,
    MessagesListComponent,
    AccountsListComponent,
    AccountPageComponent,
    ValidatorsListComponent,
    ValidatorPageComponent,
    TransactionsComponent,
    MessagesComponent,
    MessagePageComponent,
    ValidatorsComponent,
    StakesComponent,
    StakesListComponent,
    TransactionMessagesComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    NgxQRCodeModule,
    ClipboardModule,
    BsDatepickerModule.forRoot(),
    // TooltipModule.forRoot(),
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ApiModule.forRoot({rootUrl: environment.rootUrl}),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    API_AUTH_PROVIDER,
    AuthInterceptor,
    UserInfoSharedService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
