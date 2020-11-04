import { Component, OnInit } from '@angular/core';
import {UserInfoSharedService} from '../auth/user-info-shared.service';
import {UserInfo} from '../api/models/user-info';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  mobileMenuOpened = false;
  userInfo: UserInfo | null;
  environment = environment;

  constructor(private userInfoSharedService: UserInfoSharedService) { }

  ngOnInit(): void {
    this.userInfoSharedService.getSubject().subscribe(e => this.userInfo = e);
  }

}
