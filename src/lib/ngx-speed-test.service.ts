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
  private speedMeScript = 'http://speedof.me/api/api.js';
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

  loadJsScript(setup: NgxSpeedtestConfig): Promise<any> {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = this.speedMeScript;
    this.renderer.appendChild(this.document.body, script);

    return new Promise((resolve, reject) => {
      script.onload = () => {

        SomApi.account = setup.apiKey;
        SomApi.domainName = setup.domainName;
        SomApi.config = setup.config;

        if (setup.autoStart){
          SomApi.startTest();
        }

        SomApi.onTestCompleted = (result: NgxSpeedtestResult): void => {
          this.resultSubject.next(result)
        };
        SomApi.onProgress = (info: NgxSpeedtestProgress): void => {
          this.progressSubject.next(info);
        }
        SomApi.onError = (error: any): void => {
          throw new error
        };
      }

      script.onerror = () => {
        reject(false);
      }
    });
  }

  runTest(): void {
    SomApi.startTest();
  }


}
