import {Component, Input, OnInit} from '@angular/core';
import {Transaction} from '../api/models/transaction';

@Component({
  selector: 'app-transaction-messages',
  templateUrl: './transaction-messages.component.html',
  styleUrls: ['./transaction-messages.component.scss']
})
export class TransactionMessagesComponent implements OnInit {

  @Input() transaction: Transaction;

  constructor() { }

  ngOnInit(): void {
  }

}
