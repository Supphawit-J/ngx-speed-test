import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedtestApiConfigComponent } from './speedtest-api-config.component';

describe('SpeedtestApiConfigComponent', () => {
  let component: SpeedtestApiConfigComponent;
  let fixture: ComponentFixture<SpeedtestApiConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeedtestApiConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedtestApiConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
