/* API Javascript
* Javascript de "maps.html"
*/
//Fonction principale // //////
var miam, myLocation, map, interest, service, infowindow, lat, long, latlong, marker, contentString; //Déclaration des variables en global scope
var distance = 500; //Cette valeur est en brut pour tester la recherche sur 500m
var markers = []; // C'est un array qui me permettra de clear la map plus tard
var restaurants = []; //Un array qui sert à trier les resulats de la requête
//miam = document.querySelector("#choix").value; //Recupere la valeur de l'image choisie
miam = sessionStorage.getItem("miam");

window.onload = function () {
    drawMap();
}
function drawMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            maximumAge: 2 * 60 * 1000,
            timeout: 5 * 60 * 1000,
            enableHighAccuracy: true
        }
        );
    } else {
        alert('Your navigator hates you');
    }
}
function onSuccess(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    myLocation = new google.maps.LatLng(lat, long);
    var mapOption = {
        center: myLocation,
        zoom: 14, //a partir de 15 c'est chaud si c'est vers 500m. D'ailleurs afficher la distance entre le resto et l'utilisateur serait cool.
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.querySelector("#mapArea"), mapOption);
    infowindow = new google.maps.InfoWindow();
    manger();
    //infowindow = new google.maps.InfoWindow(); //Initialise l'affichage des infos sur les resultats trouvés lors du click de la souris sur le marqueur
}
function onError() {
    switch (error, code) {
        case PERMISSION_DENIED:
            alert("Permission was denied");
            break;
        case TIMEOUT:
            alert("Connection timed out");
            break;
        default:
            alert("Unknown error");
            break;
    }
}
// Met tous les marker de la map dans un array
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }

}
// Vide la map des marker et vide l'array.
function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}
// La fonction principale. Elle lance la requete et pose les markers.
function manger() {
    // On enleve les markers déjà present sur la map (si il y en a)
    if (marker != null) {
        deleteMarkers();
    }
    //document.querySelector("#result").innerHTML = ""; //Je vide le result, c'est moins moche pour les tests :)
    //miam = document.querySelector("#selectMiam").value; //Ancien TEST.
    console.log(miam);
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=" + miam + "&latitude=" + lat + "&longitude=" + long + "&radius=" + distance;

    $.ajax({
        url: myurl,
        headers: {
            'Authorization': 'Bearer 7lT0bQMrIjgpYcK3ZyUFrj-0sJwsg0bnRquTfN7Jp_sELynPAHLTFc5PPmDjAF6hUB48OShZdjVYS4fyKo1Z2iY5wICi43z5NE6V6Qsi0tL36Z55qIR-Wc6sz-MpXHYx',
        },
        method: 'GET',
        dataType: 'json',
        success: function (data) {



            // Grab the results from the API JSON return
            var totalresults = data.total;
            // If our results are greater than 0, continue
            if (totalresults > 0) {
                $.each(data.businesses, function (i, item) {
                    // Store each business's object in a variable
                    var id = item.id;
                    var alias = item.alias;
                    var phone = item.display_phone;
                    var image = item.image_url;
                    var name = item.name;
                    var rating = item.rating;
                    var reviewcount = item.review_count;
                    var address = item.location.address1;
                    var city = item.location.city;
                    var state = item.location.state;
                    var zipcode = item.location.zip_code;
                });
            } else {
                // If our results are 0; no businesses were returned by the JSON therefor we display on the page no results were found
                alert("Aucun résultats :(")
            }
            //Les restaurants sont mis dans l'ordre de distance
            data.businesses.sort(function (a, b) {
                return a.distance - b.distance;
            });
            for (i = 0; i < data.businesses.length; i++) {
                $(".lieu").append('<div class="row donnee"><div class="col-12" blob="' + i + '" id="jiji' + i + '"></div></div>');
                $("#jiji" + i).append('<div class="row"> <div class="col-12"> <div id="nom' + i + '" class="name">Nom du Restaurant 1</div> </div> </div> <div class="row"><div class="col-6"><div id="adresse' + i + '">12 Av philippe Auguste,</br>75011 Paris</div><div id="tel' + i + '">01.89.09.23.34</div></div><div class="col-6 distance"> <div id="distance' + i + '">Situé à 4kms</div><div id="prix' + i + '"> 12€-17€</div><div id="note' + i + '">20/20</div></div></div></div>')
                var restoName = data.businesses[i].name;
                var distanceResto = data.businesses[i].distance.toFixed(0);
                var adressResto = data.businesses[i].location.display_address;
                var photoResto = data.businesses[i].image_url;
                var phoneResto = data.businesses[i].display_phone;
                var noteResto = data.businesses[i].rating;
                //console.log(distanceResto);
                document.querySelector("#nom" + i).innerHTML = restoName.toUpperCase();
                document.querySelector("#adresse" + i).innerHTML = adressResto;
                document.querySelector("#tel" + i).innerHTML = phoneResto;
                document.querySelector("#distance" + i).innerHTML = distanceResto + " m";
                document.querySelector("#note" + i).innerHTML = noteResto + "/5";
                prixResto = data.businesses[i].price;
                if (prixResto == undefined) {
                    document.querySelector("#prix" + i).innerHTML = "Non renseigné";
                } else {
                    document.querySelector("#prix" + i).innerHTML = data.businesses[i].price;
                }
                createMarker(data.businesses[i], restoName, distanceResto, adressResto, photoResto, phoneResto, prixResto, noteResto);
                $("#jiji" + i).click(function () {
                    winnie = $(this).attr("blob");
                    for (o = 0; o < markers.length; o++) {
                        markers[o].setIcon();
                    }
                    colorChangeTest(winnie);
                    //alert(winnie);
                });


            }

            console.log(data);


        }

    });
};

//La fonction createMarker, crée des markers. Je sais c'est dingue !
function createMarker(place, placeName, distance, address, photo, phone, price, note) {


    var contenuInfoBulle = '<h1>' + placeName + " (" + distance + "m)" + '</h1>' +
        '<h4>' + price + " " + note + "/5" + '</h4>' +
        '<p>' + address + '</p>' +
        '<p>' + phone + '</p>' +
        '<img src="' + photo + '"/>';


    latlong = new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude);
    marker = new google.maps.Marker({
        position: latlong,
        map: map,
        title: placeName + " à " + distance + "m"
    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contenuInfoBulle);
        infowindow.open(map, this);
    });
};
//Cette fonction change la couleur des markers
function colorChangeTest(nombrelol) {
    markers[nombrelol].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
}


function colorChange(supernombre) {
    for (var i = 0; i < markers.length; i++) {
        markers[supernombre].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    }
}
//$("#nom0").click(colorChange(0));