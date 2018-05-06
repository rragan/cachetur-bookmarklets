javascript: function ctAddList(listStr) {
    var data = JSON.parse(listStr).data;
    var tripId = localStorage.getItem("ctTrip");
    var header = document.getElementsByClassName("menu")[0];
    var options = "";
    var selected = '"';

    if (data.length > 0) {
        data.forEach(function(item) {
            if (tripId === item.id) {selected = '" selected';}
            options = options + '<option value="' + item.id + selected + '>' + item.turnavn + '</option>';
            selected='"';
        });
    }
       var ctSel = '<div id="ct-header-text" style="padding-left:5px"><select id="cachetur-tur-valg">' + options + '</select>' + '</div>';

   header.insertAdjacentHTML('afterend', ctSel);
    var ctTripSelector = document.getElementById("cachetur-tur-valg");
    ctTripSelector.addEventListener('change', function() {
        localStorage.setItem("ctTrip", ctTripSelector.value);
        localStorage.setItem("ctTripName", ctTripSelector.options[ctTripSelector.selectedIndex].text);
    });
}

function ctGetTrips() {
    if (document.getElementById("ct-header")) {return;}
    var req = new XMLHttpRequest();
    req.open('GET', 'https://cachetur.no/api/planlagt_list_editable?format=json', true);
    req.withCredentials = true;
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status >= 200 && req.status < 400) {
                ctAddList(req.responseText);
            }
        }
    };
    req.send();
}
ctGetTrips();

