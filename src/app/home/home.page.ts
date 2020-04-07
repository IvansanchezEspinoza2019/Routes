import {Component, ElementRef, NgZone, ViewChild, OnInit} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
    mapEle: HTMLElement=document.getElementById('map');
    map: any;
   
    

    ngOnInit(){
      this.loadMap()
    }

  constructor(public zone: NgZone, public geolocation: Geolocation) {
    
  }

  loadMap(){

    const mapEle: HTMLElement=document.getElementById('map');
    const myLatLng = {
      lat: -11.0268311,
      lng: -68.7535226
    }
    const map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

  }

}