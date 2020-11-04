import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from 'src/environments/environment';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit {

  authBot?: string  = environment.authBot;
  authRedirectUrl?: string = environment.authRedirectUrl;

  @ViewChild('widgetWrapper') widgetWrapper: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (environment.authBot && environment.authRedirectUrl) {
      const textScript = this.renderer2.createElement('script');
      textScript.src = 'https://telegram.org/js/telegram-widget.js?12';
      this.renderer2.setAttribute(textScript, 'data-telegram-login', environment.authBot);
      this.renderer2.setAttribute(textScript, 'data-auth-url', environment.rootUrl + environment.authRedirectUrl);
      this.renderer2.setAttribute(textScript, 'data-request-access', 'write');
      this.renderer2.setAttribute(textScript, 'data-size', 'large');
      this.renderer2.appendChild(this.widgetWrapper.nativeElement, textScript);
    }
  }

}
