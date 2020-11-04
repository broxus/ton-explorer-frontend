import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserInfo} from '../api/models/user-info';
import {ApiService} from '../api/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoSharedService {


  private subject = new BehaviorSubject<UserInfo | null>(null);

  constructor(private apiService: ApiService) {
    this.triggerUpdate();
  }

  getSubject() {
    return this.subject;
  }

  triggerUpdate() {
    this.apiService.getApiAuthInfo().toPromise().then(resp => {
      this.subject.next(resp.user);
    });
  }
}
