export interface NgxSpeedtestProgress {
  type: "download"|"upload"|"latency";
  pass: number;
  percentDone: number;
  currentSpeed: number;
  maxSpeed: number;
}
