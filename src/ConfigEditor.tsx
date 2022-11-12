import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { LDDataSourceOptions, LDSecureJsonData } from './types';

const { SecretFormField, FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<LDDataSourceOptions, LDSecureJsonData> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onEnvironmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      environment: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };
  onProjectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      project: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonData: {
        apiKey: event.target.value,
      },
    });
  };

  onResetAPIKey = () => {
    const { onOptionsChange, options } = this.props;
    onOptionsChange({
      ...options,
      secureJsonFields: {
        ...options.secureJsonFields,
        apiKey: false,
      },
      secureJsonData: {
        ...options.secureJsonData,
        apiKey: '',
      },
    });
  };

  render() {
    const { options } = this.props;
    const { jsonData, secureJsonFields } = options;
    const secureJsonData = (options.secureJsonData || {}) as LDSecureJsonData;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Project Key"
            tooltip="Use * as wildcard"
            labelWidth={10}
            inputWidth={20}
            onChange={this.onProjectChange}
            value={jsonData.project || ''}
            placeholder="*"
          />
        </div>
        <div className="gf-form">
          <FormField
            label="Environment Key"
            tooltip="Use * as wildcard"
            labelWidth={10}
            inputWidth={20}
            onChange={this.onEnvironmentChange}
            value={jsonData.environment || ''}
            placeholder="*"
          />
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <SecretFormField
              isConfigured={Boolean(secureJsonFields && secureJsonFields.apiKey)}
              value={secureJsonData.apiKey || ''}
              label="API Key"
              placeholder="api-xxxxxxxx"
              tooltip="LaunchDarkly Access token with Reader role"
              labelWidth={10}
              inputWidth={20}
              onReset={this.onResetAPIKey}
              onChange={this.onAPIKeyChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
