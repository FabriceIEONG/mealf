/* API Javascript
* Javascript de "maps.html"
*/
//Fonction principale // //////
var miam, myLocation, map, interest, service, infowindow, lat, long, latlong, marker, contentString; //Déclaration des variables en global scope
var distance = 2000; //Cette valeur est en brut pour tester la recherche sur 500m
var markers = []; // C'est un array qui me permettra de clear la map plus tard

// miam correspond au choix du user. Il est stocké dans une variable de session.
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
//Si la map s'est générée avec succés, on la centre sur notre position et la fonction manger() s'execute.
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
    var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + myLocation.lat() + "<br />Longitude: " + myLocation.lng(),
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "blue",
            fillOpacity: 0.7,
            strokeColor: "blue",
            strokeOpacity: 0.7,
            strokeWeight: 0,
            scale: 8
        },
    });
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
    console.log(miam); //Ce console log permet de verifier quelle recherche à été rentrée par l'utilisateur
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
                // Si pas de résultat
                $('.lieu').append('<div class="noresult">Pas de restaurants  :( <br><a href="index.html"><button type="button" class="btn btn-success btn-noresult">Recommencez la recherche</button></a>');
            }
            //Les restaurants sont mis dans l'ordre de distance
            data.businesses.sort(function (a, b) {
                return a.distance - b.distance;
            });
            //La ligne ci-dessous fait disparaitre l'animation de chargement lorsque les requetes sont terminées
            $("#loading").hide();
            $(".googlemap").removeClass("d-none");
            //On commence par générer l'HTML dynamiquement en fonction du nombre de résultats
            for (i = 0; i < data.businesses.length; i++) {
                $(".lieu").append('<div class="row donnee"><div class="col-12" nbrattr="' + i + '" id="busiResult' + i + '"></div></div>');
                $(".lieu").append('<div class="donnee_details" nbrattr="'+i+'"></div>');
                $("#busiResult" + i).append('<div class="row"> <div class="col-12"> <div id="nom' + i + '" class="name">Nom du Restaurant 1</div> </div> </div> <div class="row"><div class="col-6"><div id="adresse' + i + '">12 Av philippe Auguste,</br>75011 Paris</div><div id="tel' + i + '">01.89.09.23.34</div></div><div class="col-6 distance"> <div id="distance' + i + '">Situé à 4kms</div><div id="prix' + i + '"> 12€-17€</div><div id="note' + i + '">20/20</div></div></div></div>')
                var restoName = data.businesses[i].name;
                var distanceResto = data.businesses[i].distance.toFixed(0);
                var adressResto = data.businesses[i].location.display_address;
                var photoResto = data.businesses[i].image_url;
                var phoneResto = data.businesses[i].display_phone;
                var noteResto = data.businesses[i].rating;
                //console.log(distanceResto);
                //On met toutes les valeurs dans les differentes div de resultats
                document.querySelector("#nom" + i).innerHTML = restoName.toUpperCase();
                document.querySelector("#adresse" + i).innerHTML = adressResto;
                document.querySelector("#tel" + i).innerHTML = phoneResto;
                document.querySelector("#distance" + i).innerHTML = distanceResto + " m";
                document.querySelector("#note" + i).innerHTML = noteResto + "/5";
                prixResto = data.businesses[i].price;
                //On change le message d'erreur si le resto ne renseigne pas son "prix".
                if (prixResto == undefined) {
                    document.querySelector("#prix" + i).innerHTML = "Non renseigné";
                } else {
                    document.querySelector("#prix" + i).innerHTML = data.businesses[i].price;
                }
                createMarker(data.businesses[i], restoName, distanceResto, adressResto, photoResto, phoneResto, prixResto, noteResto, i);

                //On fait changer l'icone des markers avec le Hover sur le nom des restau
                $("#busiResult" + i).mouseenter(function () {
                    winnie = $(this).attr("nbrattr"); colorChangeTest(winnie);
                }).mouseleave(function () {
                    for (o = 0; o < markers.length; o++) {
                        markers[o].setIcon('../img/marker.jpg');
                    }
                }).click(function () {
                    winnie = $(this).attr("nbrattr");
                    itineraire(winnie);
                })

            }
            
            /* Fonction hover et click des données récupérées */
            $(".donnee").hover(function() {
                $(this).addClass('donnee_hover');
            }, function() {
                $(this).removeClass('donnee_hover');
            });

            $(".donnee").click(function() {
                $(".donnee").removeClass('donnee_click');
                $(this).addClass('donnee_click');
            });
            
        }

    });
};

//La fonction createMarker, crée des markers. Je sais c'est dingue !
function createMarker(place, placeName, distance, address, photo, phone, price, note, nbDiv) {

    //On definit le contenu de l'infoBulle
    var contenuInfoBulle = '<h4>' + placeName + " (" + distance + "m)" + '</h4>'/*  +
            '<h4>' + price + " " + note + "/5" + '</h4>' +
            '<p>' + address + '</p>' +
            '<p>' + phone + '</p>' +
            '<img src="' + photo + '"/>'; */

    //Les markers sont posés sur la map
    latlong = new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude);
    var image = {
        // Adresse de l'icône personnalisée
        url: '../img/marker.jpg',
       
        
    };
    marker = new google.maps.Marker({
        position: latlong,
        map: map,
        title: placeName + " à " + distance + "m",
        icon: image,
        tag: $("#busiResult" + nbDiv)
    });
    
    //on pousse les markers dans l'array, et on rajoute un event de click sur les markers pour l'infobulle
    markers.push(marker);
    var thisPosition = marker.position;
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(contenuInfoBulle);
        focusBusiness(this.tag);
        infowindow.open(map, this);
        itineraire2(thisPosition, this.tag);
    });
};
//Cette fonction change la couleur des markers
function colorChangeTest(nombrelol) {
    markers[nombrelol].setIcon('../img/marker-logo.png');
}

//Prépare les options de l'itinéraire
directionsDisplay = new google.maps.DirectionsRenderer({
    polylineOptions: {
        strokeColor: "#1AA184",
        strokeWeight: 5
    },
    markerOptions : {
        visible : false
    }
});

function itineraire(nombrelol) {

    directionsDisplay.setMap(map);

    var request = {
        origin: myLocation,
        destination: markers[nombrelol].position,
        travelMode: google.maps.TravelMode.WALKING,
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var point = response.routes[0].legs[0];
            $('.donnee_details[nbrattr="'+nombrelol+'"]').html('Temps estimé: ' + point.duration.text + ' (' + point.distance.text + ')');
            $('.donnee_details[nbrattr="'+nombrelol+'"]').css('height', '33px');
            $('.donnee_details[nbrattr="'+nombrelol+'"]').css('padding', '0.3em 0.3em 0.3em 2em');
        }
    });

}
function itineraire2(destinationMarker, deev) {

    directionsDisplay.setMap(map);

    var request = {
        origin: myLocation,
        destination: destinationMarker,
        travelMode: google.maps.TravelMode.WALKING
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var point = response.routes[0].legs[0];
            var attri = deev.attr('nbrattr');
            $('.donnee_details[nbrattr="'+attri+'"]').html('Temps estimé: ' + point.duration.text + ' (' + point.distance.text + ')');
            $('.donnee_details[nbrattr="'+attri+'"]').css('height', '33px');
            $('.donnee_details[nbrattr="'+attri+'"]').css('padding', '0.3em 0.3em 0.3em 2em');
            //console.log($('.donnee_details[nbrattr="'+attri+'"]'));
        }
    });

}

/* FONCTION HOVER ET CLIQUE de Business */
function focusBusiness(deev) {
    $(".donnee").removeClass('donnee_click');
    $(deev.parent()).addClass('donnee_click');
}