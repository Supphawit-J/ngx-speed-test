export interface NgxSpeedtestConfig {
  domainName: string;
  apiKey: string;
  config?: {
    latencyTestEnabled: boolean,
    maxTestPass: number,
    progress: { enabled: boolean, verbose: boolean },
    sustainTime: number,
    testServerEnabled: boolean,
    uploadTestEnabled: boolean,
    userInfoEnabled: boolean
  },
  showBtn?: boolean;
  showUI?: boolean;
  autoStart?: boolean;
  available?: number
}
