declare namespace NodeJS {
  interface ProcessEnv {
    readonly IS_OFFLINE: string;
    readonly IS_LOCAL: string;
    readonly GOOGLE_API_KEY: string;
    readonly GOOGLE_CUSTOM_SEARCH_ENGINE_ID: string;
    readonly S3_BUCKET_LGTMS: string;
    readonly DYNAMODB_TABLE_LGTMS: string;
    readonly DYNAMODB_TABLE_REPORTS: string;
  }
}
