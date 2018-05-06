javascript:function cacheturAdd() { 
    var tripId = localStorage.getItem("ctTrip");
    var gccode;
    var mainDiv;
    if (location.href.indexOf("geocaching.com/map") != -1) {
    	var codeElts = document.getElementsByClassName("code");
    	if (codeElts !== undefined) {
    	    gccode = codeElts[0].innerHTML;
    	    mainDiv = document.getElementsByClassName("wrapper")[0];
    	}
    }
    if (location.href.indexOf("geocaching.com/geocache") != -1) {
         mainDiv = document.getElementById("divContentMain");
   	 var ctParts = location.href.split("/");
   	 gccode = ctParts[ctParts.length - 1].split("_");
    }
    
    if (tripId && gccode) {
        var req = new XMLHttpRequest();
        req.open('GET', 'https://cachetur.no/api/planlagt_add_codes?format=json&tur=' + tripId + '&code='+gccode, true);
        req.withCredentials = true;
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 400) {
                    var okMsg = '<div id="ctOkMsg" style="position:fixed;top:200px;left:200px;z-index:9999;font-size:20px;border:5px solid #0f0;opacity:1;background-color:#fff">&nbsp;&#x2714; ' +  localStorage.getItem("ctTripName") + '&nbsp;</div>';
                    mainDiv.insertAdjacentHTML('afterbegin', okMsg);
                    setTimeout(function(){ var elem = document.querySelector('#ctOkMsg');
                    elem.parentNode.removeChild(elem); }, 2000);
                }
            }
        };
        req.send();
    }
}
cacheturAdd();

