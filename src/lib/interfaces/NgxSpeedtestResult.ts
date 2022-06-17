export interface NgxSpeedtestResult {
  hostname?: string;
  ip_address?: string;
  download: number;
  latency?: number;
  maxDownload: number;
  upload?: number;
  maxUpload?: number;
  jitter?: number;
  testDate?: string;
  testServer?: string;
  userAgent?: string;
}
