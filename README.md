# Routes
_It's a simple application to get routes with Google Maps Api_
### Requirements
_You need Ionic and Angular installed in your system, I'm using Ionic 5 and Angular 9. Also you need a Google Maps Api Key activated_

### Installation
_Clone the project in your system with the command:_
 ```
 git clone https://github.com/IvansanchezEspinoza2019/Routes.git
 ```
_In the root folder run the following command:_
```
npm i
```
_Next you need to put your Google Maps Api key in src/index.html file:_
   ```
  <script  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
  ```
  
_Also put it in src/environments/environment.ts:_
    
    { 
        production: false,
        googleMapsApi: {
            apiKey: "YOUR_API_KEY"
        }
    };
    
