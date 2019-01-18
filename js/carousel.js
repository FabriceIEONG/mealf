/* CAROUSEL functions
* Javascript de "index.html"
*/
/* Générateur du carousel */
$.ajax({
    url: "js/cuisine.json",
    dataType: "json",
    method: "GET",
}).done(function (response) {
    // Mélange aléatoire du tableau
    var listCuisine = shuffle(response);

    for (var i = 0; i < response.length; i++) {
        // Structure HTML d'un slide
        $('.carousel').append('<a href="maps.html"><div class="car_slide"><div class="car_img car' + (i + 1) + '"></div></div></a>');
        $('.car' + (i + 1)).append('<div class="car_details">' + response[i].nom + '</div>');
        $('.car' + (i + 1)).css('background-image', 'url("img/type/' + response[i].url + '")');
    }

    /* CAROUSEL functions */
    $('.carousel').slick({
        draggable: true,
        mobileFirst: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<div class="car_arrow car_prev">Back<div class="line_index prev"></div></div>',
        nextArrow: '<div class="car_arrow car_next">Next<div class="line_index next"></div></div>',
        responsive: [
            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    });

    // Change la variable miam au click
    $('.car_img').click(function () {
        var choix = $(this).children().html();
        sessionStorage.setItem('miam', choix);
        //console.log(choix);
    });

});

// Fonction mélange de tableau
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // Tant qu'il y a des éléments à mélanger
    while (0 !== currentIndex) {

        // Prend un élément restant
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Et l'échange avec l'élément actuel
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function pressEnter(event) {
    var code=event.which || event.keyCode; //Selon le navigateur c'est which ou keyCode
    if (code==13) { //le code de la touche Enter
        if ($("#choixUser").val()!=""){
            var choix = document.getElementById("choixUser").value;
            sessionStorage.setItem('miam', choix);
            //console.log(choix);
            document.location.href="maps.html"; 
        }
    }
}

function searchOnClick(){
    if ($("#choixUser").val()!=""){
        var choix = document.querySelector("#choixUser").value;
        sessionStorage.setItem('miam', choix);
        //console.log(choix); 
        document.location.href="maps.html";  
    }

}
