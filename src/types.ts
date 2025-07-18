import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export enum MetricType {
  PERFORMANCE = 'performance',
  AVAILABILITY = 'availability',
}

export enum AggType {
  AVG = 'avg',
  MAX = 'max',
  MIN = 'min',
  P50 = 'p50',
  P75 = 'p75',
  P90 = 'p90',
  P95 = 'p95',
  P99 = 'p99',
}

export enum QueryType {
  INITIAL_APPS_JOBS_FETCH = 'initialAppsJobsFetch',
  REGULAR = 'regular',
}

export interface PulsarApp {
  name: string;
  appid: string;
  jobs?: PulsarJob[];
}

export interface PulsarJob {
  name: string;
  jobid: string;
}

export interface PulsarQuery extends DataQuery {
  appid?: string;
  jobid?: string;
  metricType?: MetricType;
  agg?: string;
  geo?: string;
  asn?: string;
}

export interface Geo {
  name: string;
  code: string;
  flag?: string;
}
export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
}

export const DEFAULT_QUERY: Partial<MyQuery> = {
  constant: 6.5,
};

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface DataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
