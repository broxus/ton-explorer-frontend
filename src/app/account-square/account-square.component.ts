import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-account-square',
  templateUrl: './account-square.component.html',
  styleUrls: ['./account-square.component.scss']
})
export class AccountSquareComponent implements OnInit {

  @Input() address: string;
  @Input() size = 4;
  colors: string[];

  constructor() { }

  ngOnInit(): void {
    this.colors = [];
    for (let i = 0; i < 16; i++) {
      this.colors.push('#' +
        this.address[0] + this.address[i * 4] +
        this.address[i * 4 + 1] + this.address[i * 4 + 2] +
        this.address[63] + this.address[i * 4 + 3]);
    }
  }

}
