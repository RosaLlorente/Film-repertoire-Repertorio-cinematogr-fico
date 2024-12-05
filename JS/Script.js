let BusquedaPelicula = "", paginaActual = 1, peticionEnCurso = false;
window.onload = () => {
    const btnIrRepositorio = document.getElementById("IrRepositorio");
    const SeccionBienvenida = document.getElementById("SeccionBienvenida");
    const SeccionDetalle = document.getElementById("SeccionDetalle");
    const SeccionPeliculas = document.getElementById("SeccionPeliculas");
    const SeccionInforme = document.getElementById("SeccionInforme");
    const CitaCine = document.getElementById("CitaCine");
    const body = document.querySelector("body");
    const ElementoTomas = document.getElementById("ElementoTomas");
    MusicBackground();
    btnIrRepositorio.addEventListener("click", () => //Evento para activar y desactivar sección
    {
        if (SeccionBienvenida.style.display === "none") 
        {
            SeccionBienvenida.style.display = "flex"; 
            SeccionPeliculas.style.display = "none";
            SeccionDetalle.style.display = "none";
            body.style.overflow = "hidden";
            body.style.position = "fixed";
        } 
        else 
        {
            SeccionBienvenida.style.display = "none"; 
            SeccionPeliculas.style.display = "flex"; 
            SeccionDetalle.style.display = "none";
            body.style.overflow = "visible";
            body.style.position = "static";
        }
    });

    setInterval(() => {
        ElementoTomas.style.animation = 'none'; 
        void ElementoTomas.offsetWidth; 
        ElementoTomas.style.animation = 'Resaltar 0.5s ease forwards'; 
    }, 3000);
    ElementoTomas.addEventListener("click", () =>
    {
        if (CitaCine.style.display === "none" || CitaCine.style.display === "") 
        {
            CitaCine.style.display = "flex"; 
        } 
        else 
        {
            CitaCine.style.display = "none";
        }
    });

    //APIKey = fecc66b8&
    document.getElementById("BuscarPelicula").addEventListener("keydown", (e) =>
    {
        if (e.target.value.length >= 3) 
        {
            if (e.type === "keydown" && e.key === "Enter") 
            {
                BuscarPelicula();
            }
        }
    });

    document.getElementById("Buscar").addEventListener("click", BuscarPelicula);
};

function BuscarPelicula()
{
    
    let topPorRating,topPorRecaudacion,topPorValoracion;
    document.getElementById("Informe").style.backgroundColor = "rgb(0, 238, 255)";
    document.getElementById("Informe").style.color = "rgb(10,10,10,255)";
    let BusquedaPelicula = document.getElementById("BuscarPelicula").value;
    let TipoBusqueda = document.getElementById("TipoBusqueda").value;
    document.getElementById("TipoBusqueda").addEventListener("change", () => {
        paginaActual = 1;  
        document.getElementById("Lista_Peliculas").innerHTML = "";
        document.getElementById("NResultados").innerHTML = "";
    });
    document.getElementById("BuscarPelicula").addEventListener("change", () => {
        paginaActual = 1;  
        document.getElementById("Lista_Peliculas").innerHTML = ""; 
        document.getElementById("NResultados").innerHTML = "";
    });
    paginaActual = 1;
    fetch("https://www.omdbapi.com/?apikey=fecc66b8&s=" + BusquedaPelicula + "&type=" + TipoBusqueda,{method: "GET"})
    .then((res) => res.json())
    .then((datosRecibidos) =>
    {
        document.getElementById("NResultados").innerHTML = "Se han encontrado " + datosRecibidos.totalResults + " resultados";
        let Lista_Peliculas = document.getElementById("Lista_Peliculas");
        console.log(datosRecibidos);
        Lista_Peliculas.innerHTML = "";
        agregarPeliculas(datosRecibidos);
    })
    .catch((err) => console.log("error".err));
    document.getElementById("Informe").addEventListener("click",() =>
    {Informe(topPorRating);});
    window.addEventListener("scroll",() => 
    {
        document.getElementById("cabecera").style.opacity = "0.8";
        const endOfPage = window.innerHeight + window.pageYOffset >= (document.body.offsetHeight*0.8);
        if(endOfPage)
        {
            if(!peticionEnCurso)
            {
                peticionEnCurso = true;
                Buscarmas();
            }
        }
    })
}
function agregarPeliculas(datosRecibidos)
{
    let Lista_Peliculas = document.getElementById("Lista_Peliculas");
    datosRecibidos.Search.forEach((movie) => 
    {
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.idPelicula = movie.imdbID;
        img.src = movie.Poster;
        let urlDefault = "/imagenes/ErrorImg.gif";
        img.addEventListener("error",(e)=>
        {
            e.target.src = urlDefault;
        });
        img.addEventListener("click",() =>
        {
            if (SeccionPeliculas.style.display === "none") 
            {
                SeccionPeliculas.style.display = "flex"; 
                SeccionDetalle.style.display = "none";
            } 
            else 
            {
                SeccionPeliculas.style.display = "none"; 
                SeccionDetalle.style.display = "flex"; 
                VerDetalles(movie.imdbID);
            }
        });
        li.appendChild(img);
        let titulo = movie.Title !== "N/A" ? movie.Title : "Título no disponible";
        li.appendChild(document.createTextNode(titulo));
        Lista_Peliculas.appendChild(li);
    });
}
function Buscarmas()
{
    let BusquedaPelicula = document.getElementById("BuscarPelicula").value;
    let TipoBusqueda = document.getElementById("TipoBusqueda").value;
    paginaActual++;
    peticionEnCurso = true;
    fetch("https://www.omdbapi.com/?apikey=fecc66b8&s=" + BusquedaPelicula + "&type=" + TipoBusqueda + "&page=" + paginaActual, {method: "GET"})
        .then((res) => res.json()) 
        .then((datosRecibidos) =>  
        {
            agregarPeliculas(datosRecibidos); 
            console.log(datosRecibidos);
            peticionEnCurso = false;
        })
        .catch((err) => console.log("Error:".err));
}
function VerDetalles(idPelicula)
{
    let VolverAtras = document.getElementById("VolverAtras");
    console.log("La id es " + idPelicula);
    if (!VolverAtras.dataset.eventAdded) 
    {
        VolverAtras.addEventListener("click", () => 
        {
            if (SeccionDetalle.style.display === "flex") 
            {
                SeccionDetalle.style.display = "none";
                SeccionPeliculas.style.display = "flex";
            }
        });
        VolverAtras.dataset.eventAdded = "true";
    }
    setInterval(() => 
    {
        VolverAtras.style.animation = 'none'; 
        void VolverAtras.offsetWidth; 
        VolverAtras.style.animation = 'Resaltar2 1s ease forwards'; 
    }, 5000);
    let ImagenPelicula = document.getElementById("ImagenPelicula");
    url = "https://www.omdbapi.com/?&apikey=fecc66b8&i="+ idPelicula;
    fetch(url,{method: "GET"})
        .then((res) => res.json()) 
        .then((datosRecibidos) =>  
        {
            console.log("Datos recibidos de la API:", datosRecibidos);
            ImagenPelicula.innerHTML = "";
            let img = document.createElement("img");
            img.src = datosRecibidos.Poster;
            let urlDefault = "/imagenes/ErrorImg.gif";
            img.addEventListener("error",(e)=>
            {
                e.target.src = urlDefault;
            });
            ImagenPelicula.appendChild(img);
            let Titulo = document.createElement("b");
            Titulo.innerHTML = datosRecibidos.Title !== "N/A" ? datosRecibidos.Title : "Título no disponible";
            ImagenPelicula.appendChild(Titulo);
            document.getElementById("Tipo").innerHTML = "<b>Tipo:</b> " + (datosRecibidos.Type !== "N/A" ? datosRecibidos.Type : "No disponible");
            document.getElementById("Anio").innerHTML = "<b>Año:</b> " + (datosRecibidos.Year !== "N/A" ? datosRecibidos.Year : "No disponible");
            document.getElementById("Pais").innerHTML = "<b>Pais:</b> " + (datosRecibidos.Country !== "N/A" ? datosRecibidos.Country : "No disponible");
            document.getElementById("Genero").innerHTML = "<b>Genero:</b> " + (datosRecibidos.Genre !== "N/A" ? datosRecibidos.Genre : "No disponible");
            document.getElementById("Lenguaje").innerHTML = "<b>Lenguaje:</b> " + (datosRecibidos.Language !== "N/A" ? datosRecibidos.Language : "No disponible");
            document.getElementById("Director").innerHTML = "<b>Director:</b> " + (datosRecibidos.Director !== "N/A" ? datosRecibidos.Director : "No disponible");
            document.getElementById("Actores").innerHTML = "<b>Actores:</b> " + (datosRecibidos.Actors !== "N/A" ? datosRecibidos.Actors : "No disponible");
            document.getElementById("Sinopsis").innerHTML = "<b>Sinopsis:</b> " + (datosRecibidos.Plot !== "N/A" ? datosRecibidos.Plot : "No disponible");
            document.getElementById("Guionista").innerHTML = "<b>Guionista:</b> " + (datosRecibidos.Writer !== "N/A" ? datosRecibidos.Writer : "No disponible");
            document.getElementById("Duración").innerHTML = "<b>Duración:</b> " + (datosRecibidos.Runtime !== "N/A" ? datosRecibidos.Runtime : "No disponible");
            document.getElementById("Clasificacion").innerHTML = "<b>Clasificación:</b> " + (datosRecibidos.Rated !== "N/A" ? datosRecibidos.Rated : "No disponible");
            document.getElementById("FechaLanzamiento").innerHTML = "<b>Fecha de lanzamiento:</b> " + (datosRecibidos.Released !== "N/A" ? datosRecibidos.Released : "No disponible");
            document.getElementById("Premios").innerHTML = "<b>Premios:</b> " + (datosRecibidos.Awards !== "N/A" ? datosRecibidos.Awards : "No disponible");
            document.getElementById("Taquilla").innerHTML = "<b>Taquilla:</b> " + (datosRecibidos.BoxOffice !== "N/A" ? datosRecibidos.BoxOffice : "No disponible");
            document.getElementById("Productora").innerHTML = "<b>Productora:</b> " + (datosRecibidos.Production !== "N/A" ? datosRecibidos.Production : "No disponible");
            document.getElementById("SitioWeb").innerHTML = "<b>Sitio web:</b> " + (datosRecibidos.Website !== "N/A" ? '<a href="' + datosRecibidos.Website + '" target="_blank">Enlace</a>' : "No disponible");            
        })
    .catch((err) => console.log("Error".error));
}
function VolverAtras() {
    let SeccionDetalle = document.getElementById("SeccionDetalle");
    let SeccionPeliculas = document.getElementById("SeccionPeliculas");

    if (SeccionDetalle.style.display === "flex") {
        SeccionDetalle.style.display = "none";
        SeccionPeliculas.style.display = "flex";
    } else {
        SeccionDetalle.style.display = "flex";
        SeccionPeliculas.style.display = "none";
    }
}
function Informe(topPorRating) 
{
    if (SeccionInforme.style.display === "none" ||SeccionInforme.style.display === "") 
    {
        SeccionInforme.style.display = "flex"; 
        SeccionPeliculas.style.display = "none";
        SeccionBienvenida.style.display = "none"; 
    } 
    else 
    {
        SeccionInforme.style.display = "none"; 
        SeccionPeliculas.style.display = "flex"; 
        SeccionBienvenida.style.display = "none"; 
    }
    let VolverAtras2 = document.getElementById("VolverAtras2");
    if (!VolverAtras2.dataset.eventAdded) 
    {
        VolverAtras2.addEventListener("click", () => 
        {
            if (SeccionInforme.style.display === "flex") 
            {
                SeccionInforme.style.display = "none";
                SeccionPeliculas.style.display = "flex";
            }
        });
        VolverAtras2.dataset.eventAdded = "true";
    }
    setInterval(() => 
    {
        VolverAtras2.style.animation = 'none'; 
        void VolverAtras2.offsetWidth; 
        VolverAtras2.style.animation = 'Resaltar2 1s ease forwards'; 
    }, 5000);

    //grafico
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(() => drawChart(topPorRating));
}

function drawChart(topPorRating) {
    var data = google.visualization.arrayToDataTable([
        ['ID', 'X', 'Y', 'votos','Size'],  
        ['Pelicula A', 1, 167, 1,3],  
        ['Pelicula B', 2, 136, 2,2], 
        ['Pelicula C', 3, 184, 3,3],  
        ['Pelicula D', 4, 28, 4,4],  
        ['Pelicula E', 5, 200, 5,5]   
    ]);

    var options = {
        colorAxis: { 
            minValue: 0,  
            maxValue: 5, 
            colors: ['#00E6FF', '#FF69B4'] },    
        sizeAxis: { minSize: 10, maxSize: 40 },    
        animation: 
        {
            duration: 8000,  
            easing: 'inAndOut',   
            startup: true   
        },
        chartArea: 
        {
            left: 100, 
            top: 50,
            width: '100%', 
            height: '50%'
        },
        hAxis:
        {
            title: 'Películas',    
            minValue: 0,          
            maxValue: 6,           
            format: 'decimal'     
        },
        vAxis: 
        {
            title: 'Cantidad de Votos',   
            minValue: 0,           
            maxValue: 300          
        }
    };

    var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
//Function to insert background music
function MusicBackground() 
{
    const KeySound = new Audio('Sonidos/MusicaFondo.mp3');
    KeySound.loop = true; 
    KeySound.volume = 0.6; 
    let musicaIniciada = false; 

    const estado = document.getElementById('estado');
    const musica = document.getElementById('musica');

    // Reproducir música por interacción del usuario
    document.body.addEventListener('click', () => 
    {
        if (!musicaIniciada) {
            KeySound.play().catch((error) => 
            {
                console.warn("Reproducción automática bloqueada. Asegúrate de interactuar con la página:", error);
            });
            musicaIniciada = true;
            estado.textContent = 'ON'; 
        }
    });

    document.body.addEventListener('keydown', () => 
    {
        if (!musicaIniciada) 
        {
            KeySound.play().catch((error) => 
            {
                console.log("Reproducción automática bloqueada. Asegúrate de interactuar con la página:", error);
            });
            musicaIniciada = true;
            estado.textContent = 'ON'; 
        }
    });

    musica.addEventListener('click', () => 
    {
        if (KeySound.paused) 
        {
            KeySound.play();
            estado.textContent = 'ON'; 
        } 
        else 
        {
            KeySound.pause();
            estado.textContent = 'OFF'; 
        }
    });
}
