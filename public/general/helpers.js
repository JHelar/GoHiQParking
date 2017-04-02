/**
 * Created by johnla on 2016-11-18.
 */
/**
 * Created by johnla on 2016-11-03.
 */
const googleMapsKey = "AIzaSyD55li1OuTm-bRAzfO4Mo3AsdNKHywfp1s";
const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/staticmap";

const mapStyles = {
    //style=feature:myFeatureArgument|element:myElementArgument|myRule1:myRule1Argument|myRule2:myRule2Argument
    features: [
        {
            type: "road",
            element: "geometry",
            rules: [
                {
                    name: "color",
                    value: "0xfe0070"
                },
                {
                    name: "visibility",
                    value: "simplified"
                }
            ]
        },
        {
            type: "road",
            element: "labels",
            rules: [
                {
                    name: "visibility",
                    value: "off"
                }
            ]
        },
        {
            type: "poi",
            element: "labels",
            rules: [
                {
                    name: "visibility",
                    value: "off"
                }
            ]
        },
        {
            type: "poi",
            element: "geometry",
            rules: [
                {
                    name: "color",
                    value: "0x000000"
                }
            ]
        },
        {
            type: "landscape",
            element: "geometry",
            rules: [
                {
                    name: "color",
                    value: "0x000000"
                }
            ]
        },
        {
            type: "transit.line",
            element: "geometry",
            rules: [
                {
                    name: "color",
                    value: "0xfe0070"
                }
            ]
        },
        {
            type: "transit",
            element: "labels.icon",
            rules: [
                {
                    name: "visibility",
                    value: "off"
                }
            ]
        },
        {
            type: "water",
            element: "geometry",
            rules: [
                {
                    name: "color",
                    value: "0x00a3f2"
                },
                {
                    name: "visibility",
                    value: "simplified"
                }
            ]
        },
        {
            type: "water",
            element: "labels",
            rules: [
                {
                    name: "visibility",
                    value: "off"
                }
            ]
        },
        {
            type: "administrative.locality",
            element: "labels.text.stroke",
            rules: [
                {
                    name: "color",
                    value: "0xffe50d"
                }
            ]
        },
        {
            type: "administrative.locality",
            element: "labels.text.fill",
            rules: [
                {
                    name: "color",
                    value: "0xfe0070"
                },
                {
                    name: "weight",
                    value: "20"
                }
            ]
        }
    ],
    asUrl: function() {
        let url = "";
        for(let i = 0; i < this.features.length; i++){
            let feature = this.features[i];

            url += "&style=feature:" + feature.type + "|element:" + feature.element;

            let rules = "";

            for(let j = 0; j < feature.rules.length; j++){
                let rule = feature.rules[j];
                rules += "|" + rule.name  + ":" + rule.value;
            }

            url += rules;
        }
        return url;
    }
};

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";

    let cookieStr = name+"="+value+expires+";"; //path=/api/
    document.cookie = cookieStr;
}
/*function getCookie(name) {

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}*/
export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return null;
}

export function deleteCookie(name) {
    createCookie(name,"",-1);
}

export function getHiQGoogleStaticMap(location){
    return googleMapsBaseUrl + "?zoom=13&size=640x640&scale=2&center=" + encodeURIComponent(location)  + mapStyles.asUrl() + "&key=" + googleMapsKey;
}

export function getGoogleStaticMap(location){
    return "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=640x640&scale=2&markers=color:blue%7Clabel:S|" + encodeURIComponent(location) + "&key=AIzaSyD55li1OuTm-bRAzfO4Mo3AsdNKHywfp1s";
}

export function timeDifference(previous) {
    var current = Date.now()

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
    }
}