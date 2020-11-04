import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import BigNumber from 'bignumber.js';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

BigNumber.config({ EXPONENTIAL_AT: 10 });

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
