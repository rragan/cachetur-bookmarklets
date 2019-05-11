javascript:function ctGetRoute(id) {
    var ctReq = new XMLHttpRequest();
    var url = "https://cachetur.no/api/planlagt_get_route?format=json&tur=" + id;
    ctReq.open("GET", url, true);
    ctReq.withCredentials = true;
    ctReq.onreadystatechange = function() {
        if (4 === ctReq.readyState) {
            if (ctReq.status >= 200 && ctReq.status < 400) {
                var ctData = JSON.parse(ctReq.responseText).data;
                var ctRoutePts = [];
                ctData.forEach(function(d) {
                    ctRoutePts.push(new L.LatLng(d[0], d[1]));
                });
                var ctMap = ctGetMap();
                if (ctMap) {
                    var _routeLine = new L.polyline(ctRoutePts, {
                        color: 'purple'
                    });
                    _routeLine.addTo(ctMap);
                    ctMap.fitBounds(_routeLine.getBounds());

                }
            }
        }
    };
    ctReq.send();
}

function ctGetMap() {
    if (_ctPage === "gc_map" && window.MapSettings) {
        return window.MapSettings.Map;
    } else if (_ctPage === "gc_map_new" && window.cacheturGCMap) {
        return window.cacheturGCMap;
    } else if (_ctPage === "pgc_map" && window.PGC_LiveMap) {
        return window.PGC_LiveMap.map;
    } else if (_ctPage === "pgc_map" && window.freeDraw && window.freeDraw.map) {
        return window.freeDraw.map;
    } else {
        return null;
    }
}

function ctCheckLogin() {
    var ctReq = new XMLHttpRequest();
    ctReq.open("GET", "https://cachetur.no/api/user_get_current?format=json", true);
    ctReq.withCredentials = true;
    ctReq.onreadystatechange = function() {
        if (4 === ctReq.readyState)
            if (ctReq.status >= 200 && ctReq.status < 400) {
                var ctData = JSON.parse(ctReq.responseText).data;
                var _ctCacheturUser = ctData.username;
                if (_ctCacheturUser === undefined || _ctCacheturUser === '') {
                    alert("Please login to cachetur.no");
                    return;
                }
                var ctTrip = localStorage.getItem("ctTrip");
                if (ctTrip) {
                    ctGetRoute(ctTrip);
                }
            }
    };
    ctReq.send();
}


function ctGetPage() {
    var ctPath = window.location.pathname;
    var ctDomain = document.domain;

    if (ctDomain === "www.geocaching.com") {
        if (ctPath.indexOf("/seek/") > -1) _ctPage = "gc_geocache";
        else if (ctPath.indexOf("/geocache/") > -1) _ctPage = "gc_geocache";
        else if (ctPath.indexOf("/play/map") > -1) _ctPage = "gc_map_new";
        else if (ctPath.indexOf("/map") > -1) _ctPage = "gc_map";

    } else if (ctDomain === "project-gc.com" && ctPath.indexOf("/User/VirtualGPS") > -1 && window.location.search.indexOf("?map=") === -1) _ctPage = "pgc_vgps";
    else if (ctDomain === "project-gc.com") {
        _ctPage = "pgc_map";
    }
    return _ctPage;
}

var _ctPage = "unknown";
_ctPage = ctGetPage();
if (_ctPage === "unknown" || _ctPage === "gc_geocache" || _ctPage === "gc_map_new") {
    return;
}
ctCheckLogin();
