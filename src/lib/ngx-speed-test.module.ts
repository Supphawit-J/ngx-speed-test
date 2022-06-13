import {NgModule} from '@angular/core';
import {NgxSpeedTestService} from "./ngx-speed-test.service";
import { SpeedtestApiConfigComponent } from './speedtest-api-config/speedtest-api-config.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatDividerModule} from "@angular/material/divider";


@NgModule({
  declarations: [
    SpeedtestApiConfigComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatDividerModule,
  ],
  exports: [
    SpeedtestApiConfigComponent,
  ],
  providers: [
    NgxSpeedTestService
  ]
})
export class NgxSpeedTestModule {
}
