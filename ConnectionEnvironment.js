
// https://github.com/robertodecurnex/J50Npi/blob/master/J50Npi.js
// https://stackoverflow.com/questions/6132796/how-to-make-a-jsonp-request-from-javascript-without-jquery

// CommunicationEnvironment => CE
let CE = {  
    
    __IpApiEndpoint: "http://ip-api.com/json/",

    __currentScript: null,  

    __launchScript: function(url, data, scriptId) {
        
        let src = url + (url.indexOf("?")+1 ? "&" : "?");
        
        let head = document.getElementsByTagName("head")[0];
        let newScript = document.createElement("script");

        let params = [];
        let param_name = ""

        // prepare QueryString
        for(param_name in data){  
            params.push(param_name + "=" + encodeURIComponent(data[param_name]));  
        }
        src += params.join("&")

        // prepare script for JSONP
        newScript.type = "text/javascript";  
        newScript.src = src;
        newScript.id = scriptId;

        // Run the JSONP call
        if(this.__currentScript) head.removeChild(__currentScript);
        head.appendChild(newScript); 
    },

    __getJSON: function(url, data, callback) {
        var scriptId = '_' + Math.round(10000 * Math.random());
        
        this.__success = callback;
        data["callback"] = "CE.__success";
        
        this.__launchScript(url, data, scriptId);
    },

    __getJSONP: function(url, data) {
        var __theLaunchScript = this.__launchScript
        return new Promise(function(resolve, reject) {
            var scriptId = '_' + Math.round(10000 * Math.random());
            var callbackName = 'jsonp_callback_' + scriptId;
            window[callbackName] = function(theJSONPResponse) {
                delete window[callbackName];
                var ele = document.getElementById(scriptId);
                ele.parentNode.removeChild(ele);
                resolve(theJSONPResponse);
            }

            this.__success = callbackName;
            data["callback"] = callbackName;

            __theLaunchScript(url, data, scriptId);
        });
    },

    __success: null,

    get: function(envCallback){
        this.__getJSON(this.__IpApiEndpoint, {}, envCallback);
    },

    getP: function(envCallback){
        this.__getJSONP(this.__IpApiEndpoint, {})
        .then(function(response){
            envCallback(response);
        });
    },

    getP2: function(){
        return this.__getJSONP(this.__IpApiEndpoint, {});
    },

    getSample: function(){        
        return JSON.parse(
            `{
                "as": "AS32780 Hosting Services, Inc.",
                "city": "New York",
                "country": "United States",
                "countryCode": "US",
                "isp": "WestHost",
                "lat": 40.7517,
                "lon": -73.9972,
                "org": "Hosting Services Inc",
                "query": "107.182.231.233",
                "region": "NY",
                "regionName": "New York",
                "status": "success",
                "timezone": "America/New_York",
                "zip": "10001"
            }`
        );
    }

}; 