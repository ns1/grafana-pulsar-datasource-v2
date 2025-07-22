import { test, expect } from '@grafana/plugin-e2e';

test('smoke: should render Pulsar Query Editor fields', async ({ panelEditPage, readProvisionedDataSource }) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // Check for App, Job, Metric, Aggregation, Geo, ASN fields
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('App')).toBeVisible();
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('Job')).toBeVisible();
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('Metric')).toBeVisible();
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('Aggregation')).toBeVisible();
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('Geo')).toBeVisible();
  await expect(panelEditPage.getQueryEditorRow('A').getByLabel('ASN')).toBeVisible();
});

test('should trigger new query when App, Job, Metric, and Aggregation are changed', async ({
  panelEditPage,
  readProvisionedDataSource,
}) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // Select App
  await panelEditPage.getQueryEditorRow('A').getByLabel('App').click();
  await panelEditPage.getQueryEditorRow('A').getByLabel('App').selectOption({ index: 0 });

  // Select Job
  await panelEditPage.getQueryEditorRow('A').getByLabel('Job').click();
  await panelEditPage.getQueryEditorRow('A').getByLabel('Job').selectOption({ index: 0 });

  // Select Metric
  await panelEditPage.getQueryEditorRow('A').getByLabel('Metric').click();
  await panelEditPage.getQueryEditorRow('A').getByLabel('Metric').selectOption({ index: 0 });

  // Select Aggregation
  const queryReq = panelEditPage.waitForQueryDataRequest();
  await panelEditPage.getQueryEditorRow('A').getByLabel('Aggregation').click();
  await panelEditPage.getQueryEditorRow('A').getByLabel('Aggregation').selectOption({ index: 0 });
  await expect(await queryReq).toBeTruthy();
});

test('should allow entering ASN only after Geo is selected', async ({ panelEditPage, readProvisionedDataSource }) => {
  const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
  await panelEditPage.datasource.set(ds.name);

  // ASN input should be disabled initially
  const asnInput = panelEditPage.getQueryEditorRow('A').getByLabel('ASN');
  await expect(asnInput).toBeDisabled();

  // Select Geo
  await panelEditPage.getQueryEditorRow('A').getByLabel('Geo').click();
  await panelEditPage.getQueryEditorRow('A').getByLabel('Geo').selectOption({ index: 0 });

  // ASN input should now be enabled
  await expect(asnInput).toBeEnabled();

  // Enter ASN value
  await asnInput.fill('12345');
  await expect(asnInput).toHaveValue('12345');
});
