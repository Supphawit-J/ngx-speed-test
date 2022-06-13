import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {NgxSpeedTestService} from "../ngx-speed-test.service";
import {NgxSpeedtestConfig} from "../interfaces/NgxSpeedtestConfig";
import {NgxSpeedtestResult} from "../interfaces/NgxSpeedtestResult";
import {NgxSpeedtestProgress} from "../interfaces/NgxSpeedtestProgress";
import {Subscription} from "rxjs";

class ServiceStatus {
  inProgress: boolean
  available: number

  constructor(private limit: number) {
    this.available = limit;
    this.inProgress = false;
  }

  permission(): boolean {
    return !this.inProgress && (this.available !== 0)
  };

  message(): string {
    if (this.inProgress) {
      return 'In progress...'
    } else if (this.available !== this.limit) {
      return 'Restart';
    } else {
      return `Start`
    }
  }
}

@Component({
  selector: 'ngx-speedtest-api-config',
  templateUrl: './speedtest-api-config.component.html',
  styleUrls: ['./speedtest-api-config.component.scss']
})

export class SpeedtestApiConfigComponent implements OnInit, OnDestroy {

  @Output() completed: EventEmitter<NgxSpeedtestResult> = new EventEmitter<NgxSpeedtestResult>();
  @Output() progressing: EventEmitter<NgxSpeedtestProgress> = new EventEmitter<NgxSpeedtestProgress>();
  @Output() started: EventEmitter<boolean> = new EventEmitter<boolean>();
  subscription: Subscription;

  apiConfig: NgxSpeedtestConfig = {
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

  testInfo = {
    download: 0,
    upload: 0,
    latency: 0,
    ip_address: '',
    testServer: ''
  }

  serviceStatus: ServiceStatus;

  constructor(private service: NgxSpeedTestService, private cdr: ChangeDetectorRef) {

  }

  @Input()
  set config(config: NgxSpeedtestConfig) {
    this.apiConfig = {...this.apiConfig, ...config};
    if (this.apiConfig.domainName && this.apiConfig.apiKey) {
      this.loadAPI(this.apiConfig);
    } else {
      throw new Error('Missing required property');
    }
  }

  @Input() set start(value: boolean) {
    if (value && this.serviceStatus.permission()) {
      this.runTest();
    }
  };

  ngOnInit(): void {

    if (this.apiConfig.available) {
      this.serviceStatus = new ServiceStatus(this.apiConfig.available);

    }
    if (this.apiConfig.autoStart) {
      this.serviceStatus.inProgress = true;
    }

    this.subscription = this.service.testCompleted.subscribe(result => {
      if (result) {
        this.completed.emit(result);
        this.serviceStatus.inProgress = false;
        this.testInfo = {...this.testInfo, ...result}

        this.cdr.detectChanges();
      }
    });

    this.subscription.add(this.service.progressInfo.subscribe(info => {
      if (info) {
        this.progressing.emit(info);
        if (info.type === 'download') {
          this.testInfo.download = info.currentSpeed;
        } else if (info.type === 'upload') {
          this.testInfo.upload = info.currentSpeed;
        }
        this.cdr.detectChanges();

      }
    }));
  }

  async loadAPI(config: NgxSpeedtestConfig): Promise<void> {
    await this.service.loadJsScript(config);
  }

  runTest() {
    this.testInfo = {
      download: 0,
      upload: 0,
      latency: 0,
      ip_address: '',
      testServer: ''
    }

    if (this.serviceStatus.permission()) {
      this.service.runTest();
      this.serviceStatus.inProgress = true;
      this.serviceStatus.available--;
      this.started.emit(true)
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
