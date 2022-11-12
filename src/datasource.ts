import {getBackendSrv} from "@grafana/runtime"

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  MutableDataFrame, renderMarkdown,
} from '@grafana/data';

import {defaultQuery, LDDataSourceOptions, LDQuery} from './types';
import {LDAnnotationQueryEditor} from "./components/LDAnnotationsQueryEditor";
import {defaults} from "lodash";

export class LDDataSource extends DataSourceApi<LDQuery, LDDataSourceOptions> {
  project?: string;
  environment?: string;
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<LDDataSourceOptions>) {
    super(instanceSettings);
    // this.annotations = LDAnnotationSupport(this)
    this.annotations = {
      QueryEditor: LDAnnotationQueryEditor
    }
    this.project = instanceSettings.jsonData.project;
    this.environment = instanceSettings.jsonData.environment;
    this.url = instanceSettings.url

  }


  async testDatasource() {
    // TODO Implement a health check for your data source.
    return {};
  }

  async query(options: DataQueryRequest<LDQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map((query) =>
        // TODO I have the feeling that defaults(query, defaultQuery) doesn't do anything here..
        this.doRequest(defaults(query, defaultQuery), options).then((response) => {

          // TODO better implement pagination
          if (response.data._links.next) {
            throw new Error("More than 20 items returned from LaunchDarkly API for selected time range. Please choose smaller range, as pagination support for LD API is not implemented, yet.")
          }

          const frame = new MutableDataFrame({
            refId: query.refId,
            fields: [
              { name: "time", type: FieldType.time },
              { name: "text", type: FieldType.string},
              { name: "kind", type: FieldType.string},
              { name: "tags", type: FieldType.string},
              { name: "id", type: FieldType.string},
            ],
          });
          response.data.items.forEach((item: any) => {
            const text = renderMarkdown(item.title) + renderMarkdown(item.description)
            const tags = (item.accesses[0].resource as string).split(";").pop()

            frame.appendRow([
              item.date,
              text,
              item.kind,
              tags,
              item._id,
            ]);
          });

          return frame;
        })
    );
    return Promise.all(promises).then((data) => ({ data }));
  }

  async doRequest(query: LDQuery, options: DataQueryRequest<LDQuery>) {
    const routePath = '/launchdarkly';

    const spec = `proj/${this.project}:env/${this.environment}:flag/*;${query.tag}`

    const result = await getBackendSrv().datasourceRequest({
      method: "GET",
      url: this.url + routePath + '/api/v2/auditlog',
      // for debugging to see LD requests in browser
      // url: "https://app.launchdarkly.com/api/v2/auditlog",
      // headers: {
      //   Authorization: 'api-xxxxxxxxx'
      // },
      params: {
        after: options.range.from.unix() * 1000,
        before: options.range.to.unix() * 1000,
        limit: 20,
        // documentation on spec: https://docs.launchdarkly.com/home/members/role-resources
        spec: spec
      }
    })

    return result;
  }
}
