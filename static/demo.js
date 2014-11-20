function makePostRequest(url, data, callback){
    
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        success: function(resp){
            callback( JSON.parse( resp ) );
        },
        contentType: "application/json"
    });
    
}

function fingerPrint(){
    
    width = screen.width;
    height = screen.height;
    windowWidth = $($(window)[0]).width();
    windowHeight = $($(window)[0]).height();
    userAgent = window.navigator.userAgent;
    
    this.__defineGetter__('getUserAgent', getUserAgent);
    this.__defineGetter__('getScreenDimensions', getScreenDimensions);
    this.__defineGetter__('getWindowDimensions', getWindowDimensions);
    this.__defineGetter__('getLocation', getLocation);
    this.__defineGetter__('getPluginData', getPluginData);
    this.__defineGetter__('getCanvasFingerprint', getCanvasFingerprint);
    this.__defineGetter__('getTimezone', getTimezone);
    
    function getUserAgent(){return userAgent;}
    function getScreenDimensions(){return {width:width, height:height};}
    function getWindowDimensions(){return {width:windowWidth, height:windowHeight};}
    function getLocation(){ return window.location.toString();}
    
    function isie() {
        
        var ua = getUserAgent();
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!ua.match(/Trident.*rv\:11\./))
            return true;
        else
            return false;

    };
    
    function getPluginData(){
        
        //ie has not yet been tested,
        //i dont think its going to work
        //it never does...
        if(isie()){
            return ([]);
        }else{
            return getGoodBrowsersplugins();
        }
        
    };
    
    function getGoodBrowsersplugins(){
        
        var returnDat = [];
        for (var p in navigator.plugins) {
            var plugin = navigator.plugins[p];
     
            for (var j = 0; j < plugin.length; j++) {
                var mime = plugin[j];
     
                if (!mime) {
                    continue;
                }
     
                var ep = mime.enabledPlugin;
                if (ep) {
                    var item = {
                        mime: mime.type,
                        name: ep.name,
                        description: ep.description,
                        filename: ep.filename
                    };
     
                    returnDat.push(item);
                }
            }
        }
        return returnDat;
        
    }
    
     function getCanvasFingerprint() {
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // https://www.browserleaks.com/canvas#how-does-it-work
        var txt = 'bar foo';
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        return canvas.toDataURL();
        
    };
    
    function getTimezone(){
        return new Date().getTimezoneOffset();
    }
    
    var that = this;
    
    //new fingerprint logic
    (function(){
        //build data
        var url = "/finger",
            data = {},
            attr = ['getScreenDimensions', 'getWindowDimensions', 'getPluginData', 'getCanvasFingerprint', 'getTimezone', 'getLocation'];
        for(i=0;i<attr.length;i++){
            var getter = attr[i];
            try{
                var val = that[getter];
                data[getter.toLowerCase().replace('get', '')] = val;
            }catch(e){
                console.log(e);
            }
        }
            
        //make post request
        makePostRequest(url, data, function(data){});
        //do stuff after
        
        
    })();
}

var finger = new fingerPrint();
