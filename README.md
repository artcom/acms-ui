# CMS Frontend

A frontend webapp which allows browsing/editing the json content served by the git-json-api service.

## Usage

### Development

```bash
npm install
ASSET_SERVER_URI=<uri> GIT_JSON_API_URI=<uri> npm run watch
```

### Production

```bash
ASSET_SERVER_URI=<uri> GIT_JSON_API_URI=<uri> npm start
```
The web app is served on port `8080` by default if environment variable `PORT` is not set.

The ASSET_SERVER_URI and GIT_JSON_API_URI environment parameter can be omitted if a `config.json` file providing the following information is served:
```json
{
  "assetServer": <uri>,
  "gitJsonApi": <uri>
}
```
