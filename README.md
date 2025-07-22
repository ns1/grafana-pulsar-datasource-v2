# NS1 Pulsar Metrics Datasource Plugin

The objective of the Plugin is to make it easier for Pulsar customers to query
the NS1 API for Performance and Availability data of their pulsar Applications and
Jobs.

This is a backend datasource plugin, and it uses the public open source NS1 API library for
GoLang. You can find the library [here](https://github.com/ns1/ns1-go)

This is a work in progress, and currently querying Performance and Availability data
are supported.

## Installation and Build

As of now this plugin must be installed as a _local plugin_. We are working on having
the plugin published in Grafana's open source plugin catalog.

You need to download this repository as zip or clone it.
Unzip the file and follow the instructions on [Install Plugin](https://grafana.com/docs/grafana/latest/plugins/installation/#install-plugin-on-local-grafana)
As of now the plugin is unsigned, and therefore you will have to enable the loading
of unsigned plugins on your Grafana instance. [More details](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/#allow_loading_unsigned_plugins)


Steps for unsigned grafana plugin : 
Prerequisite: Need to have mage, yarn or npm installed

- Download the plugin from the repository.
- Unzip file and move grafana-pulsar-datasource-v2 folder in `/var/lib/grafana/plugins/`
- build backend
```bash
mage -v buildAll
```
- build frontend
```bash
yarn install
yarn build
```
OR
```bash
npm install
npm run build
```
- Edit grafana.ini configuration file (commonly at `/etc/grafana/grafana.ini`)
```bash
[plugins]
allow_loading_unsigned_plugins = ns1-pulsar-datasource-v2
[plugin.ns1-pulsar-datasource-v2]
allow_local_mode = true
```

If something goes wrong when building the frontend, try to delete the _node_modules_ and the _yarn.lock_ file: `rm -rf node_modules yarn.lock`. Then repeat the commands (yarn install, yarn build).

Restart grafana if needed.

## Configuration

The configuration screen will only ask for a valid NS1 API key. This key will be
used to query the NS1 API. Also, the key will be stored securely by Grafana in local
storage.

![Configuration Screen](https://raw.githubusercontent.com/ns1labs/grafana-pulsar-datasource/main/src/img/pulsar-plugin-cfg.png)

Once you enter your API Key, click on the `Save and Test` button. The Plugin will
verify your Key against the NS1 API.

![Confirmation Screen](https://raw.githubusercontent.com/ns1labs/grafana-pulsar-datasource/main/src/img/datasource-correct.png?raw=true)

After the key is verified, you can hit the `Back`
button and continue with your dashboard creation.

## Query Data

After creating a dashboard, select as Data source `pulsar-datasource`. This will bring
the Pulsar Query Editor.

![Pulsar Query Editor](https://raw.githubusercontent.com/ns1labs/grafana-pulsar-datasource/main/src/img/pulsar-query-editor.png?raw=true)

It is possible that the first time you use the Pulsar Datasource with the Query Editor
you may experience a little delay, as the backend is loading the Applications and Jobs.
Further usage won't show this behavior, as this data will be cached by the Plugin.

Once the Query Editor is loaded, you may be able to select a Pulsar App and a Job
belonging to the App. Next is to select the metric type, Performance (Latency) or
Availability, and the Aggregation. These are the minimum parameters to get data,
but be aware that you may need to specify GEO and ASN to have meaningful data.
If you don't specify at least a GEO code, you will be fetching the global behavior
of the selected Job, and that may not be optimal.

![Query Editor Example](https://raw.githubusercontent.com/ns1labs/grafana-pulsar-datasource/main/src/img/query-editor-example.png?raw=true)

You can add as many queries as you want, but you will usually add as many as the
number of active jobs you have configured.

Please report any problems found on the repository issues section.
