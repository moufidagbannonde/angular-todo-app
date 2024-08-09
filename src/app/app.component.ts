import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/master.service';
import { Todo } from './models/todo';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title:string = "Moufid";


  // logo1:string = "../assets/capeverdeflag.jpg";  
  // logo2:string = "../assets/qrcode_chrome.png";  
  // logo3:string = "../assets/manuel_pinto_da_costa_en_1986_au_maryland_usa.jpg";

  
  // déclaration d'un tableau vide de Todo
  todolist!: Todo[];
  // déclaration d'un objet non vide de Todo
  editData!: Todo;
  // variable dataSources de type any
  dataSources: any;
  // tableau de string représentant les  colonnes du tableau 
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  // deux variables booléennes pour afficher le formulaire d'ajout et de suppression
  isAdd = false;
  isEdit = false;
  


  // injection de services TodoService et de FormBuilder
  constructor(private service: TodoService, private builder: FormBuilder) {}
  
  // validation des champs du formulaire 
  productForm = this.builder.group({
    id: { value: 0, disabled: true },
    name: ['', Validators.required],
    description: ['', Validators.required],
    statut: {value: false, disabled: true}
  });
  isDone = this.productForm.value.statut;


  longueur!:number;
  cliquer(id:number){
  
      // this.productForm.value.statut = this.isDone ;
      this.service.getProduct(id).subscribe(data =>{
            data.statut = true;
      }) ;
  
    // this.isDone = this.productForm.value.statut;
    // this.isDone = !this.isDone;
    console.log('checkbox cliqué', this.isDone, "product", this.productForm.value.statut );
    // console.log(this.productForm.value.statut);
  
  }

  // au chargement de la page 
  ngOnInit(): void {
    // chargement des tâches 
    this.loadTodo();
    this.longueur = this.todolist.length;
    console.log(this.longueur);
  }

  loadTodo() {
    //  chargement des tâches
    this.service.getAll().subscribe((data) => {
      // subscribe pour écouter et réagir aux valeurs émises par un observable
      this.todolist = data;
      this.dataSources = new MatTableDataSource(this.todolist);
    });
  }

  // sauvegarder une tâche
  saveTodo() {
    // si le champ du formulaire est validé
    if (this.productForm.valid) {
      // 
      let obj: Todo = {
        id: this.productForm.value.id as number,
        name: this.productForm.value.name as string,
        description: this.productForm.value.description as string,
        statut: this.productForm.value.statut as boolean
      };
      if (this.isAdd) {
        this.service.createProduct(obj).subscribe(() => {
          this.loadTodo();
        });
      } else {
        obj.id = this.productForm.getRawValue().id as number;
        this.service.updateProduct(obj).subscribe((data) => {
          this.loadTodo();
        });
      }

      this.backToList();
    }
  }

  editTodo(id: number) {
    this.service.getProduct(id).subscribe((data) => {
      this.editData = data;
      this.productForm.setValue({
        id: this.editData.id,
        name: this.editData.name,
        description: this.editData.description,
        statut : this.editData.statut
      });
      this.isEdit = true;
    });
  }
  checkData!: Todo;

checkboxer(id: number){ 
  this.service.getProduct(id).subscribe((data) => {
    this.checkData = data
      this.checkData.statut = !this.checkData.statut
      console.log(data.statut);
  });  
  };

  deleteTodo(id: number) {
    this.service.deleteProduct(id).subscribe((data) => {
      this.loadTodo();
      });
    }
  
    totalTasks(){
      this.longueur = this.todolist.length;
      console.log(this.todolist);
    }
    complet !:number;
completedTasks(){

  console.log(this.complet);

}
incomplet !:number;
incompletedTasks(){
  this.incomplet =this.todolist.filter((todo)=>todo.statut === false).length;
  console.log(this.incomplet);
}
  showAddProductForm() {
    this.productForm.reset();
    this.isAdd = true;
  }

  backToList() {
    this.isAdd = false;
    this.isEdit = false;
  }
}
