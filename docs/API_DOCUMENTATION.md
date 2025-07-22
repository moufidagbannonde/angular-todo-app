# API Documentation - Angular 17 CRUD Application

## Table of Contents

1. [Application Overview](#application-overview)
2. [Data Models](#data-models)
3. [Services](#services)
4. [Components](#components)
5. [Modules](#modules)
6. [Usage Examples](#usage-examples)
7. [API Endpoints](#api-endpoints)

## Application Overview

This is an Angular 17 CRUD (Create, Read, Update, Delete) application for managing Todo items. The application uses Angular Material for UI components and includes an in-memory web API for data persistence during development.

### Key Features
- Todo item management (CRUD operations)
- Material Design UI components
- In-memory data storage
- Form validation
- Responsive design

### Technology Stack
- Angular 17
- Angular Material
- TypeScript
- RxJS
- Angular In-Memory Web API

---

## Data Models

### Todo Interface

```typescript
export interface Todo {
    id: number;
    name: string;
    description: string;
    statut: boolean;
}
```

**Properties:**
- `id` (number): Unique identifier for the todo item
- `name` (string): Title/name of the todo item
- `description` (string): Detailed description of the todo item
- `statut` (boolean): Completion status of the todo item (false = incomplete, true = complete)

**Usage Example:**
```typescript
const newTodo: Todo = {
    id: 1,
    name: "Learn Angular",
    description: "Complete Angular tutorial and build a CRUD app",
    statut: false
};
```

---

## Services

### TodoService (master.service.ts)

The main service for handling Todo operations with HTTP client integration.

**Injectable:** `'root'`

#### Constructor
```typescript
constructor(private http: HttpClient)
```

#### Properties
- `apiUrl: string = 'api/products/'` - Base URL for API endpoints

#### Methods

##### getAll()
Retrieves all todo items from the API.

```typescript
getAll(): Observable<Todo[]>
```

**Returns:** Observable array of Todo objects

**Usage:**
```typescript
this.todoService.getAll().subscribe(todos => {
    console.log('All todos:', todos);
});
```

##### getProduct(id: number)
Retrieves a specific todo item by ID.

```typescript
getProduct(id: number): Observable<Todo>
```

**Parameters:**
- `id` (number): The unique identifier of the todo item

**Returns:** Observable Todo object

**Usage:**
```typescript
this.todoService.getProduct(1).subscribe(todo => {
    console.log('Todo item:', todo);
});
```

##### createProduct(todo: Todo)
Creates a new todo item.

```typescript
createProduct(todo: Todo): Observable<any>
```

**Parameters:**
- `todo` (Todo): The todo object to create

**Returns:** Observable with creation response

**Usage:**
```typescript
const newTodo: Todo = {
    id: 0, // Will be auto-generated
    name: "New Task",
    description: "Task description",
    statut: false
};

this.todoService.createProduct(newTodo).subscribe(response => {
    console.log('Todo created:', response);
});
```

##### updateProduct(todo: Todo)
Updates an existing todo item.

```typescript
updateProduct(todo: Todo): Observable<any>
```

**Parameters:**
- `todo` (Todo): The todo object with updated information

**Returns:** Observable with update response

**Usage:**
```typescript
const updatedTodo: Todo = {
    id: 1,
    name: "Updated Task",
    description: "Updated description",
    statut: true
};

this.todoService.updateProduct(updatedTodo).subscribe(response => {
    console.log('Todo updated:', response);
});
```

##### deleteProduct(id: number)
Deletes a todo item by ID.

```typescript
deleteProduct(id: number): Observable<any>
```

**Parameters:**
- `id` (number): The unique identifier of the todo item to delete

**Returns:** Observable with deletion response

**Usage:**
```typescript
this.todoService.deleteProduct(1).subscribe(response => {
    console.log('Todo deleted:', response);
});
```

### DataService (data.service.ts)

In-memory database service for development and testing.

**Injectable:** `'root'`
**Implements:** `InMemoryDbService`

#### Methods

##### createDb()
Creates the in-memory database with initial data.

```typescript
createDb(): {} | Observable<{}> | Promise<{}>
```

**Returns:** Database object with initial todo items

**Initial Data Structure:**
```typescript
{
    products: [
        {
            id: 1,
            name: 'Citation',
            description: 'L\'ignorant attaque avec la bouche mais le sage se défend avec le silence !',
            statut: false
        },
        {
            id: 2,
            name: 'Highfive',
            description: 'Bénin !',
            statut: false
        },
        {
            id: 3,
            name: 'Passions',
            description: "Aéronautique , Informatique ,Exploration, Mécanique relativiste",
            statut: false
        }
    ],
    customers: []
}
```

---

## Components

### AppComponent

The main application component that handles the todo list interface and operations.

**Selector:** `app-root`
**Template:** `./app.component.html`
**Styles:** `./app.component.scss`

#### Properties

##### Public Properties
- `title: string = "Moufid"` - Application title
- `todolist: Todo[]` - Array of todo items
- `editData: Todo` - Todo item being edited
- `dataSources: any` - Material table data source
- `displayedColumns: string[]` - Table column definitions
- `isAdd: boolean = false` - Flag for add mode
- `isEdit: boolean = false` - Flag for edit mode
- `longueur: number` - Total number of todos
- `complet: number` - Number of completed todos
- `incomplet: number` - Number of incomplete todos

##### Form
```typescript
productForm = this.builder.group({
    id: { value: 0, disabled: true },
    name: ['', Validators.required],
    description: ['', Validators.required],
    statut: { value: false, disabled: true }
});
```

#### Methods

##### ngOnInit()
Component initialization lifecycle hook.

```typescript
ngOnInit(): void
```

**Functionality:**
- Loads initial todo data
- Calculates todo count

##### loadTodo()
Loads all todo items from the service.

```typescript
loadTodo(): void
```

**Usage:**
```typescript
this.loadTodo(); // Refreshes the todo list
```

##### saveTodo()
Saves a todo item (create or update based on mode).

```typescript
saveTodo(): void
```

**Functionality:**
- Validates form data
- Creates new todo if in add mode
- Updates existing todo if in edit mode
- Refreshes todo list after operation

##### editTodo(id: number)
Enters edit mode for a specific todo item.

```typescript
editTodo(id: number): void
```

**Parameters:**
- `id` (number): ID of the todo to edit

##### deleteTodo(id: number)
Deletes a todo item.

```typescript
deleteTodo(id: number): void
```

**Parameters:**
- `id` (number): ID of the todo to delete

##### checkboxer(id: number)
Toggles the completion status of a todo item.

```typescript
checkboxer(id: number): void
```

**Parameters:**
- `id` (number): ID of the todo to toggle

##### showAddProductForm()
Displays the add todo form.

```typescript
showAddProductForm(): void
```

##### backToList()
Returns to the todo list view.

```typescript
backToList(): void
```

##### totalTasks()
Calculates total number of tasks.

```typescript
totalTasks(): void
```

##### completedTasks()
Calculates number of completed tasks.

```typescript
completedTasks(): void
```

##### incompletedTasks()
Calculates number of incomplete tasks.

```typescript
incompletedTasks(): void
```

### TodoFooterComponent

A simple footer component for the todo application.

**Selector:** `app-todo-footer`
**Template:** `./todo-footer.component.html`
**Styles:** `./todo-footer.component.css`

This is a basic component without specific functionality, used for layout purposes.

### PageNotFoundComponent

Component for handling 404 errors and unknown routes.

**Selector:** `moufid-page-not-found`
**Template:** `./page-not-found.component.html`
**Styles:** `./page-not-found.component.css`

This is a basic component for error handling, typically used in routing configurations.

---

## Modules

### AppModule

The root module that configures the entire application.

#### Declarations
- `AppComponent` - Main application component
- `TodoFooterComponent` - Footer component
- `PageNotFoundComponent` - Error page component

#### Imports
- `BrowserModule` - Browser-specific services
- `AppRoutingModule` - Application routing
- `MatTableModule` - Material table component
- `MatButtonModule` - Material button component
- `MatCardModule` - Material card component
- `MatInputModule` - Material input component
- `MatFormFieldModule` - Material form field component
- `HttpClientInMemoryWebApiModule` - In-memory web API
- `HttpClientModule` - HTTP client services
- `ReactiveFormsModule` - Reactive forms
- `FormsModule` - Template-driven forms

#### Providers
- `provideAnimationsAsync()` - Angular animations

#### Bootstrap
- `AppComponent` - Root component

### AppRoutingModule

Currently configured with an empty routes array. Can be extended for navigation.

```typescript
const routes: Routes = [];
```

---

## Usage Examples

### Basic Todo Management

#### Creating a new Todo
```typescript
// In your component
constructor(private todoService: TodoService, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required]
    });
}

createTodo() {
    if (this.todoForm.valid) {
        const newTodo: Todo = {
            id: 0, // Auto-generated
            name: this.todoForm.value.name,
            description: this.todoForm.value.description,
            statut: false
        };
        
        this.todoService.createProduct(newTodo).subscribe(
            response => {
                console.log('Todo created successfully');
                this.loadTodos();
            },
            error => {
                console.error('Error creating todo:', error);
            }
        );
    }
}
```

#### Updating a Todo
```typescript
updateTodo(todo: Todo) {
    this.todoService.updateProduct(todo).subscribe(
        response => {
            console.log('Todo updated successfully');
            this.loadTodos();
        },
        error => {
            console.error('Error updating todo:', error);
        }
    );
}
```

#### Deleting a Todo
```typescript
deleteTodo(id: number) {
    if (confirm('Are you sure you want to delete this todo?')) {
        this.todoService.deleteProduct(id).subscribe(
            response => {
                console.log('Todo deleted successfully');
                this.loadTodos();
            },
            error => {
                console.error('Error deleting todo:', error);
            }
        );
    }
}
```

#### Loading All Todos
```typescript
loadTodos() {
    this.todoService.getAll().subscribe(
        todos => {
            this.todos = todos;
            this.dataSource = new MatTableDataSource(todos);
        },
        error => {
            console.error('Error loading todos:', error);
        }
    );
}
```

### Form Integration

#### Setting up a Reactive Form
```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class TodoFormComponent {
    todoForm: FormGroup;
    
    constructor(private fb: FormBuilder, private todoService: TodoService) {
        this.todoForm = this.fb.group({
            id: [0],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            statut: [false]
        });
    }
    
    onSubmit() {
        if (this.todoForm.valid) {
            const todo: Todo = this.todoForm.value;
            
            if (todo.id === 0) {
                // Create new todo
                this.todoService.createProduct(todo).subscribe(/* ... */);
            } else {
                // Update existing todo
                this.todoService.updateProduct(todo).subscribe(/* ... */);
            }
        }
    }
}
```

### Error Handling

#### Service Error Handling
```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

getTodoWithErrorHandling(id: number) {
    return this.todoService.getProduct(id).pipe(
        catchError(error => {
            console.error('Error fetching todo:', error);
            // Return empty todo or handle error appropriately
            return of(null);
        })
    );
}
```

---

## API Endpoints

The application uses the following API endpoints through the in-memory web API:

### Base URL
```
api/products/
```

### Endpoints

#### GET /api/products/
**Description:** Retrieve all todo items
**Response:** Array of Todo objects
**Example Response:**
```json
[
    {
        "id": 1,
        "name": "Citation",
        "description": "L'ignorant attaque avec la bouche mais le sage se défend avec le silence !",
        "statut": false
    }
]
```

#### GET /api/products/{id}
**Description:** Retrieve a specific todo item by ID
**Parameters:** 
- `id` (number): Todo item ID
**Response:** Single Todo object

#### POST /api/products/
**Description:** Create a new todo item
**Request Body:** Todo object (without ID)
**Example Request:**
```json
{
    "name": "New Task",
    "description": "Task description",
    "statut": false
}
```

#### PUT /api/products/{id}
**Description:** Update an existing todo item
**Parameters:**
- `id` (number): Todo item ID
**Request Body:** Complete Todo object
**Example Request:**
```json
{
    "id": 1,
    "name": "Updated Task",
    "description": "Updated description",
    "statut": true
}
```

#### DELETE /api/products/{id}
**Description:** Delete a todo item
**Parameters:**
- `id` (number): Todo item ID
**Response:** Confirmation of deletion

---

## Development Guidelines

### Best Practices

1. **Error Handling:** Always implement proper error handling for HTTP operations
2. **Form Validation:** Use Angular reactive forms with appropriate validators
3. **Subscriptions:** Remember to unsubscribe from observables to prevent memory leaks
4. **Type Safety:** Use TypeScript interfaces for type safety
5. **Component Communication:** Use services for data sharing between components

### Testing

#### Unit Testing Services
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoService } from './master.service';

describe('TodoService', () => {
    let service: TodoService;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(TodoService);
    });
    
    it('should create todos', () => {
        // Test implementation
    });
});
```

### Extension Points

The application can be extended with:
- User authentication
- Todo categories/tags
- Due dates and reminders
- File attachments
- Real backend API integration
- Progressive Web App features

---

*This documentation covers all public APIs, functions, and components in the Angular 17 CRUD application. For additional information or support, please refer to the source code or contact the development team.*
