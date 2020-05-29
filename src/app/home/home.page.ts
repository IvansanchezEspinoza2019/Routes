import {Component, ElementRef, NgZone, ViewChild, OnInit} from '@angular/core';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

// import the google maps api key
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
    
  }
  mode: any;

  verifyMode(){
    console.log(this.mode)
  }

  // to save the address 
  address = {
    "origin": "",
    "destiny": ""
  }

  ngOnInit(){
    // init the map
    this.loadMap()
  }

  ionViewWillEnter(){
    // this function is used because we need the DOM to be loaded
    console.log("DOM CHARGED");
    // set the autocomplete listener functions
    this.setAutocomplete();
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
  


  getRoute(origin_coords, destiny_coords) {

    // function tha obtein the route between two routes

    // initialize starting point and destination
    var inicio=new google.maps.LatLng(origin_coords.lat, origin_coords.lng);
    var fin=new google.maps.LatLng(destiny_coords.lat, destiny_coords.lng);


    
    console.log(this.mode);
    if ( !this.mode){
      console.log("Please select a travel mode");
      return;
    }
    
    // save the data above
    var prtition = {
      origin:inicio,
      destination:fin,
      travelMode: google.maps.TravelMode[this.mode]
    };

    // reference to the map
    directionsRenderer.setMap(map);
    servicioDireccion.route(prtition, function(response, status) {
        
      // verify the status of the petition
      if (status === 'OK') {
        // if all went good, then put it in the map
        directionsRenderer.setDirections(response);
      }else {
        // selse, show an error
        window.alert('Directions request failed due to ' + status);
      }
      // print the results of the petition
      console.log(response);
    });

  }

//////// main function /////
  initProcess(){

    console.log(coords_origin)
    console.log(coords_destiny)

     // do some validations
      if(this.mode){
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
      else{
        console.log("Please select a travel mode");
      }
      

     
     
       
    }

    desactOrigin(){
      coords_origin = null;
    }
    desactDestiny(){
      coords_destiny = null;
    }



////////////////////////////// get coordinates from an address string /////////////////////////////////////////
    
  getOriginCoords(){
    if(this.address.origin == ""){
      console.log("Please input an address");
      return;
    }
    
    // get the latitud and longitud for the origin from an address string 
    let getLatLngOrigin = new Promise<any>((resolve, reject)=>{
      this.http.get(this.apiUrl, {
        params: {
          address: this.address.origin,
          key: environment.googleMapsApi.apiKey
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
        //call the function to get the route
        this.getRoute(coords_origin,coords_destiny);
      }
      
    }, err=>{
      // errors
      console.log("Wrong origin, please enter a valid place!");
      console.log(err)
    })

  }


  getDestinyCoords(){
    if(this.address.destiny==""){
      console.log("Please input an address");
      return;
    }
    // get the latitud and longitud for the destiny from an address string 
    let getLatLngDestiny = new Promise<any>((resolve, reject)=>{
      this.http.get(this.apiUrl, {
        params: {
          address: this.address.destiny,
          key: environment.googleMapsApi.apiKey
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
        //call the function to get the route
        this.getRoute(coords_origin,coords_destiny);
      }
      
    }, err=>{
      // errors
      console.log("Wrong destiny, please enter a valid place!");
      console.log(err)
    })

  }
  
    
    getBothCoords(){
      if( this.address.origin=="" || this.address.destiny==""){
        console.log("Please input an address");
        return;
      }
     // get the latitud and longitud for the origin and destiny from an address string 

     // make a promise
      let getLatLngOrigin = new Promise<any>((resolve, reject)=>{
        this.http.get(this.apiUrl, {
          params: {
            address: this.address.origin,
            key: environment.googleMapsApi.apiKey
          }
        })
        .subscribe(res=>{resolve(res)}, err=>{reject(err)})
      });

      // make a promise      
      let getLatLngDestiny= new Promise<any>((resolve, reject)=>{
        this.http.get(this.apiUrl, {
          params: {
            address: this.address.destiny,
            key: environment.googleMapsApi.apiKey
          }
        })
        .subscribe(res=>{resolve(res)}, err=>{reject(err)})
      });


      
      async function getCoords(): Promise<any> {
        

        // make petition for origin and destiny
        let origin = await getLatLngOrigin;
        
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


      // this is an async function
      getCoords().then(result => {

        // print the results
        console.log(result);

        // call the function to get the route
        this.getRoute(coords_origin, coords_destiny);


      }, err =>{
        console.log("Wrong origin and destiny, please enter valid places!");
        console.log(err)
      })

    }
}