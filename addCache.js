javascript:function cacheturAdd() {
    var ctTripId = localStorage.getItem("ctTrip");
    var ctGcCode;
    var ctMsgHolder;
    var ctCodeHolder;
    var ctSplitParts;
    if (_ctPage === "gc_map") {
        ctCodeHolder = document.getElementsByClassName("code");
        if (ctCodeHolder !== undefined && ctCodeHolder.length > 0) {
            ctGcCode = ctCodeHolder[0].innerText;
            ctMsgHolder = document.getElementsByClassName("map-wrapper")[0];
        }
    }
    if (_ctPage === "gc_map_new") {
        ctCodeHolder = document.getElementsByClassName("cache-metadata-code");
        if (ctCodeHolder !== undefined && ctCodeHolder.length > 0) {
            ctGcCode = ctCodeHolder[0].innerText;
            ctMsgHolder = document.getElementsByClassName("preview-main")[0];
        }
    }
    if (_ctPage === "gc_geocache") {
        ctMsgHolder = document.getElementById("divContentMain");
        ctSplitParts = location.href.split("/");
        ctGcCode = ctSplitParts[ctSplitParts.length - 1].split("_");
    }

    if (_ctPage === "pgc_map") {
        ctCodeHolder = document.getElementsByClassName("leaflet-popup-content")[0];
        if (ctCodeHolder !== undefined) {
            ctCodeHolder = ctCodeHolder.firstChild;
            ctSplitParts = ctCodeHolder.getAttribute("href").split("/");
            ctGcCode = ctSplitParts[ctSplitParts.length - 1];
            ctMsgHolder = document.getElementsByClassName("leaflet-container")[0];
        }
    }

    if (ctTripId && ctGcCode) {
        var ctReq = new XMLHttpRequest();
        ctReq.open('GET', 'https://cachetur.no/api/planlagt_add_codes?format=json&tur=' + ctTripId + '&code=' + ctGcCode, true);
        ctReq.withCredentials = true;
        ctReq.onreadystatechange = function() {
            if (ctReq.readyState === 4) {
                if (ctReq.status >= 200 && ctReq.status < 400) {
                    localStorage.setItem("lastGC", ctGcCode);
                    var okMsg = '<div id="ctOkMsg" style="position:fixed;top:200px;left:200px;z-index:9999;font-size:20px;padding:10px;border:7px solid #0f0;opacity:1;background-color:#fff"><img src="https://cachetur.net/img/logo_top.png"/>' + localStorage.getItem("ctTripName") + '</div>';
                    ctMsgHolder.insertAdjacentHTML('afterbegin', okMsg);
                    setTimeout(function() {
                        var elem = document.querySelector('#ctOkMsg');
                        elem.parentNode.removeChild(elem);
                    }, 2000);
                }
            }
        };
        ctReq.send();
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
                if (_ctPage !== "unknown") {
                    cacheturAdd();
                }
            }
    };
    ctReq.send();
}

function ctGetPage() {
var ctPath = window.location.pathname;
var ctDomain = document.domain;

if(ctDomain === "www.geocaching.com") {
    if (ctPath.indexOf("/seek/") > -1) _ctPage = "gc_geocache";
    else if (ctPath.indexOf("/geocache/") > -1) _ctPage = "gc_geocache";
    else if (ctPath.indexOf("/play/map") > -1) _ctPage = "gc_map_new";
    else if (ctPath.indexOf("/map") > -1) _ctPage = "gc_map";
    
}
else if (ctDomain === "project-gc.com" && pathname.indexOf("/User/VirtualGPS") > -1 && window.location.search.indexOf("?map=") === -1) _ctPage = "pgc_vgps";
else if (ctDomain === "project-gc.com") {
    _ctPage = "pgc_map";
}
return _ctPage;
}

var _ctPage = "unknown";
_ctPage = ctGetPage();
ctCheckLogin();
