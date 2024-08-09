import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http:HttpClient) { }
  apiUrl='api/products/';

  getAll(){
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getProduct(id:number){
    return this.http.get<Todo>(this.apiUrl+id);
  }

  createProduct(todo:Todo){
    return this.http.post(this.apiUrl,todo);
  }

  updateProduct(todo:Todo){
    return this.http.put(this.apiUrl+todo.id,todo);
  }

  deleteProduct(id:number){
    return this.http.delete(this.apiUrl+id);
  }

}
