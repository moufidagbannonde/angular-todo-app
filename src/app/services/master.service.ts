import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http:HttpClient) { }
  apiUrl='api/products/';

  getAll(){
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getProduct(id:number){
    return this.http.get<Todo>(this.apiUrl+id);
  }

  createProduct(product:Todo){
    return this.http.post(this.apiUrl,product);
  }

  updateProduct(product:Todo){
    return this.http.put(this.apiUrl+product.id,product);
  }

  deleteProduct(id:number){
    return this.http.delete(this.apiUrl+id);
  }

}
