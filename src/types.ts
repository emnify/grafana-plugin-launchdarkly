import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface LDQuery extends DataQuery {
  project: string,
  environment: string,
  flag: string,
  tag: string,
}

export const defaultQuery: Partial<LDQuery> = {
  project: "*",
  environment: "*",
  flag: "*",
  tag: "*",
};

/**
 * These are options configured for each DataSource instance
 */
export interface LDDataSourceOptions extends DataSourceJsonData {
  project?: string;
  environment?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface LDSecureJsonData {
  apiKey?: string;
}
