javascript:function cacheturAdd() { 
    var tripId = localStorage.getItem("ctTrip");
    var ctParts = location.href.split("/");
    var gccode = ctParts[ctParts.length - 1].split("_");
    if (tripId) {
        var req = new XMLHttpRequest();
        req.open('GET', 'https://cachetur.no/api/planlagt_add_codes?format=json&tur=' + tripId + '&code='+gccode, true);
        req.withCredentials = true;
        req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
            var mainDiv = document.getElementById("divContentMain");
            var okMsg = '<div id="ctOkMsg" style="position:fixed;top:18%;left:18%;z-index:9999;font-size:18px;border: 5px solid #0f0;opacity:1;background-color:#fff">&nbsp;&#x2714; ' +  localStorage.getItem("ctTripName") + '&nbsp;</div>';
            mainDiv.insertAdjacentHTML('afterbegin', okMsg);
            setTimeout(function(){ var elem = document.querySelector('#ctOkMsg');
            elem.parentNode.removeChild(elem); }, 2000);
            } else {}
        }
        };
        req.send();
    }
}
cacheturAdd();

