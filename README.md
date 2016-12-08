BlueMP NodeJS SDK
=================

This is an unofficial NodeJS SDK implementation for BlueMP open platform.

This SDK is inspired by BlueMP official PHP SDK.


Currently, we only implemented three methods for now.

1. getAuthorizeURL
2. getAccessToken
3. getEnterpriseInfo


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

Get access token

```js
const bluemp = require('bluemp');

var mp_client = bluemp.createMPClient('app_xxxx', 'secret_xxx');

mp_client.getAccessToken('code', {
    code: 'xxxxx',
    redirect_uri: 'http://www.example.com/bluemp/authorize'
}, function(result) {
    if (!result.error) {
        console.log(result.access_token);
    } else {
        console.log(result.error);
    }
})
```

Get Enterprise Information

```js
const bluemp = require('bluemp');

var mp_client = bluemp.createMPClient('app_xxxx', 'secret_xxx');

mp_client.getEnterpriseInfo('xxxxx', function(result) {
    console.log(result);
});

```

If you want detailed help information, please visit [BlueMP](http://open.bluemp.cn/)