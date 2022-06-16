import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgxSpeedTestService} from "./ngx-speed-test.service";
import {SpeedtestApiConfigComponent} from './speedtest-api-config/speedtest-api-config.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {NgxSpeedtestConfig} from "./interfaces/NgxSpeedtestConfig";


@NgModule({
  declarations: [
    SpeedtestApiConfigComponent,
  ],
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  exports: [
    SpeedtestApiConfigComponent,
  ],
  providers: [
    NgxSpeedTestService
  ]
})
export class NgxSpeedTestModule {
  static forRoot(config: NgxSpeedtestConfig): ModuleWithProviders<NgxSpeedTestModule> {
    return {
      ngModule: NgxSpeedTestModule,
      providers: [
        {provide: 'config', useValue: config}
      ]
    }
  };
}
