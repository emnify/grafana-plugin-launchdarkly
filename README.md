# LaunchDarkly Plugin for Grafana

A Grafana Data Source Plugin for displaying LaunchDarkly flag changes as annotations.


## Project Status

⚠️ This is a slack time project and we are not yet clear about the feature of this.

## Limitations & Ideas

Relevant for EMnify:

- allow to specify multiple tags with _OR_ conjunction. Currently, specifying `tag1,tag2` will require that a flag is tagged with both tags, not one or the other. This is a limitation in the LD API. 
- Query audit log for segment changes
- understand defaultQuery (tutorial vs. other plugins)

Potentially relevant for others:

- specify project and environment per dashboard instead of per Data Source
- other options to query flag than the key, e.g., prefix or text
- implement Data Source Test functionality

Nice to have:

- list projects and environments in configuration editors by querying them from LD
- [Migrate from BackendSrv.datasourceRequest() to BackendSrv.fetch()](https://community.grafana.com/t/how-to-migrate-from-backendsrv-datasourcerequest-to-backendsrv-fetch/58770)
- implement pagination for audit log (to show more than 20 changes, instead of an error)
- update dashboard after changing annotation settings (is it possible?)

## Implementation

Queryies the [auditlog API](https://apidocs.launchdarkly.com/tag/Audit-log#operation/getAuditLogEntries):

```
/api/v2/auditlog?before=1668207599999&after=1662847200000&spec=proj%2F%2A%3Aenv%2F%2A%3Aflag%2F%2A%3Btag1
```

## Development

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```