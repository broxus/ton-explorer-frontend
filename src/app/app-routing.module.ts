import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {BlockPageComponent} from './block-page/block-page.component';
import {BlocksListComponent} from './blocks-list/blocks-list.component';
import {TransactionsListComponent} from './transactions-list/transactions-list.component';
import {TransactionPageComponent} from './transaction-page/transaction-page.component';
import {MessagesListComponent} from './messages-list/messages-list.component';
import {AccountsListComponent} from './accounts-list/accounts-list.component';
import {AccountPageComponent} from './account-page/account-page.component';
import {ValidatorsListComponent} from './validators-list/validators-list.component';
import {ValidatorPageComponent} from './validator-page/validator-page.component';
import {MessagePageComponent} from './message-page/message-page.component';
import {StakesListComponent} from './stakes-list/stakes-list.component';
import {AuthComponent} from './auth/auth.component';


const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'blocks', component: BlocksListComponent},
  {path: 'blocks/:id', component: BlockPageComponent},
  {path: 'blocks/:workchain/:shard/:seqno', component: BlockPageComponent},
  {path: 'validators/transactions', component: TransactionsListComponent},
  {path: 'stake-actions', component: StakesListComponent},
  {path: 'transactions', component: TransactionsListComponent},
  {path: 'transactions/:id', component: TransactionPageComponent},
  {path: 'transactions/:transactionId/:out', component: MessagePageComponent},
  {path: 'transactions/:transactionId/:out/:n', component: MessagePageComponent},
  {path: 'messages', component: MessagesListComponent},
  {path: 'accounts', component: AccountsListComponent},
  {path: 'accounts/:id', component: AccountPageComponent},
  {path: 'validators', component: ValidatorsListComponent},
  {path: 'validators/:id', component: ValidatorPageComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
