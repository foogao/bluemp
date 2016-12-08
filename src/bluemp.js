/**
 * Wrapper the BlueMP open platform OAuth client, 
 * inspired by BlueMP PHP sdk.
 * 
 * @author Steve Gao<steve@parllay.cn>
 */

const request       = require('request');
const querystring   = require('querystring');

/**
 * The BlueMP client 
 * 
 * @name BlueMP
 * @param {String} clientId
 * @param {String} clientSecret
 * @param {String} accessToken
 * @param {String} refreshToken
 */
function BlueMP(clientId, clientSecret, accessToken, refreshToken) {
    this.client_id = clientId;
    this.client_secret = clientSecret;
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
}

BlueMP.prototype = {
    /**
     * BlueMP application client id
     */
    client_id: null,

    /**
     * BlueMP application client secret
     */
    client_secret: null,

    authorize_url: 'http://www.bluemp.cn/Auth/Authorize/index',

    /**
     * When authorize successfully, make request to this endpoint to get access token
     */
    access_token_endpoint: 'http://www.bluemp.cn/Auth/Authorize/getTokenByCode',

    user_agent: 'BlueMP OAuth2 v0.1',

    supported_displays: [
        'default',
        'mobile',
        'popup',
        'wap1.2',
        'wap2.0',
        'js',
        'apponweibo'
    ],

    /**
     * Get BlueMP authorize URL
     * 
     * @name getAuthorizeURL
     * @param {String} redirectURI - The redirect url when got authorized
     * @param {String} responseType - The OAuth response type, default value is code, possible values:
     *  - code
     *  - token
     * @param {String} state - Is used to keep the request/callback state
     * @param {String} display - The display type, possible values:
     *  - default : The default authorize page
     *  - mobile : For mobile which support HTML5
     *  - popup : Display as popup window
     *  - wap1.2 : For wap1.2
     *  - wap2.0 : For wap2.0
     *  - js :For js-sdk, the display is popup window, when success will call the JS callback
     *  - apponweb
     * 
     * @returns {String} The Authorize URL
     */
    getAuthorizeURL: function(redirectURI, responseType, state, display) {
        responseType = responseType || 'code';
        state        = state || 'nodejs';
        display      = display || 'default';
        display      = this.supported_displays.indexOf(display) >= 0 ? display : 'default';

        var params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            redirect_uri: redirectURI,
            response_type: responseType,
            state: state,
            display: display
        };

        return this.authorize_url + '?' + querystring.stringify(params);
    },

    /**
     * Get BlueMP access token
     * 
     * @name getAccessToken
     * @param {String} type - The type to get access token
     * @param {Object} params - The parameters for getting access token, it is different when the type is different
     * @param {Function} callback - The callback function when success
     * 
     * @returns {void} 
     */
    getAccessToken: function(type, params, callback) {

        var parameters = {
            client_id: this.client_id,
            client_secret: this.client_secret
        };

        switch(type) {
            case 'token':
                parameters.grant_type = 'refresh_token';
                params.refresh_token = params.refresh_token;
                break;
            case 'code':
                parameters.grant_type = 'authorization_code';
                parameters.code = params.code;
                parameters.redirect_uri = params.redirect_uri;
                break;
            case 'password':
                parameters.grant_type = 'password';
                parameters.username = params.username;
                parameters.password = params.password;
                break;
            default:
                throw new Error('wrong auth type');
        }

        this._makeRequest(this.access_token_endpoint, 'POST', parameters, function(result) {
            if (result) {

            } else {
                callback(null);
            }
        });
    },

    _makeRequest: function(endpoint, method, params, callback) {
        if (!endpoint) 
            throw new Error('Please specify request endpoint.');
        method = method || 'GET';

        switch(method) {
            case 'GET':
                endpoint = endpoint + '?' + querystring.stringify(params);
                break;
            case 'POST':
                break;
            default:
                throw new Error('Not supported HTTP method: ' + method);
        }

        var requestOptions = {
            url: endpoint,
            method: method,
            headers: {
                'User-Agent': this.user_agent
            }
        };

        if (method === 'POST') {
            requestOptions.form = params;
        }

        request[method.toLowerCase()](requestOptions, function(error, response, body){
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body));
            } else {
                callback(null);
            }
        });
    }
}

/**
 * Create BlueMP OAuth client
 * 
 * @name createMPClient
 * @param {String} clientId
 * @param {String} clientSecret
 * @param {String} accessToken
 * @param {String} refreshToken
 * @returns
 */
function createMPClient(clientId, clientSecret, accessToken, refreshToken) {
    var mpClient = new BlueMP(clientId, clientSecret, accessToken, refreshToken);

    return mpClient;
}

exports.createMPClient = createMPClient;