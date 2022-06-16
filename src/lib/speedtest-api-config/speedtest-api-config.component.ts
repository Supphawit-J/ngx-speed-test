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
import {NgxSpeedtestResult} from "../interfaces/NgxSpeedtestResult";
import {NgxSpeedtestProgress} from "../interfaces/NgxSpeedtestProgress";
import {from, Subscription} from "rxjs";

class ServiceStatus {
  inProgress: boolean;
  available: number;
  apiLoaded: boolean;

  constructor(private limit: number) {
    this.available = limit;
    this.inProgress = false;
    this.apiLoaded = false;
  }

  permission(): boolean {
    return !this.inProgress && (this.available !== 0) && this.apiLoaded
  };

  message(): string {
    if (this.inProgress) {
      return 'In progress...'
    } else if (this.available !== this.limit && this.limit) {
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

  subscription: Subscription;
  testInfo = {
    download: 0,
    upload: 0,
    latency: 0,
    ip_address: '',
    testServer: ''
  }
  serviceStatus: ServiceStatus;

  @Output() completed: EventEmitter<NgxSpeedtestResult> = new EventEmitter<NgxSpeedtestResult>();
  @Output() progressing: EventEmitter<NgxSpeedtestProgress> = new EventEmitter<NgxSpeedtestProgress>();
  @Output() started: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() showBtn: boolean = true;
  @Input() showUI: boolean = true;
  @Input() autoStart: boolean = false;

  constructor(private service: NgxSpeedTestService, private cdr: ChangeDetectorRef) {
    this.serviceStatus = new ServiceStatus(-1);
  }

  @Input() set available(attempt: number) {
    this.serviceStatus = new ServiceStatus(attempt ?? -1)
  };

  @Input() set start(value: boolean) {
    if (this.serviceStatus) {
      if (value && this.serviceStatus.permission()) {
        this.runTest();
      }
    }
  };

  ngOnInit(): void {

    from(this.service.loadJsScript()).subscribe(api => {
      this.serviceStatus.apiLoaded = !!api;
      if (api && this.autoStart) {
        this.service.runTest();
        this.serviceStatus.inProgress = true;
        this.started.emit(true)
      }
    });

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
