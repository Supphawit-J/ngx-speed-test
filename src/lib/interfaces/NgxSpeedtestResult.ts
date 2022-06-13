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
