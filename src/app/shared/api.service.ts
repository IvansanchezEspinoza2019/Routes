
/* This service is going to bring us the comunication between the app and the database
  

  Here are defined all functions than will need data or documents from the database

*/

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private firestore: AngularFirestore) { 

  }

// Add document to the databse
  createTheftReport(data){
    return new Promise<any>((resolve, reject)=>{
      this.firestore
      .collection("appointment")
      .add(data)
      .then(res =>{}, err=> reject(err))
    });
}

}
