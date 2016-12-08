BlueMP NodeJS SDK
=================

This is an unofficial NodeJS SDK implementation for BlueMP open platform.

This SDK is inspired by BlueMP official PHP SDK.


Currently, we only implemented two methods for now.

1. getAuthorizeURL
2. getAccessToken


# Installation

```bash
npm install bluemp --save
```

# Examples

Get authorize URL

```js
const bluemp = require('bluemp');

var mp_client = bluemp.createMPClient('app_xxxx', 'secret_xxxx');

var authorize_url = mp_client.getAuthorizeURL('http://www.example.com/bluemp/authorize', 'code');

```