# NgxSpeedTest v1.1

Library for check internet speed test, this library using [speedof.me](https://speedof.me/index.html) API for
development. This library base on [Angular Material](https://v13.material.angular.io/)

See more: 
[npm](https://www.npmjs.com/package/@supphawit-j/ngx-speed-test)
[GitHub](https://github.com/Supphawit-J/ngx-speed-test)

## Install

```
npm i @supphawit-j/ngx-speed-test
```

## API reference
### NgxSpeedTestModule

In order to use this library, you need to import `NgxSpeedTestModule` to your module.

app.module.ts

```ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxSpeedTestModule} from "ngx-speed-test";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpeedTestModule.forRoot({domainName: 'localhost', apiKey: 'SOMxxxxxxxxxxx'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```
See more: [SpeedOf.Me API Documentation](https://speedof.me/api/doc/SpeedOfMe_API_Doc.pdf)

### NgxSpeedtestConfig

This is a list of configuration for setting the library.

```ts
export interface NgxSpeedtestConfig {
  domainName: string;
  apiKey: string;
  config?: {
    sustainTime?: number,
    testServerEnabled?: boolean,
    userInfoEnabled?: boolean
    latencyTestEnabled?: boolean,
    uploadTestEnabled?: boolean,
    progress?: { enabled?: boolean, verbose?: boolean },
  };
}
```

#### Default:

```ts
apiConfig = {
  domainName: '',
  apiKey: '',
  config: {
    latencyTestEnabled: true,
    maxTestPass: 4,
    progress: {
      enabled: true,
      verbose: true
    },
    sustainTime: 4,
    testServerEnabled: true,
    uploadTestEnabled: true,
    userInfoEnabled: true
  },
  showBtn: true,
  showUI: true,
  autoStart: false,
  available: -1
}
```

### NgxSpeedtestProgress

This is an object you will get while the API is in progress.

```ts
export interface NgxSpeedtestProgress {
  type: "download" | "upload" | "latency";
  pass: number;
  percentDone: number;
  currentSpeed: number;
  maxSpeed: number;
}
```

### NgxSpeedtestResult

This is an object you will get while the API has done.

```ts
export interface NgxSpeedtestResult {
  hostname: string;
  ip_address: string;
  latency: number;
  download: number;
  maxDownload: number;
  upload: number;
  maxUpload: number;
  jitter: number;
  testDate: string;
  testServer: string;
  userAgent: string;
}
```

### SpeedTestComponent

selector: `<ngx-speed-test>`

#### Additional properties

| Name                                          | Description                                                        |
|-----------------------------------------------|--------------------------------------------------------------------|
| @Input() showBtn: `boolean`                   | button display setup, `true` by default                            |
| @Input() showUI: `boolean`                    | UI display setup, `false` by default                               |
| @Input() available: `boolean`                 | test attempt , `-1` ( equal to unlimited test attempt ) by default |
| @Input() autoStart: `boolean`                 | automatically start internet speed test, `false` by default        |
| @Input() start: `boolean`                     | API trigger, `false` by default                                    |
| @Output() started: `boolean`                  | return `true` when API is executed                                 |
| @Output() progressing: `NgxSpeedtestProgress` | return `NgxSpeedtestProgress` object when speed test is running    |
| @Output() completed: `NgxSpeedtestResult`     | return `NgxSpeedtestResult` object when speed test has done        |

## Usage

### Import NgxSpeedTestModule and setup API configuration


app.module.ts
```ts
// other imports
import {NgxSpeedTestModule} from "ngx-speed-test";
import {config} from "rxjs";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // other imports
    NgxSpeedTestModule.forRoot('configuration: NgxSpeedtestConfig')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```
> Note: ***domainName*** and ***apiKey*** are **required**. If you don't set other property except ***domainName*** and ***apiKey***, then default configuration will be apply.

**Example**

app.module.ts
```ts
// other imports
import {NgxSpeedTestModule} from "ngx-speed-test";
import {config} from "rxjs";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // other imports
    NgxSpeedTestModule.forRoot({domainName: 'localhost', apiKey: 'SOMxxxxxxxxxxx'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

```


app.component.html

```html

<ngx-speedtest-api-config [config]="apiConfig"></ngx-speedtest-api-config>
```

### Logging data

- Add ***started*** output decorator, if you want to know when speed test has started.

- Add ***progressing*** output decorator, if you want to get progress of speed test.

- Add ***completed*** output decorator, if you want to get result of speed test.

app.component.ts

```ts
import {NgxSpeedtestResult, NgxSpeedtestProgress} from "ngx-speed-test";

export class AppCompomemt implements Oninit {
    
  ngOnInit() {
  }

  started(out: boolean) {
    console.log(out);
  }

  logProgress(out: NgxSpeedtestProgress) {
    console.log(out);
  }

  logResult(out: NgxSpeedtestResult) {
    console.log(out);
  }

}
```

app.component.html

```html

<ngx-speedtest-api-config
  [config]="apiConfig"
  (started)="started($event)"
  (progressing)="logProgress($event)"
  (completed)="logResult($event)">
</ngx-speedtest-api-config>
```

### UI Management

NgxSpeedTest has build in UI component.

![NGX Speed test Example](./ngx-speed-test-example.png "NGX Speed test Example")

- Add ***showBtn*** input decorator with value `false`, if you want to hide button.

- Add ***showUI*** input decorator with value `false` , if you want to hide UI of `ngx-speed-test`.

### Apply Limit

- Add ***available*** input decorator with positive integer , if you want to set internet speed test attempt.

> Note: If you don't set limitation, then API will use default value which is allowed user to run test as much as possible.

### Automatic Run Speed Test

- Add ***autoStart*** input decorator with value `true` , if you want to automatically start internet speed test.

> Note: This won't reduce the times that you can run speed test if you've set the limit.

### Programmatically & Manually Run Speed Test

- Add ***start*** input decorator with value `true` , if you want to start internet speed test.
> Note: You can only apply boolean value or function that return boolean as a value to this input decorator. And default value is `false`

app.component.ts

```ts
export class AppCompomemt implements Oninit {

  apiConfig: NgxSpeedtestConfig;
  go: boolean = false;

  ngOnInit() {
  }
  
}
```

app.component.html

```html

<ngx-speedtest-api-config [config]="apiConfig" [start]="go"></ngx-speedtest-api-config>
<button type="button" (click)="go = !go" mat-raised-button color="primary">go</button>
```

## About me

### GitHub

[@Supphawit-J](https://github.com/Supphawit-J)

### npm

[@ideajeng](https://www.npmjs.com/~ideajeng)

## Credit

[speedof.me](https://speedof.me/index.html)
