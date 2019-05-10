function ctAddList(a) {
    var ctMobile = window.matchMedia("(min-width: 420px)");
    var ctNarrow = !ctMobile.matches;
    var ctWhere = "afterbegin";
    var ctHdr;
    var ctList = JSON.parse(a).data;
    var ctTrip = localStorage.getItem("ctTrip");
    if (_ctPage === "gc_map") {
        ctHdr = document.getElementById('uxLoginStatus_divSignedIn');
    } else if (_ctPage === "gc_map_new") {
        ctHdr = document.getElementsByClassName("profile-panel")[0].firstChild;
    } else if (_ctPage === "gc_geocache") {
        ctHdr = document.getElementById('ctl00_uxLoginStatus_divSignedIn');
    } else if (_ctPage === "pgc_map") {
        ctHdr = document.getElementsByClassName('navbar-right')[0];
    }

    if (ctNarrow) {
        ctHdr = document.getElementsByClassName("mobile-menu-toggle")[0];
        ctWhere = "beforebegin";
    }

    var ctOpts = "";
    var ctSel = '"';
    if (ctList.length > 0) ctList.forEach(function(a) {
        if (!ctTrip) {
            ctTrip = a.id;
        }
        if (ctTrip === a.id) {
            ctSel = '" selected';
            localStorage.setItem("ctTrip", a.id);
            localStorage.setItem("ctTripName", a.turnavn);
        }
        ctOpts = ctOpts + '<option value="' + a.id + ctSel + ">" + a.turnavn + "</option>";
        ctSel = '"';
    });
    var ctSelect = '<li style="list-style-type:none"><img src="https://cachetur.net/img/logo_top.png"/><select id="cachetur-tur-valg" style="color:black">' + ctOpts + "</select></li>";
    ctHdr.insertAdjacentHTML(ctWhere, ctSelect);
    var ctSelElt = document.getElementById("cachetur-tur-valg");
    ctSelElt.addEventListener("change", function() {
        localStorage.setItem("ctTrip", ctSelElt.value);
        localStorage.setItem("ctTripName", ctSelElt.options[ctSelElt.selectedIndex].text);
    });
}

function ctGetTrips() {
    var ctReq = new XMLHttpRequest();
    ctReq.open("GET", "https://cachetur.no/api/planlagt_list_editable?format=json", true);
    ctReq.withCredentials = true;
    ctReq.onreadystatechange = function() {
        if (4 === ctReq.readyState)
            if (ctReq.status >= 200 && ctReq.status < 400) ctAddList(ctReq.responseText);
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
                ctGetTrips();
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

    } else if (ctDomain === "project-gc.com" && pathname.indexOf("/User/VirtualGPS") > -1 && window.location.search.indexOf("?map=") === -1) _ctPage = "pgc_vgps";
    else if (ctDomain === "project-gc.com") {
        _ctPage = "pgc_map";
    }
    return _ctPage;
}

var _ctPage = "unknown";
_ctPage = ctGetPage();
if (_ctPage !== "unknown") {
    ctCheckLogin();
}
