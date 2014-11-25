function post(deps){
    return function(req, res){
        var fingerprints = deps.models.fingerprints;
        
        //get data
        var useragent = req.headers['user-agent'],
            ip = req.connection.remoteAddress,
            canvasfingerprint = (req.body.canvasfingerprint||""),
            plugindata = (req.body.plugindata||[]),
            screendimensions = (req.body.screendimensions||{}),
            windowdimensions = (req.body.windowdimensions||{}),
            url = (req.body.location||""),
            primaryKey = deps.md5(useragent + '_' + ip + '_' + canvasfingerprint + '_' + JSON.stringify(plugindata) );
        
        
        
        //check exists
        fingerprints.findOne({_id:primaryKey}, function(err, data){
            if(err)
                throw err;
            
            if(data){
                var urls = data.urls;
                fingerprints.update(
                    {_id:primaryKey}, 
                    {
                        count: (data.count||0) + 1, 
                        $push:{urls:url}, 
                        dateLastScene: Date.now()
                    }, errHandler);
            }else{
                insertNew();
            }
        });
        
        function errHandler(err){
            if(err)
                throw err;
        }
        
        function insertNew(){
            //insert if not
            var f = new fingerprints({
                _id                 : primaryKey,
                useragent           : useragent,
                plugindata          : plugindata,
                ipaddress           : ip,
                urls                : [url],
                count               : 1,
                screendimensions    : screendimensions,
                windowdimensions    : windowdimensions,
            });
            
            f.save(errHandler);
        
        }
        
        res.send({foo:'bar'});
    };
}

module.exports = function(deps){
    
    return {
        post:post(deps)    
    };
    
};
