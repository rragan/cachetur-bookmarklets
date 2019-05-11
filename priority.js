javascript:function ctSetPriority() {
    var ctTrip = localStorage.getItem("ctTrip");
    var ctLastGC = localStorage.getItem("lastGC");
    var ctPri = prompt("Enter priority of 0,1,2, or 3 for " + ctLastGC, "");
    var ctReq = new XMLHttpRequest();
    var url = 'https://cachetur.no/api/planlagt_set_code_priority?format=json&tur=' + ctTrip + '&code=' + ctLastGC + '&priority=' + ctPri;
    ctReq.open('GET', url, true);
    ctReq.withCredentials = true;
    ctReq.onreadystatechange = function() {
        if (4 === ctReq.readyState)
            if (ctReq.status >= 200 && ctReq.status < 400) {}
    };
    ctReq.send();
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
                if (_ctPage !== "unknown") {
                    ctSetPriority();
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
ctCheckLogin();
