# ACMS UI

A webapp UI which allows browsing/editing the json content served by the [`acms-api`](https://github.com/artcom/acms-api) service.

## Documentation

### Config file

Copy `config.json.template` into `/public/config.json` and change values accordingly. `config.json`is served by webpack dev server or provided in a production environment.

`acmsAssetsUri`: Fully qualified URI to a WebDav enabled server, [`acms-assets`](https://github.com/artcom/acms-assets).  
`acmsApiUri`: Fully qualified URI to the [`acms-api`](https://github.com/artcom/acms-api) service.  
`acmsConfigPath`: Relative directory path inside the [`acms-config`](https://github.com/artcom/acms-config) to the ACMS UI configuration JSON file (usually `acmsConfig`, see below).

### ACMS UI Configuration file

Create a configuration file (e.g. `acmsConfig.json`) inside the [`acms-config`](https://github.com/artcom/acms-config) repo:

```jsonc
{
  "title": "ACMS",                           // title shown in the header, default: null
  "logoImageUri": "https://assets/logo.jpg", // logo shown in the header, default: null
  "contentPath": "content",                  // root directory containing the content data, default: "content"
  "templatesPath": "templates",              // root directory containing the (nested) template files, default: "templates"
  "childrenLabel": "Children",               // label shown above the children, default: "Children"
  "fieldsLabel": "Fields",                   // label shown above the fields, default: "Fields"
  "saveLabel": "Save",                       // label of the save button, default: "Save"
  "textDirection": "ltr",                    // optional text direction for non localized text, default: "ltr", see https://developer.mozilla.org/de/docs/Web/CSS/
  "languages": [                             // optional language configuration
    {
      "id": "en",                            // unique language id (e.g. "en"), see language subtag registry: https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
      "name": "English",                     // language name, default: id
      "textDirection": "ltr"                 // direction of the text, default: "ltr", see https://developer.mozilla.org/de/docs/Web/CSS/direction
    }
  ],
  "users": [                                 // list of users, default: shown here
    {
      "id": "admin",                         // unique user id
      "name": "Admin",                       // user name, default: id
      "permissions": {                       // permission settings, default: shown here
        "include": [
          "**"                               // list of glob patterns defining which fields to include, default: shown here
        ],
        "exclude": []                        // list of glob patterns defining which fields to exclude, default: shown here
      }
    }
  ],
   "customTypes": {                          // a collection of custom types with preconfigured properties, the custom type id can be used in templates
    "myCustomString": {
      "type": "string",
      "maxLength": 123,
      "multiline": true
    }
  }
}
```

### User Management

The user management is **not safe** and only meant to provide convenience views on the content. Its possible to filter fields and children by path (see `users/permissions`) to filter *internal* data.

### Templates

Template files specify the structure of the content data while the actual values are located in the `content` directory. Every template entity can have children which themself are structured by a template. Nested templates within the `templates` directory are referenced via local path. E.g.:

```jsonc
/templates/template1.json            // => `template1`
/templates/template2.json            // => `template2`
/templates/template3/index.json      // => `template3`
/templates/template3/template4.json  // => `template3/template4`

```

#### Example
```jsonc
{
  "fields": [                                                     // optional list of fields
        {
            "id": "title",                                        // unique id within the whole template
            "name": "Main Title",                                 // optional display name shown in the ACMS UI, default startCase(id)
            "type": "string",                                     // field type see below
            "maxLength": 8,                                       // optional type specific properties
            "localization": ["en", "ar"],                         // optional localization
            "preview": "https://previewer.de/?fieldValue=${value}"// optional preview link
        },
        {
            "id": "enabled",
            "name": "Page Enabled",
            "type": "boolean"
        },
        {
            "id": "numLoops",
            "name": "Number of Loops performed",
            "type": "number",
            "integer": true
        }
  ],
  "fixedChildren": [                     // optional list of fixed/named children
    {
      "id": "frontScreen",               // unique id within the whole template
      "name": "Front of the Entry",      // optional display name shown in the ACMS UI, default startCase(id)
      "template": "location"             // template id/path
    },
    {
      "id": "backScreen",
      "name": "Back of the Entry",
      "template": "location"
    }
  ],
  "children": [                          // optional list of of allowed templates for the children 
    "template1",
    "template2"
  ],
  "enabledField": "enabled",             // optional field reference defining if the instance is shown enabled or disabled in its parent children list
  "subtitleField": "title"               // optional field reference defining a subtitle shown in its parent children list
}
```

### Field Types

The following field types are supported:

#### `audio`, `file`, `video`
An uploadable asset which is stored on the asset server with a unique (hashed) filename. 

Example:
```jsonc
{
    "id": "bachelorThesis",
    "name": "Bachelor Thesis",
    "type": "file",
    "allowedMimeTypes": ["application/pdf"]  // optional list of allowed mime types
}
```

#### `image`
An uploadable asset which is stored on the asset server with a unique (hashed) filename
* `allowedMimeTypes`: optional list of allowed mime types, default: `["image/*"]`
* `width`: optional width of the image
* `minWidth`: optional minimum width of the image
* `maxWidth`: optional maximum width of the image
* `height`: optional height of the image
* `minHeight`: optional minimum height of the image
* `maxHeight`: optional maximum height of the image
* `aspectRatio`: optional aspect ratio of the image

Example:	
```jsonc
{
    "id": "coverImage",
    "name": "Front Cover Image",
    "type": "image",
    "allowedMimeTypes" : ["image/jpeg", "image/png"],
    "width": 1920,
    "minWidth": 800,
    "maxWidth": 2200,
    "height": 1080,
    "minHeight": 800,
    "maxHeight": 1600,
    "aspectRatio": "16:9"
}
```

#### `string`, `markdown`
A string type with the following otional properties:
  * `multiline`: Defines wether the string can have multiple lines, default: `false`
  * `maxLength`: Defines the maximum number of characters, default: `Infinity`

Example:
```jsonc
{
    "id": "label",
    "name": "Start Label",
    "type": "string",
    "maxLength": 32,
    "multiline": true
}
```

#### `number`
A number type with the following optional properties:
* `min`: The minimum value, default `-Infinity`
* `max`: The maximum value, default `Infinity`
* `integer`: Defines wether the number is an integer, default: `false`

Example:
```jsonc
{
    "id": "numLoops",
    "name": "Number of loops",
    "type": "number",
    "min": 0,
    "max": 100
}
```

#### `geolocation`
A geolocation type with values for `lat` (Latitude) and `long` (Longitude).
* `min`: The minimum value, default `lat: -90`, `long: -180`
* `max`: The maximum value, default `lat: 90`, `long: 180`

Example:
```jsonc
{
  "id": "location",
  "type": "geolocation"
}
```

#### `boolean`
A boolean either being `true` or `false`.

Example:
```jsonc
{
    "id": "active",
    "name": "Active State",
    "type": "boolean"
}
```

### `enum`
A list of selectable values.

Example:
```jsonc
{
    "id": "myEnum",
    "name": "My Enum Type",
    "type": "enum",
    "values": [
        {
            "value": "value1",
            "name": "First Value"
        },
        {
            "value": [2, 3, 4],
            "name": "Second Value"
        },
        {
            "value": {
              "thirdValue": "thirdValue"
            },
            "name": "Third Value"
        },
        {
          "value": true,
          "name": "Fourth Value"
        },
        {
          "value": "no name"
        }
    ]
}
```
Note: As shown in the last entry of the `values` array, the `name` property is not required. The displayed name will then be generated based on the type of `value`.


### Field Condition

It is possible to hide/show fields in the CMS frontend depending on sibling fields value. A typical case is an `enum` field which specifies a layout type (e.g. `videoCover`/`imageCover`). Based on the field value you want to either show an `image` or `video` field. This can be achieved with the following `GET`and `EQUALS` operators:

```jsonc
{
    "id": "layoutType",
    "type": "enum",
    "values": ["videoCover", "imageCover"]
},
{
    "id": "coverVideo",
    "type": "video",
    "condition": [ "EQUALS", [ "GET", "layoutType" ], "videoCover" ]
},
{
    "id": "coverImage",
    "type": "image",
    "condition": [ "EQUALS", [ "GET", "layoutType" ], "imageCover" ]

}
```

If several values should be considered you can use the `IN` and `LIST` operator:
```jsonc
{
    "id": "coverVideo",
    "type": "string",
    "condition": [ "IN", [ "GET", "layoutType" ], [ "LIST", "videoCover", "imageCover" ] ]
}
```
