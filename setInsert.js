javascript: (function() {
    function cacheturSetIns(tripNum) {
        var numberId;
        var numberList = [];
        var cacheNumbers = document.getElementsByClassName("cacheNumber");
        if (cacheNumbers !== undefined && cacheNumbers.length > 0) {
            for (var i = 0; i < cacheNumbers.length; i++) {
                numberVal = cacheNumbers[i].innerText;
                numberList[numberVal] = cacheNumbers[i].getAttribute("data-id");;
            }
        }
        var ctNum = prompt("Enter number for insert point", "");
        numberId = numberList[ctNum];
        if (ctNum) {
            var params = 'source=1&tur=' + tripNum + '&set_as_cursor=' + numberId;
            postAjax('https://cachetur.no/ajax/waypoint_update.php', params, function(data) {
                location.reload(true);
            });
        }
    }

    function postAjax(url, data, success) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.withCredentials = true;
        xhr.onreadystatechange = function() {
            if (xhr.readyState > 3 && xhr.status == 200) {
                location.reload(true);
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(params);
        return xhr;
    }

    function ctGetTripNum() {
        var ctPath = window.location.pathname;
        var ctDomain = document.domain;
        var ctParts = ctPath.split("/");
        var _ctTripNum;
        if (ctDomain === "cachetur.no") {
            if (ctPath.indexOf("/fellestur/") > -1) {
                _ctTripNum = ctParts[ctParts.length - 1];
            }
        }
        return _ctTripNum;
    }
    var _ctTripNum = "unknown";
    _ctTripNum = ctGetTripNum();
    if (_ctTripNum) {
        cacheturSetIns(_ctTripNum);
    }
})()
