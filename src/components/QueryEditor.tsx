import React, { useEffect, useState, useMemo } from 'react';
import { Input, InlineField, InlineFieldRow, Combobox } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { QueryType, PulsarQuery, PulsarApp, Geo } from '../types';
import { metricTypeDisplayName, aggTypeDisplayName, getGeoList } from '../utils';

// Define the props for the QueryEditor component
type Props = QueryEditorProps<DataSource, PulsarQuery>;

export function QueryEditor({ query, onChange, onRunQuery, data }: Props) {
  // Initialize geoList using useState to ensure it's created once
  const [geoList] = useState<Geo[]>(getGeoList());

  // Extract appJobOptions from data. This array contains available applications and their jobs.
  // It's cast to PulsarApp[] as per the expected type.
   const appJobOptions = useMemo(() => (
    Array.isArray(data?.series?.[0]?.meta?.custom)
      ? (data.series[0].meta.custom as PulsarApp[])
      : []
  ), [data]);

  // useEffect hook to trigger an initial fetch of apps and jobs.
  // or if appJobOptions is empty, ensuring the dropdowns are populated.
  useEffect(() => {
  if (!appJobOptions?.length) {
    onChange({ ...query, queryType: QueryType.INITIAL_APPS_JOBS_FETCH });
    onRunQuery();
  }
}, [appJobOptions.length, onChange, onRunQuery, query]);

  // useEffect hook to clean up selected app/job/geo/asn if the underlying data changes
  // (e.g., if an app or job is no longer available after a data refresh).
  useEffect(() => {
    // Find the currently selected app and job in the updated appJobOptions.
    const app = appJobOptions.find((a) => a.appid === query.appid);
    const job = app?.jobs?.find((j) => j.jobid === query.jobid);

    // If the queryType was for initial fetch, reset it to undefined after data is potentially loaded.
    if (query.queryType === QueryType.INITIAL_APPS_JOBS_FETCH) {
      onChange({ ...query, queryType: undefined });
    }

    // If an app was selected but is no longer valid, clear both appid and jobid.
    if (query.appid && !app) {
      onChange({ ...query, appid: undefined, jobid: undefined });
    }
    // If a job was selected but is no longer valid (or its parent app was cleared), clear jobid.
    else if (query.jobid && !job) {
      onChange({ ...query, jobid: undefined });
    }
  }, [data, appJobOptions, onChange, onRunQuery, query]); // Depend on 'data' and 'appJobOptions' to re-evaluate when they change.

  // useEffect hook to re-run the query automatically when core selection fields change.
  // This ensures the panel updates with new data as the user makes selections.
  useEffect(() => {
    // Only run the query if all essential fields are selected.
    if (query.appid && query.jobid && query.metricType && query.agg) {
      onRunQuery();
    }
  }, [query.appid, query.jobid, query.metricType, query.agg, query.geo, query.asn, onRunQuery]); // Depend on all relevant query fields and onRunQuery.

  /**
   * Handles changes for Segment components (App, Job, Metric, Aggregation, Geo).
   * It updates the query state and applies specific logic for appid and geo changes.
   * @param field The key of the PulsarQuery field to update.
   * @returns A function that takes the Segment's value and updates the query.
   */
  const onSegmentChange = (field: keyof PulsarQuery) => (value: string | null) => {
    let updatedQuery: PulsarQuery = {
      ...query,
      [field]: value || undefined, // Set the field to the new value or undefined if null.
    };

    // Special logic: If the app changes, reset the job selection to avoid invalid states.
    if (field === 'appid') {
      // Only reset jobid if the new appid is different from the old one.
      updatedQuery.jobid = value === query.appid ? query.jobid : undefined;
    }

    // Special logic: If geo is cleared, also clear the ASN field.
    if (field === 'geo' && !value) {
      updatedQuery.asn = undefined;
    }

    // Update the parent component's query state.
    onChange(updatedQuery);
  };

  return (
    <>
      {/* First row of query options: App, Job, Metric */}
      <InlineFieldRow>
        <InlineField label="App" grow>
          <Combobox
            placeholder="Select a Pulsar App"
            options={appJobOptions.map((app) => ({
              label: `${app.name} (${app.appid})`, // Display app name and ID
              value: app.appid,
            }))}
            value={query.appid}
            onChange={(v) => onSegmentChange('appid')(v.value ?? null)}
          />
        </InlineField>
        <InlineField label="Job" grow>
          <Combobox
            placeholder="Select a Pulsar Job"
            options={
              // Filter jobs based on the selected appid
              appJobOptions
                .find((app) => app.appid === query.appid)
                ?.jobs?.map((job) => ({
                  label: `${job.name} (${job.jobid})`, // Display job name and ID
                  value: job.jobid,
                })) || [] // If no app selected or no jobs, provide an empty array
            }
            value={query.jobid}
            onChange={(v) => onSegmentChange('jobid')(v.value ?? null)}
          />
        </InlineField>
        <InlineField label="Metric" grow>
          <Combobox
            placeholder="Select a metric type"
            options={Object.entries(metricTypeDisplayName).map(([key, label]) => ({
              label,
              value: key,
            }))}
            value={query.metricType}
            onChange={(v) => onSegmentChange('metricType')(v.value ?? null)}
          />
        </InlineField>
      </InlineFieldRow>

      {/* Second row of query options: Aggregation, Geo, ASN */}
      <InlineFieldRow>
        <InlineField label="Aggregation" grow>
          <Combobox
            placeholder="Select an aggregation"
            options={Object.entries(aggTypeDisplayName).map(([key, label]) => ({
              label,
              value: key,
            }))}
            value={query.agg}
            onChange={(v) => onSegmentChange('agg')(v.value ?? null)}
          />
        </InlineField>
        <InlineField label="Geo" grow>
          <Combobox
            placeholder="Select geo (optional)"
            options={geoList.map((geo) => ({
              label: `${getUnicodeFlagIcon(geo.code)} ${geo.name}`, // Display geo name and code
              value: geo.code,
            }))}
            value={query.geo}
            onChange={(v) => onSegmentChange('geo')(v.value ?? null)}
          />
        </InlineField>
        <InlineField label="ASN" disabled={!query.geo} grow>
          <Input
            placeholder={
              !query.geo ? 'Select geo first' : 'Leave blank or use * for all ASNs'
            }
            value={query.asn || ''} // Display current ASN or empty string if undefined
            onChange={(e) => onChange({ ...query, asn: e.currentTarget.value || undefined })}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
}
