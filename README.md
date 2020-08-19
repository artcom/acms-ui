# CMS Frontend

A frontend webapp which allows browsing/editing the json content served by the git-json-api service.

## Usage

### Development

```bash
npm install
ASSET_SERVER_URI=<uri> CONFIG_SERVER_URI=<uri> CMS_CONFIG_PATH=<path> npm run watch
```

### Production

```bash
ASSET_SERVER_URI=<uri> CONFIG_SERVER_URI=<uri> CMS_CONFIG_PATH=<path> npm start
```
The web app is served on port `8080` by default if environment variable `PORT` is not set.

The environment variables can be omitted if a `config.json` file providing the following information is served:
```json
{
  "assetServer": <uri>,
  "gitJsonApi": <uri>,
  "configPath": <path>
}
```
