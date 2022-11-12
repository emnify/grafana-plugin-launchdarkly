import React, { ChangeEvent } from 'react';

import { QueryEditorProps } from '@grafana/data';
import { EditorField, EditorRow } from '@grafana/experimental';
import { Input } from '@grafana/ui';

import { LDDataSource } from '../datasource';
import { LDQuery } from '../types';

export type Props = QueryEditorProps<LDDataSource, LDQuery>;

export const LDAnnotationQueryEditor = (props: Props) => {
    const { query, onChange } = props;

    return (
        <>
            <EditorRow>
                <EditorField label="Tag" width={26} tooltip="Limit flags to specific tag">
                    <Input
                        value={query.tag || ''}
                        placeholder="*"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ ...query, tag: event.target.value })}
                    />
                </EditorField>
            </EditorRow>
        </>
    );
};
