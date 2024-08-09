import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
  createDb(): {} | Observable<{}> | Promise<{}> {
    return{
      products:[
        {
          id:1,
          name:'Citation',
          description:'L\'ignorant attaque avec la bouche mais le sage se défend avec le silence !',
          statut: false
        },
        {
          id:2,
          name:'Highfive',
          description:'Bénin !',
          statut: false
        },
        {
          id:3,
          name:'Passions',
          description:"Aéronautique , Informatique ,Exploration, Mécanique relativiste",
          statut: false
         }       
      ],
      customers:[]
    }
  }
}
