import { DataSourcePlugin } from '@grafana/data';
import { LDDataSource } from './datasource';
import { LDQuery, LDDataSourceOptions } from './types';
import {ConfigEditor} from "./ConfigEditor";

export const plugin = new DataSourcePlugin<LDDataSource, LDQuery, LDDataSourceOptions>(LDDataSource).setConfigEditor(ConfigEditor);
