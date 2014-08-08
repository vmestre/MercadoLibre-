$(document).ready(inicializar);

function inicializar() {


    $("#botonBuscar").click(buscar);
    $("#botonBuscar").click(recargarCategorias);
    $("#verMas").click(siguiente);
    $("#mayorPrecio").click(ordenarMayorPrecio);
    $("#menorPrecio").click(ordenarMenorPrecio);
    $("#listaCategorias").children().click(filtrarPorCategoria);
    $("#listaCategorias").children().click(traerSubcategorias);
    $("#recargarCategorias").click(recargarCategorias);
}

var datos;

$.ajax({url: "https://api.mercadolibre.com/sites/MLA/categories",
    type: "get",
    dataType: "json"}).done(cargarCategorias);

var cat;

function cargarCategorias(_cat) {
    $("#listaCategorias").empty();
    cat = _cat;
    for (var i = 0; i < cat.length; i++) {

        $("#listaCategorias").append("<li id='" + cat[i].id + "'><a href=''> " + cat[i].name + "</a></li>");
    }
    $("#listaCategorias").children().click(filtrarPorCategoria);
    $("#listaCategorias").children().click(traerSubcategorias);
}

function recargarCategorias(){
    
    cargarCategorias(cat);
    $("#categoriasSeleccionadas").empty();
}


var miCat;

function filtrarPorCategoria() {
    $("#listaRes").empty();
    miCat = $(this).attr("id");
    $.ajax({url: "https://api.mercadolibre.com/sites/MLA/search?category=" + miCat,
        type: "get",
        dataType: "json"}).done(mostrarDatos);

}

function traerSubcategorias() {

    $("#listaCategorias").empty();
    
    $.ajax({url: "https://api.mercadolibre.com/categories/" + miCat,
        type: "get",
        dataType: "json"}).done(cargarSubcategorias);


}

var miCategoriaDatos;

function cargarSubcategorias(_miCategoriaDatos) {
    miCategoriaDatos = _miCategoriaDatos;

    for (var i = 0; i < miCategoriaDatos.children_categories.length; i++) {

        $("#listaCategorias").append("<li id='" + miCategoriaDatos.children_categories[i].id + "'><a href=''> " + miCategoriaDatos.children_categories[i].name + "</a></li>");
    }
   
    $("#categoriasSeleccionadas").html(miCategoriaDatos.name);
    
    $("#listaCategorias").children().click(filtrarPorCategoria);
    $("#listaCategorias").children().click(traerSubcategorias);
}


var palabra;

function buscar() {
    $("#listaRes").empty();
    palabra = $("#palabra").val();

    $.ajax({url: "https://api.mercadolibre.com/sites/MLA/search?q=" + palabra,
        type: "get",
        dataType: "json"}).done(mostrarDatos);
}



function mostrarDatos(_datos) {
    datos = _datos;
    for (var i = 0; i < datos.results.length; i++) {

        $("#listaRes").append("<li id='" + datos.results[i].id + "'><a href=''>" + datos.results[i].title + " --- $" + datos.results[i].price
                + " ---- <img src='" + datos.results[i].thumbnail + "'/></a></li>");
    }
    $("#listaRes").children().click(cargarItem);

}

var cantidad = 0;

function siguiente() {
    cantidad += 50;
    $.ajax({url: "https://api.mercadolibre.com/sites/MLA/search?q=" + palabra + "&offset=" + cantidad,
        type: "get",
        dataType: "json"}).done(mostrarMasDatos);
}

function mostrarMasDatos(_masDatos) {

    datos = _masDatos;

    $("#listaRes").empty();

    mostrarDatos(datos);

}

var datosItem;

function mostrarDatosItem(_datosItem) {
    datosItem = _datosItem;
    $("#foto").html('<img src = "' + datosItem.thumbnail + '"/>');

    $("#titulo").html(datosItem.title);

    $("#precio").html("$" + datosItem.price);

    $.ajax({url: "https://api.mercadolibre.com/items/" + datosItem.id + "/descriptions",
        type: "get",
        dataType: "json"}).done(mostrarDescripcion);

}

var descDatos;

function mostrarDescripcion(_descDatos) {
    descDatos = _descDatos;
    $("#descripcion").html(descDatos[0].text);

}

function cargarItem() {
    var miId = $(this).attr("id");
    $(":mobile-pagecontainer").pagecontainer("change", "#pagina2");
    $.ajax({url: "https://api.mercadolibre.com/items/" + miId,
        type: "get",
        dataType: "json"}).done(mostrarDatosItem);

}


function ordenarMayorPrecio() {

    $("#listaRes").empty();

    for (var i = 1; i < datos.results.length; i++) {
        var aux = datos.results[i];
        var j = i - 1;
        while (j >= 0 && datos.results[j].price < aux.price) {
            datos.results[j + 1] = datos.results[j];
            j--;
            datos.results[j + 1] = aux;
        }
    }
    mostrarDatos(datos);

}


function ordenarMenorPrecio() {

    $("#listaRes").empty();

    for (var i = 1; i < datos.results.length; i++) {
        var aux = datos.results[i];
        var j = i - 1;
        while (j >= 0 && datos.results[j].price > aux.price) {

            datos.results[j + 1] = datos.results[j];
            j--;
        }
        datos.results[j + 1] = aux;
    }

    mostrarDatos(datos);
}






