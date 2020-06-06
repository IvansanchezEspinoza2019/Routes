# Routes
For this project I'm using Ionic 5 and Angular 9, make sure you have installed in your system

You need to put your Google Maps Api key in index.html file:
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
  
Also in in src/environments/environment.ts file:
      export const environment = {
      production: false,
  
      googleMapsApi: {
        apiKey: "YOUR_API_KEY"
      }
    };
