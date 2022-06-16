export interface NgxSpeedtestConfig {
  domainName: string;
  apiKey: string;
  config?: {
    sustainTime?: number,
    testServerEnabled?: boolean,
    userInfoEnabled?: boolean
    latencyTestEnabled?: boolean,
    uploadTestEnabled?: boolean,
    progress?: { enabled?: boolean, verbose?: boolean },
  };
}
