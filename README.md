<h1 align="center">AllDID-API</h2>
<p align="center"><a href="https://github.com/dotbitHQ/AllDID">AllDID</a> for the RESTful API version used by native clients/servers.</p>

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Design Guide](#design-guide)
- [CHANGELOG](#changelog)
- [API Documentation](#api-documentation)

## Features

AllDID API depends on AllDID.js and provides external support. Features included are:

- Resolve any DID.
- Caching of parsing results to improve performance.

## Getting Started

First, you need to install dependencies using [`pnpm`](https://pnpm.io/installation)

```bash
pnpm install
```

Then, you can run the following command:

- ```pnpm dev``` - development mode.
- ```pnpm lint:fix``` - code formatting.
- ```pnpm jest``` - run unit tests.
- ```pnpm build``` - build to be available in production.

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

## CHANGELOG

TBD

## API Documentation

### Table of Contents

- [Check domain availability](#check-domain-availability)
- [Check domain validity](#check-domain-validity)
- [Check if the domain name is registered](#check-if-the-domain-name-is-registered)
- [Query domain name owner](#query-domain-name-owner)
- [Query domain name manager](#query-domain-name-manager)
- [Query TokenID](#query-tokenid)
- [Query multiple parsing records](#query-multiple-parsing-records)
- [Query multiple resolved addresses](#query-multiple-resolved-addresses)
- [Query registry address](#query-registry-address)

---
#### **Check domain availability**

Check if the name is supported.

##### Path

**GET**  `/api/v1/name/{name}/check/supported`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/check/supported
{  
  "is_supported": true 
}
```

---
#### **Check domain validity**

Check if the name is valid.

##### Path

**GET**  `/api/v1/name/{name}/check/available`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/check/available
{  
  "is_available": true 
}
```

---
#### **Check if the domain name is registered**

Check if the name is already registered.

##### Path

**GET**  `/api/v1/name/{name}/check/registered`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/check/registered
{  
  "is_registered": true 
}
```

---
#### **Query domain name owner**

Query the address of the domain name owner

##### Path

**GET**  `/api/v1/name/{name}/owner`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/owner
{  
  "owner": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa" 
}
```

Request failed:
```json
// /api/v1/name/owner?name=wererer.eth
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/owner?name=wererer.eth"
}
```

---
#### **Query domain name manager**

uery the address of the manager of the specified domain name.

##### Path

**GET**  `/api/v1/name/{name}/manager`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/manager
{  
  "manager": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa" 
}
```

Request failed:
```json
// /api/v1/name/wererer.eth/manager
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/manager?name=wererer.eth"
}
```

---
#### **Query TokenID**

Query the TokenID of the domain name.

##### Path

**GET**  `/api/v1/name/{name}/manager`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/tokenid
{  
  "token_id": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa" 
}
```

Request failed:
```json
// /api/v1/name/wererer.eth/tokenid
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/tokenid?name=wererer.eth"
}
```

---
#### **Query multiple parsing records**

Query multiple resolution records of a domain name.

##### Path

**GET**  `/api/v1/name/{name}/records?keys={keys}`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |
| keys  | FALSE | string \| string[]  | \["address.eth"\] |

##### Return Value

```json
// /api/v1/name/leonx.bit/records?keys=%5B%22address.eth%22%5D
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "ttl": 300,
    "type": "address",
    "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa"
  }
]
```

Request failed:
```json
// /api/v1/name/wererer.eth/records?keys=%5B%22address.eth%22%5D
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/records?name=wererer.eth"
}
```

---
#### **Query multiple resolved addresses**

Query multiple resolution addresses of a domain name.

##### Path

**GET**  `/api/v1/name/{name}/records?keys={keys}`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |
| keys  | FALSE | string \| string[]  | \["eth"\] |

##### Return Value

```json
// /api/v1/name/leonx.bit.eth/addrs?keys=%5B%22eth%22%5D
[
  {
    "key": "address.eth",
    "label": "",
    "subtype": "eth",
    "ttl": 300,
    "type": "address",
    "value": "0xC72B6f66017246d6A7f159F5C2BF358188AD9ECa",
    "symbol": "ETH"
  }
]
```

Request failed:
```json
// /api/v1/name/wererer.eth/records?keys=%5B%22address.eth%22%5D
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/records?name=wererer.eth"
}
```

---
#### **Query registry address**

Query the registry address where the domain name is located.

##### Path

**GET**  `/api/v1/name/{name}/registry`

##### Parameter

Headers:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| Content-Type  | TRUE | application/json  | message body encoding |

Path parameters:
| Key | Required | Value | Description |
| :----: | :----: | :----: | :----: |
| name  | TRUE | string  | domain name |

##### Return Value

```json
// /api/v1/name/leon.eth/registry
{
  "registry_address": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
}
```

Request failed:
```json
// /api/v1/name/wererer.eth/registry
{
  "code": 4001,
  "msg": "Unregistered name",
  "ts": "2022-10-31T16:06:38.532Z",
  "url": "/api/v1/name/records?name=wererer.eth"
}
```
