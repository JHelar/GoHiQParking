/**
 * Created by Johnh on 2017-05-13.
 */
const GeoClient = {
    hasPermission: true,
    updateIntervall: 2000,
    canGetCoordinates: function() {
        return this.hasPermission && !(!navigator.geolocation);
    },
    error: function(error) {
        switch(error.code){
            case error.PERMISSION_DENIED:
            case error.POSITION_UNAVAILABLE:
            case error.TIMEOUT:
            case error.UNKNOWN_ERR:
                this.hasPermission = false;
        }
    },
    getDistance: function(pos, callback){
        navigator.geolocation.getCurrentPosition((position) => {
            callback(calculateDistance(pos, {long: position.coords.longitude, lat: position.coords.latitude}));
        }, (err) => {this.error(err); callback(-1); });
    }
};

const calculateDistance = (pos1, pos2) => {
    var R = 6371e3; // metres
    var φ1 = toRadians(pos1.lat);
    var φ2 = toRadians(pos2.lat);
    var Δφ = toRadians((pos2.lat - pos1.lat));
    var Δλ = toRadians((pos2.long - pos1.long));

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const toRadians = (num)=>{
  return num * (Math.PI / 180);
};

export default GeoClient;