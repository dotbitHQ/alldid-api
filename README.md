# blockabc_node_template

## Design Guide
### Config
Using [node-config](https://github.com/node-config/node-config/wiki/Configuration-Files) to store all the configs.

There would be a structure like below:
```shell
- config
  - default.ts #
  - production.ts #
  - [NODE_CONFIG_ENV].ts #
  - local.ts # 
```

The latter config will override the previous config. The override method is recursively, so you only need to pay attention to the really different data.

The `NODE_CONFIG_ENV` is the variable defined in env, and can be retrieved with `process.env.NODE_CONFIG_ENV` in JS code. We have injected it in `ecosystem.config.js`, so the config file `[NODE_CONFIG_ENV].ts` will be automatically loaded if

For more information, please refer to its docs.
> Be careful, don't store any sensitive parts in repo, please put them on server or in CI secrets.

### API Style
#### Restful
The basic style of the API is Restful, which will respect the http status, like 4xx, 5xx. A normal response will only contain necessary data, no extra fields like `errcode`, or `errmsg`.

#### Error Handling
The HttpStatus and Business Error should be separated. So we use `CodedError` instead of general HttpException for known errors.

When it comes to `Response`, if it is an error Response, it's format will be like below:
```json
{
  "code": 1001,
  "msg": "This is a manual exception, with code 1001 and status 401",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/demo/coded-error-using-status"
}
```

