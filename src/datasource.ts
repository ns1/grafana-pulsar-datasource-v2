import { DataSourceInstanceSettings } from '@grafana/data';
import { DataSourceWithBackend } from '@grafana/runtime';

import { MyDataSourceOptions, PulsarQuery } from './types';

export class DataSource extends DataSourceWithBackend<PulsarQuery> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }
}
