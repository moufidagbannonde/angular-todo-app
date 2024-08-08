import { Component, OnInit } from '@angular/core';
import { MasterService } from './services/master.service';
import { Todo } from './models/todo';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title:string = "Moufid"

  logo1:string = "../assets/capeverdeflag.jpg"
  
  logo2:string = "../assets/qrcode_chrome.png"
  
  logo3:string = "../assets/manuel_pinto_da_costa_en_1986_au_maryland_usa.jpg"
  productList!: Todo[];
  editData!: Todo;
  dataSources: any;
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];
  isAdd = false;
  isEdit = false;

  constructor(private service: MasterService, private builder: FormBuilder) {}

  productForm = this.builder.group({
    id: { value: 0, disabled: true },
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.service.getAll().subscribe((item) => {
      this.productList = item;
      this.dataSources = new MatTableDataSource(this.productList);
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      let obj: Todo = {
        id: this.productForm.value.id as number,
        name: this.productForm.value.name as string,
        description: this.productForm.value.description as string,
      };
      if (this.isAdd) {
        this.service.createProduct(obj).subscribe((item) => {
          this.loadProduct();
          alert('Tâche brillament créée !');
        });
      } else {
        obj.id = this.productForm.getRawValue().id as number;
        this.service.updateProduct(obj).subscribe((item) => {
          this.loadProduct();
          alert('Tâche modifiée avec succès !');
        });
      }

      this.backToList();
    }
  }

  editProduct(id: number) {
    this.service.getProduct(id).subscribe((data) => {
      this.editData = data;
      this.productForm.setValue({
        id: this.editData.id,
        name: this.editData.name,
        description: this.editData.description,
      });
      this.isEdit = true;
    });
  }

  deleteProduct(id: number) {
    if (confirm('Voulez-vous vraiment supprimer la tâche ?')) {
      this.service.deleteProduct(id).subscribe((data) => {
        this.loadProduct();
        alert('Tâche supprimée brillament !');
      });
    }
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
