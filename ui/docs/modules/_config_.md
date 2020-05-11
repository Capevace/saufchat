[saufchat-ui](../README.md) › [Globals](../globals.md) › ["config"](_config_.md)

# Module: "config"

## Index

### Variables

* [API_URL](_config_.md#const-api_url)

## Variables

### `Const` API_URL

• **API_URL**: *string* = process.env.NODE_ENV === 'production'
		? 'https://api.sauf.chat'
		: 'http://localhost:8080'

*Defined in [config.ts:4](https://github.com/Capevace/saufchat-ui/blob/41a33aa/src/config.ts#L4)*

The URL of the API server.
