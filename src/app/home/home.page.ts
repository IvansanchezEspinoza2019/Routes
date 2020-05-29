import {Component, ElementRef, NgZone, ViewChild, OnInit} from '@angular/core';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
// IMPORTAR EL OBJETO DE CONFIGURACION 
import { environment } from '../../environments/environment';


// global variables
declare var google: any;
var map: any;
var servicioDireccion: any;
var directionsRenderer: any;

// to save the final coords
var coords_origin: any;
var coords_destiny: any

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

  apiUrl: string = "https://maps.googleapis.com/maps/api/geocode/json"
 
  constructor(private http: HttpClient) {
    // constructor
    console.log(environment.googleMapsApi.apiKey)
  }


  
  address = {
    "origin": "",
    "destiny": ""
  }


  ngOnInit(){
    // init the map
    this.loadMap()
  }

  setCoords(coords){
    console.log("Funcion de la clase");
   
}

  loadMap(){

    // load the map and directions service for getting routes
    var mapProp = {
      center: new google.maps.LatLng(20.656968422988143, -103.32492740554504),
      zoom: 15,
    };

    // creating the map
    map = new google.maps.Map(document.getElementById('map'), mapProp);
    servicioDireccion = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
  }

  setAutocomplete(){
 
      // creating the autocomplete for origin and destiny searchbar  
      // and setting the 'place_changed' functions

      // searchbar for origin
      let search_origin = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[0];
      // searchbar for destiny
      let search_destiny = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[1];
      
      ////////////// origin //////////
      // creating autocomplete google object
      var autCompleteOrigin = new google.maps.places.Autocomplete(
        (search_origin));
        autCompleteOrigin.addListener('place_changed', function(){// get the place 
          var placeOrigin = autCompleteOrigin.getPlace();
      
          if (!placeOrigin.geometry) {
            // if the place does not have a latitud and longitud
            console.log("Could not get coordinates from: "+ placeOrigin.name);
            coords_origin = null;
            return;
          }
          console.log('Starting place: ' + placeOrigin.formatted_address);

          // getting latitud and longitud form the selected place
          var coords = {
            "lat": placeOrigin.geometry.location.lat(),
            "lng": placeOrigin.geometry.location.lng()
          }
          // savin the coords
         coords_origin = coords 
      } );

    
      ////////// destiny //////////
      // creating autocomplete google object
      var autCompleteDestiny = new google.maps.places.Autocomplete(
        (search_destiny));
        autCompleteDestiny.addListener('place_changed', function() {

        // get the pace
        var placeDestiny = autCompleteDestiny.getPlace();
    
        if (!placeDestiny.geometry) {
          // if the place does not have a latitud and longitud
          console.log("Could not get coordinates from: "+ placeDestiny.name);
          coords_destiny = null;
          return;
        }
        // if the place has latitud and longitud
        console.log('Destiny place: ' + placeDestiny.formatted_address);

        var coords = {
          "lat": placeDestiny.geometry.location.lat(),
          "lng": placeDestiny.geometry.location.lng()
        }
        // saving the coords
        coords_destiny = coords;

      });
  }
  

  ionViewWillEnter(){
    // this function is used because we need the DOM to be loaded

    console.log("DOM CHARGED");

    // set the autocomplete listener functions
    this.setAutocomplete();
  }


  getRoute(origin_coords, destiny_coords) {

    // funcion que obtiene ruta entre dos puntos
    /// se pasan como parámetro las coordenadas de origen y destino

    // comvierte las coordenadas en tipo de dato "LatLng" de google maps
    var inicio=new google.maps.LatLng(origin_coords.lat, origin_coords.lng);
    var fin=new google.maps.LatLng(destiny_coords.lat, destiny_coords.lng);
    
    // guadamos nuestros parámetros
    var peticion = {
      origin:inicio,
      destination:fin,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
    
    };

    // referencia al mapa 
    directionsRenderer.setMap(map);
    servicioDireccion.route(peticion, function(response, status) {
        
      // esto verifica el estatus de la peticion
      if (status === 'OK') {
        // si es entonces pondrá las direcciones en el mapa
        directionsRenderer.setDirections(response);
      }else {
        // sino mostrará un mensaje de error
        window.alert('Directions request failed due to ' + status);
      }
      // imprime el resultado de la peticion
      console.log(response);
    });

  }

  getOriginCoords(){
    // obtiene la locacion del origen mediante una direccion (string) dado
    let getLatLngOrigin = new Promise<any>((resolve, reject)=>{
      this.http.get(this.apiUrl, {
        params: {
          address: this.address.origin,
          key: 'AIzaSyBMkmpcK2Ic4SezUQrh6SRVrMO_IRL043o'
        }
      })
      .subscribe(res=>{resolve(res)}, err=>{reject(err)})
    });


    async function getCoords(): Promise<any>{

      let origin = await getLatLngOrigin;


      let coords = {
        "lat": origin.results[0].geometry.location.lat,
        "lng": origin.results[0].geometry.location.lng
      }
      coords_origin = coords;
    }


    getCoords().then(res=>{
      console.log(res);
      if(coords_destiny){
        //calculating the route
        this.getRoute(coords_origin,coords_destiny);
      }
      
    }, err=>{
      // errors
      console.log("Wrong origin, please enter a valid place!");
      console.log(err)
    })

  }


  getDestinyCoords(){
    // obtiene la locacion del origen mediante una direccion (string) dado
    let getLatLngDestiny = new Promise<any>((resolve, reject)=>{
      this.http.get(this.apiUrl, {
        params: {
          address: this.address.destiny,
          key: 'AIzaSyBMkmpcK2Ic4SezUQrh6SRVrMO_IRL043o'
        }
      })
      .subscribe(res=>{resolve(res)}, err=>{reject(err)})
    });


    async function getCoords(): Promise<any>{

      let destiny = await getLatLngDestiny;


      let coords = {
        "lat": destiny.results[0].geometry.location.lat,
        "lng": destiny.results[0].geometry.location.lng
      }
      coords_destiny = coords;
    }


    getCoords().then(res=>{

      console.log(res);
      if(coords_origin){
        //calculating the route
        this.getRoute(coords_origin,coords_destiny);
      }
      
    }, err=>{
      // errors
      console.log("Wrong destiny, please enter a valid place!");
      console.log(err)
    })

  }
  

  initProcess(){
    console.log(coords_origin)
    console.log(coords_destiny)
      if ( !coords_origin  || ! coords_destiny){
          if (!coords_origin && coords_destiny){
            // if we have the destiny coordinates, but no the origin coordinates
            this.getOriginCoords();
            

          }
          else if (coords_origin && !coords_destiny){
             // if we have the origin coordinates, but no the destiny coordinates
             this.getDestinyCoords();
              
          }
          else{
             // if we not have any coordinates
              this.getBothCoords()
          }
      }
      else{
        console.log("ALL GOOD");
        this.getRoute(coords_origin, coords_destiny);
      }  
    }

    desactOrigin(){
      coords_origin = null;
    }
    desactDestiny(){
      coords_destiny = null;
    }
    
    getBothCoords(){
      // inicia los procesos necesario para obtener la ruta entre dos puntos

      // obtiene la locacion del origen mediante una direccion (string) dado
      let getLatLngOrigin = new Promise<any>((resolve, reject)=>{
        this.http.get(this.apiUrl, {
          params: {
            address: this.address.origin,
            key: 'AIzaSyBMkmpcK2Ic4SezUQrh6SRVrMO_IRL043o'
          }
        })
        .subscribe(res=>{resolve(res)}, err=>{reject(err)})
      });

      // obtiene la locacion del destino mediante una direccion (string) dado
      let getLatLngDestiny= new Promise<any>((resolve, reject)=>{
        this.http.get(this.apiUrl, {
          params: {
            address: this.address.destiny,
            key: 'AIzaSyBMkmpcK2Ic4SezUQrh6SRVrMO_IRL043o'
          }
        })
        .subscribe(res=>{resolve(res)}, err=>{reject(err)})
      });


      
      async function getCoords(): Promise<any> {
        // funcion asícrona necesaria para esperar a la respuesta de la api
       // de google, tanto para la peticion de origen como la de destino

        // hace la peticion para el origen
        let origin = await getLatLngOrigin;
        // hace la peticion para el destino
        let destiny = await getLatLngDestiny;


        // la funcion await significa que no va ha avanzar el el codigo de 
        // abajo hasta que termine de ejecutar la promesa
       
        // crea un objeto con los datos de origen y destino
        let coordsOrigin = {
          "lat": origin.results[0].geometry.location.lat,
          "lng": origin.results[0].geometry.location.lng,
        }

        coords_origin = coordsOrigin;

        let coordsDestiny = {
          "lat": destiny.results[0].geometry.location.lat,
          "lng": destiny.results[0].geometry.location.lng,
        }

        coords_destiny = coordsDestiny;

    
      }


      // finalmente llamamos a la funcion asíncrona
      getCoords().then(result => {
        // cuando se llega a este punto, ya se habra obtenido una respuesta
        // para el origen y destino que hicimos anteriormente
        
        // imprime los resultados
        console.log(result);

        // manda a llamar a la funcion que calculará la ruta, enviándole los 
        // datos obtenidos
        this.getRoute(coords_origin, coords_destiny);


      }, err =>{
        console.log("Wrong origin and destiny, please enter valid places!");
        console.log(err)
      })

    }
}