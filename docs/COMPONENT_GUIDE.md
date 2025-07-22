# Component Usage Guide

## Overview

This guide provides detailed instructions on how to use and extend the components in the Angular 17 CRUD application.

## AppComponent

### Description
The main application component that manages the todo list interface and all CRUD operations.

### Usage

#### Basic Implementation
```typescript
import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/master.service';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Component implementation
}
```

#### Template Usage
```html
<!-- Main application template -->
<div class="app-container">
  <h1>{{title}}</h1>
  
  <!-- Todo List Table -->
  <mat-table [dataSource]="dataSources" class="mat-elevation-z8">
    <!-- Column definitions -->
  </mat-table>
  
  <!-- Add/Edit Form -->
  <mat-card *ngIf="isAdd || isEdit">
    <form [formGroup]="productForm" (ngSubmit)="saveTodo()">
      <!-- Form fields -->
    </form>
  </mat-card>
</div>
```

### Key Methods

#### Lifecycle Methods
- `ngOnInit()`: Initializes component and loads data
- `loadTodo()`: Fetches all todos from service

#### CRUD Operations
- `saveTodo()`: Creates or updates todo based on mode
- `editTodo(id)`: Switches to edit mode for specific todo
- `deleteTodo(id)`: Removes todo from list
- `checkboxer(id)`: Toggles todo completion status

#### UI State Management
- `showAddProductForm()`: Shows add todo form
- `backToList()`: Returns to list view
- `totalTasks()`: Calculates total task count
- `completedTasks()`: Calculates completed task count
- `incompletedTasks()`: Calculates incomplete task count

### Properties

#### Data Properties
```typescript
todolist: Todo[];           // Array of all todos
editData: Todo;             // Currently edited todo
dataSources: any;           // Material table data source
```

#### UI State Properties
```typescript
isAdd: boolean = false;     // Add mode flag
isEdit: boolean = false;    // Edit mode flag
longueur: number;           // Total todo count
complet: number;            // Completed todo count
incomplet: number;          // Incomplete todo count
```

#### Form Configuration
```typescript
productForm = this.builder.group({
  id: { value: 0, disabled: true },
  name: ['', Validators.required],
  description: ['', Validators.required],
  statut: { value: false, disabled: true }
});
```

### Example: Adding Custom Validation

```typescript
// Enhanced form with custom validation
productForm = this.builder.group({
  id: { value: 0, disabled: true },
  name: ['', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]],
  description: ['', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(200)
  ]],
  statut: { value: false, disabled: true }
});

// Custom validator example
nameValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasNumber = /[0-9]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  
  const valid = hasNumber && hasUpper;
  return !valid ? { invalidName: true } : null;
}
```

### Example: Error Handling

```typescript
saveTodo() {
  if (this.productForm.valid) {
    const todo: Todo = {
      id: this.productForm.value.id as number,
      name: this.productForm.value.name as string,
      description: this.productForm.value.description as string,
      statut: this.productForm.value.statut as boolean
    };
    
    const operation = this.isAdd 
      ? this.service.createProduct(todo)
      : this.service.updateProduct(todo);
    
    operation.subscribe({
      next: (response) => {
        console.log('Operation successful:', response);
        this.loadTodo();
        this.backToList();
      },
      error: (error) => {
        console.error('Operation failed:', error);
        // Handle error (show toast, alert, etc.)
      }
    });
  } else {
    // Mark all fields as touched to show validation errors
    this.productForm.markAllAsTouched();
  }
}
```

## TodoFooterComponent

### Description
A simple footer component that can be extended for additional functionality.

### Current Implementation
```typescript
@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrl: './todo-footer.component.css'
})
export class TodoFooterComponent {
  // Basic component - can be extended
}
```

### Extension Example
```typescript
@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrl: './todo-footer.component.css'
})
export class TodoFooterComponent implements OnInit {
  currentYear: number;
  version: string = '1.0.0';
  
  ngOnInit() {
    this.currentYear = new Date().getFullYear();
  }
  
  // Additional footer functionality
  showAbout() {
    // Show about dialog
  }
  
  showHelp() {
    // Show help information
  }
}
```

### Template Extension
```html
<footer class="app-footer">
  <div class="footer-content">
    <p>&copy; {{currentYear}} Todo App v{{version}}</p>
    <div class="footer-links">
      <button mat-button (click)="showAbout()">About</button>
      <button mat-button (click)="showHelp()">Help</button>
    </div>
  </div>
</footer>
```

## PageNotFoundComponent

### Description
Handles 404 errors and provides navigation back to the main application.

### Current Implementation
```typescript
@Component({
  selector: 'moufid-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  // Basic error component
}
```

### Enhanced Implementation
```typescript
@Component({
  selector: 'moufid-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {
  requestedUrl: string;
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.requestedUrl = this.router.url;
  }
  
  goHome() {
    this.router.navigate(['/']);
  }
  
  goBack() {
    window.history.back();
  }
}
```

### Enhanced Template
```html
<div class="error-container">
  <mat-card class="error-card">
    <mat-card-header>
      <mat-card-title>Page Not Found</mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <p>The page you requested could not be found.</p>
      <p class="requested-url" *ngIf="requestedUrl">
        Requested URL: <code>{{requestedUrl}}</code>
      </p>
    </mat-card-content>
    
    <mat-card-actions>
      <button mat-raised-button color="primary" (click)="goHome()">
        Go Home
      </button>
      <button mat-button (click)="goBack()">
        Go Back
      </button>
    </mat-card-actions>
  </mat-card>
</div>
```

## Creating Custom Components

### Example: Todo Statistics Component

```typescript
@Component({
  selector: 'app-todo-stats',
  template: `
    <mat-card class="stats-card">
      <mat-card-header>
        <mat-card-title>Statistics</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{totalTodos}}</span>
            <span class="stat-label">Total</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-number">{{completedTodos}}</span>
            <span class="stat-label">Completed</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-number">{{pendingTodos}}</span>
            <span class="stat-label">Pending</span>
          </div>
          
          <div class="stat-item">
            <span class="stat-number">{{completionRate}}%</span>
            <span class="stat-label">Completion Rate</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stats-card {
      margin: 16px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
    }
    
    .stat-item {
      text-align: center;
      padding: 16px;
      border-radius: 8px;
      background-color: #f5f5f5;
    }
    
    .stat-number {
      display: block;
      font-size: 2em;
      font-weight: bold;
      color: #3f51b5;
    }
    
    .stat-label {
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class TodoStatsComponent implements OnInit {
  @Input() todos: Todo[] = [];
  
  totalTodos = 0;
  completedTodos = 0;
  pendingTodos = 0;
  completionRate = 0;
  
  ngOnInit() {
    this.calculateStats();
  }
  
  ngOnChanges() {
    this.calculateStats();
  }
  
  private calculateStats() {
    this.totalTodos = this.todos.length;
    this.completedTodos = this.todos.filter(todo => todo.statut).length;
    this.pendingTodos = this.totalTodos - this.completedTodos;
    this.completionRate = this.totalTodos > 0 
      ? Math.round((this.completedTodos / this.totalTodos) * 100)
      : 0;
  }
}
```

### Usage in AppComponent

```typescript
// In app.component.html
<app-todo-stats [todos]="todolist"></app-todo-stats>

// In app.module.ts declarations
declarations: [
  AppComponent,
  TodoFooterComponent,
  PageNotFoundComponent,
  TodoStatsComponent  // Add the new component
]
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Input/Output**: Use @Input() and @Output() for component communication
3. **OnPush Strategy**: Consider using OnPush change detection for performance
4. **Lifecycle Hooks**: Implement proper cleanup in ngOnDestroy

### Form Handling
1. **Reactive Forms**: Prefer reactive forms over template-driven forms
2. **Validation**: Implement both client-side and server-side validation
3. **Error Messages**: Provide clear, user-friendly error messages
4. **Accessibility**: Ensure forms are accessible to screen readers

### Performance
1. **TrackBy Functions**: Use trackBy functions in *ngFor loops
2. **Lazy Loading**: Implement lazy loading for large applications
3. **OnPush**: Use OnPush change detection strategy when appropriate
4. **Unsubscribe**: Always unsubscribe from observables in ngOnDestroy

### Testing
1. **Unit Tests**: Write unit tests for all component methods
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Implement end-to-end tests for critical user flows
4. **Accessibility Tests**: Test for accessibility compliance

---

*This guide provides comprehensive information on using and extending components in the Angular 17 CRUD application.*
