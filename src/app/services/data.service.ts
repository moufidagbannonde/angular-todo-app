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

        },
        {
          id:2,
          name:'Biographie',
          description:'Je suis Moufid , étudiant résidant au Bénin !',

        },
        {
          id:3,
          name:'Passions',
          description:"Aéronautique , Informatique ,Exploration, Mécanique relativiste",
         },
        {
          id:4,
          name:'Nationalidade',
          description:'Meu nationalidade é caboverdiana',
         }
        
      ],
      customers:[]
    }
  }
}
