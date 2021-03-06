import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {NgxSpeedtestConfig} from "./interfaces/NgxSpeedtestConfig";
import {BehaviorSubject, Observable} from "rxjs";
import {NgxSpeedtestResult} from "./interfaces/NgxSpeedtestResult";
import {NgxSpeedtestProgress} from "./interfaces/NgxSpeedtestProgress";

declare var SomApi: any;

@Injectable({
  providedIn: 'root'
})
export class NgxSpeedTestService {

  public testCompleted: Observable<NgxSpeedtestResult>;
  public progressInfo: Observable<NgxSpeedtestProgress>;
  private renderer: Renderer2;
  private speedMeScript = '//speedof.me/api/api.js';
  private resultSubject: BehaviorSubject<NgxSpeedtestResult> = new BehaviorSubject<NgxSpeedtestResult>(null!);
  private progressSubject: BehaviorSubject<NgxSpeedtestProgress> = new BehaviorSubject<NgxSpeedtestProgress>(null!);
  private readonly setup: NgxSpeedtestConfig = {
    domainName: '',
    apiKey: '',
    config: {
      sustainTime: 4,
      testServerEnabled: true,
      userInfoEnabled: true,
      latencyTestEnabled: true,
      uploadTestEnabled: true,
      progress: {
        enabled: true,
        verbose: true
      },
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document, rendererFactory: RendererFactory2,
    @Inject('config') private config: NgxSpeedtestConfig
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.testCompleted = this.resultSubject.asObservable();
    this.progressInfo = this.progressSubject.asObservable();
    this.setup = {...this.setup, ...config};
  }

  loadJsScript(): Promise<any> {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = this.speedMeScript;
    this.renderer.appendChild(this.document.body, script);

    return new Promise((resolve, reject) => {

      if (this.setup) {
        script.onload = () => {

          SomApi.account = this.setup.apiKey;
          SomApi.domainName = this.setup.domainName;
          SomApi.config = this.setup.config;

          SomApi.onTestCompleted = (res: any): void => {

            const result: NgxSpeedtestResult = this.responsePipe(res);

            this.resultSubject.next(result);
          };

          SomApi.onProgress = (res: any): void => {

            const progress: NgxSpeedtestProgress = this.responsePipe(res);

            this.progressSubject.next(progress);
          };

          SomApi.onError = (error: any): void => {
            throw new error
          };

          resolve(true);
        }

        script.onerror = () => {
          reject(false);
        }
      } else {
        reject(false);
      }
    });
  }

  responsePipe(res: any) {
    Object.keys(res).map(key => {
      if (String(res[key]) === '') {
        res[key] = null
      }
    });

    return res;
  }

  runTest(): void {
    SomApi.startTest();
  }


}
