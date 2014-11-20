module.exports = function(deps){
    var mongoose = deps.mongoose,
        Schema = mongoose.Schema;
    
    var Dimensions = {
        width: Number,
        height: Number
    };
        
    var Fingerprint = new Schema({
        _id                 : String,
        useragent           : String,
        plugindata          : [],
        urls                : [String],
        ipaddress           : String,
        screendimensions    : Dimensions,
        windowdimensions    : Dimensions,
        count               : Number,
        dateFirstScene      : { type: Date, default: Date.now },
        dateLastScene       : { type: Date, default: Date.now }
    });
    
    Fingerprint.pre('save', function (next) {

        this.dateLastScene = Date.now();
        
        return next();
        
    });
    
    
    var model = mongoose.model('Fingerprints', Fingerprint);
    
    return model;
};
