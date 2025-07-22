# Service Documentation and Usage Guide

## Overview

This guide provides comprehensive documentation for all services in the Angular 17 CRUD application, including usage examples, best practices, and extension patterns.

## TodoService (master.service.ts)

### Complete Service Documentation

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'api/products/';
  
  constructor(private http: HttpClient) {}
  
  // Core CRUD operations
  getAll(): Observable<Todo[]> { /* ... */ }
  getProduct(id: number): Observable<Todo> { /* ... */ }
  createProduct(todo: Todo): Observable<any> { /* ... */ }
  updateProduct(todo: Todo): Observable<any> { /* ... */ }
  deleteProduct(id: number): Observable<any> { /* ... */ }
}
```

### Method Details

#### getAll()
**Purpose**: Retrieves all todo items from the API

```typescript
getAll(): Observable<Todo[]> {
  return this.http.get<Todo[]>(this.apiUrl);
}
```

**Enhanced Version with Error Handling**:
```typescript
getAll(): Observable<Todo[]> {
  return this.http.get<Todo[]>(this.apiUrl).pipe(
    retry(3), // Retry failed requests up to 3 times
    catchError(this.handleError)
  );
}
```

**Usage Examples**:
```typescript
// Basic usage
this.todoService.getAll().subscribe(todos => {
  console.log('Todos loaded:', todos);
});

// With error handling
this.todoService.getAll().subscribe({
  next: todos => {
    this.todoList = todos;
    this.isLoading = false;
  },
  error: error => {
    console.error('Failed to load todos:', error);
    this.showErrorMessage('Failed to load todos');
    this.isLoading = false;
  }
});

// With async/await pattern
async loadTodos() {
  try {
    this.isLoading = true;
    const todos = await this.todoService.getAll().toPromise();
    this.todoList = todos;
  } catch (error) {
    console.error('Error loading todos:', error);
  } finally {
    this.isLoading = false;
  }
}
```

#### getProduct(id: number)
**Purpose**: Retrieves a specific todo item by its ID

```typescript
getProduct(id: number): Observable<Todo> {
  return this.http.get<Todo>(`${this.apiUrl}${id}`);
}
```

**Enhanced Version**:
```typescript
getProduct(id: number): Observable<Todo> {
  if (!id || id <= 0) {
    return throwError('Invalid todo ID');
  }
  
  return this.http.get<Todo>(`${this.apiUrl}${id}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        return throwError('Todo not found');
      }
      return this.handleError(error);
    })
  );
}
```

**Usage Examples**:
```typescript
// Basic usage
this.todoService.getProduct(1).subscribe(todo => {
  console.log('Todo details:', todo);
});

// With error handling
loadTodoDetails(id: number) {
  this.todoService.getProduct(id).subscribe({
    next: todo => {
      this.selectedTodo = todo;
      this.populateForm(todo);
    },
    error: error => {
      if (error === 'Todo not found') {
        this.router.navigate(['/not-found']);
      } else {
        this.showErrorMessage('Failed to load todo details');
      }
    }
  });
}
```

#### createProduct(todo: Todo)
**Purpose**: Creates a new todo item

```typescript
createProduct(todo: Todo): Observable<any> {
  return this.http.post(this.apiUrl, todo);
}
```

**Enhanced Version**:
```typescript
createProduct(todo: Todo): Observable<Todo> {
  if (!this.validateTodo(todo)) {
    return throwError('Invalid todo data');
  }
  
  // Remove ID for creation (server will assign)
  const { id, ...todoData } = todo;
  
  return this.http.post<Todo>(this.apiUrl, todoData).pipe(
    catchError(this.handleError)
  );
}

private validateTodo(todo: Todo): boolean {
  return !!(todo.name && todo.description && 
           todo.name.trim().length > 0 && 
           todo.description.trim().length > 0);
}
```

**Usage Examples**:
```typescript
// Basic creation
const newTodo: Todo = {
  id: 0,
  name: 'Learn TypeScript',
  description: 'Master TypeScript fundamentals',
  statut: false
};

this.todoService.createProduct(newTodo).subscribe(response => {
  console.log('Todo created:', response);
});

// With form validation and error handling
createTodo(formValue: any) {
  if (!this.todoForm.valid) {
    this.todoForm.markAllAsTouched();
    return;
  }
  
  const todo: Todo = {
    id: 0,
    name: formValue.name.trim(),
    description: formValue.description.trim(),
    statut: false
  };
  
  this.isCreating = true;
  
  this.todoService.createProduct(todo).subscribe({
    next: (createdTodo) => {
      this.todoList.push(createdTodo);
      this.todoForm.reset();
      this.showSuccessMessage('Todo created successfully');
      this.isCreating = false;
    },
    error: (error) => {
      console.error('Creation failed:', error);
      this.showErrorMessage('Failed to create todo');
      this.isCreating = false;
    }
  });
}
```

#### updateProduct(todo: Todo)
**Purpose**: Updates an existing todo item

```typescript
updateProduct(todo: Todo): Observable<any> {
  return this.http.put(`${this.apiUrl}${todo.id}`, todo);
}
```

**Enhanced Version**:
```typescript
updateProduct(todo: Todo): Observable<Todo> {
  if (!todo.id || !this.validateTodo(todo)) {
    return throwError('Invalid todo data for update');
  }
  
  return this.http.put<Todo>(`${this.apiUrl}${todo.id}`, todo).pipe(
    catchError(error => {
      if (error.status === 404) {
        return throwError('Todo not found for update');
      }
      return this.handleError(error);
    })
  );
}
```

**Usage Examples**:
```typescript
// Basic update
const updatedTodo: Todo = {
  id: 1,
  name: 'Updated Task Name',
  description: 'Updated description',
  statut: true
};

this.todoService.updateProduct(updatedTodo).subscribe(response => {
  console.log('Todo updated:', response);
});

// Optimistic update pattern
updateTodo(todo: Todo) {
  // Update UI immediately (optimistic)
  const index = this.todoList.findIndex(t => t.id === todo.id);
  if (index !== -1) {
    const originalTodo = { ...this.todoList[index] };
    this.todoList[index] = { ...todo };
    
    // Send update to server
    this.todoService.updateProduct(todo).subscribe({
      next: (updatedTodo) => {
        // Confirm update
        this.todoList[index] = updatedTodo;
        this.showSuccessMessage('Todo updated successfully');
      },
      error: (error) => {
        // Revert on error
        this.todoList[index] = originalTodo;
        this.showErrorMessage('Failed to update todo');
        console.error('Update failed:', error);
      }
    });
  }
}
```

#### deleteProduct(id: number)
**Purpose**: Deletes a todo item by ID

```typescript
deleteProduct(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}${id}`);
}
```

**Enhanced Version**:
```typescript
deleteProduct(id: number): Observable<void> {
  if (!id || id <= 0) {
    return throwError('Invalid todo ID for deletion');
  }
  
  return this.http.delete<void>(`${this.apiUrl}${id}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        return throwError('Todo not found for deletion');
      }
      return this.handleError(error);
    })
  );
}
```

**Usage Examples**:
```typescript
// Basic deletion
this.todoService.deleteProduct(1).subscribe(() => {
  console.log('Todo deleted');
});

// With confirmation and optimistic update
deleteTodo(id: number) {
  const confirmDelete = confirm('Are you sure you want to delete this todo?');
  if (!confirmDelete) return;
  
  // Optimistic update - remove from UI immediately
  const index = this.todoList.findIndex(todo => todo.id === id);
  if (index === -1) return;
  
  const deletedTodo = this.todoList[index];
  this.todoList.splice(index, 1);
  
  // Send delete request
  this.todoService.deleteProduct(id).subscribe({
    next: () => {
      this.showSuccessMessage('Todo deleted successfully');
    },
    error: (error) => {
      // Revert deletion on error
      this.todoList.splice(index, 0, deletedTodo);
      this.showErrorMessage('Failed to delete todo');
      console.error('Deletion failed:', error);
    }
  });
}
```

### Service Extensions

#### Adding Bulk Operations

```typescript
// Add to TodoService
bulkCreate(todos: Todo[]): Observable<Todo[]> {
  return this.http.post<Todo[]>(`${this.apiUrl}bulk`, todos).pipe(
    catchError(this.handleError)
  );
}

bulkUpdate(todos: Todo[]): Observable<Todo[]> {
  return this.http.put<Todo[]>(`${this.apiUrl}bulk`, todos).pipe(
    catchError(this.handleError)
  );
}

bulkDelete(ids: number[]): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}bulk`, { body: { ids } }).pipe(
    catchError(this.handleError)
  );
}

// Usage example
bulkMarkComplete(selectedIds: number[]) {
  const updates = selectedIds.map(id => {
    const todo = this.todoList.find(t => t.id === id);
    return { ...todo, statut: true };
  });
  
  this.todoService.bulkUpdate(updates).subscribe({
    next: (updatedTodos) => {
      // Update local list
      updatedTodos.forEach(updated => {
        const index = this.todoList.findIndex(t => t.id === updated.id);
        if (index !== -1) {
          this.todoList[index] = updated;
        }
      });
      this.showSuccessMessage(`${updatedTodos.length} todos marked as complete`);
    },
    error: (error) => {
      this.showErrorMessage('Failed to update todos');
      console.error('Bulk update failed:', error);
    }
  });
}
```

#### Adding Search and Filter

```typescript
// Add to TodoService
searchTodos(query: string): Observable<Todo[]> {
  if (!query.trim()) {
    return this.getAll();
  }
  
  return this.http.get<Todo[]>(`${this.apiUrl}search`, {
    params: { q: query.trim() }
  }).pipe(
    catchError(this.handleError)
  );
}

getTodosByStatus(completed: boolean): Observable<Todo[]> {
  return this.http.get<Todo[]>(`${this.apiUrl}by-status`, {
    params: { completed: completed.toString() }
  }).pipe(
    catchError(this.handleError)
  );
}

// Usage examples
searchTodos(searchTerm: string) {
  if (searchTerm.length < 2) {
    this.loadAllTodos();
    return;
  }
  
  this.todoService.searchTodos(searchTerm).subscribe({
    next: (results) => {
      this.todoList = results;
      this.searchResultCount = results.length;
    },
    error: (error) => {
      console.error('Search failed:', error);
      this.showErrorMessage('Search failed');
    }
  });
}

filterByStatus(status: 'all' | 'completed' | 'pending') {
  switch (status) {
    case 'completed':
      this.todoService.getTodosByStatus(true).subscribe(todos => {
        this.todoList = todos;
      });
      break;
    case 'pending':
      this.todoService.getTodosByStatus(false).subscribe(todos => {
        this.todoList = todos;
      });
      break;
    default:
      this.loadAllTodos();
  }
}
```

## DataService (data.service.ts)

### Complete Service Documentation

```typescript
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  
  createDb(): {} | Observable<{}> | Promise<{}> {
    return {
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
    };
  }
}
```

### Extending DataService

#### Adding More Initial Data

```typescript
createDb(): {} | Observable<{}> | Promise<{}> {
  return {
    products: [
      // Existing data...
      {
        id: 4,
        name: 'Learning Goals',
        description: 'Master Angular, TypeScript, and modern web development',
        statut: false
      },
      {
        id: 5,
        name: 'Project Setup',
        description: 'Configure development environment and tools',
        statut: true
      }
    ],
    customers: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        active: true
      }
    ],
    categories: [
      { id: 1, name: 'Work', color: '#ff5722' },
      { id: 2, name: 'Personal', color: '#2196f3' },
      { id: 3, name: 'Learning', color: '#4caf50' }
    ]
  };
}
```

#### Adding Dynamic Data Generation

```typescript
createDb(): {} | Observable<{}> | Promise<{}> {
  const products = this.generateSampleTodos(10);
  const customers = this.generateSampleCustomers(5);
  
  return {
    products,
    customers
  };
}

private generateSampleTodos(count: number): Todo[] {
  const sampleNames = [
    'Learn Angular', 'Practice TypeScript', 'Build a project',
    'Read documentation', 'Write tests', 'Deploy application',
    'Code review', 'Optimize performance', 'Add features', 'Fix bugs'
  ];
  
  const sampleDescriptions = [
    'Complete the tutorial and practice exercises',
    'Build a real-world application to apply knowledge',
    'Review best practices and coding standards',
    'Implement comprehensive testing strategy',
    'Optimize for performance and user experience'
  ];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: sampleNames[index % sampleNames.length],
    description: sampleDescriptions[index % sampleDescriptions.length],
    statut: Math.random() > 0.7 // 30% chance of being completed
  }));
}

private generateSampleCustomers(count: number): any[] {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Wilson', 'Brown'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
    email: `user${index + 1}@example.com`,
    active: Math.random() > 0.3
  }));
}
```

## Service Best Practices

### Error Handling Pattern

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'api/products/';
  private readonly timeoutDuration = 10000; // 10 seconds
  
  constructor(private http: HttpClient) {}
  
  // Centralized error handling
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login again';
          break;
        case 403:
          errorMessage = 'Forbidden: You don\'t have permission';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Server Error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Service Error:', errorMessage, error);
    return throwError(errorMessage);
  };
  
  // Example method with comprehensive error handling
  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      timeout(this.timeoutDuration),
      retry(2), // Retry twice on failure
      catchError(this.handleError)
    );
  }
}
```

### Service with Caching

```typescript
@Injectable({
  providedIn: 'root'
})
export class TodoServiceWithCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Todo[]> {
    const cacheKey = 'todos_all';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return of(cached);
    }
    
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(data => this.setCache(cacheKey, data)),
      catchError(this.handleError)
    );
  }
  
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}
```

### Service Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  
  const mockTodos: Todo[] = [
    { id: 1, name: 'Test Todo', description: 'Test Description', statut: false }
  ];
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch all todos', () => {
    service.getAll().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });
    
    const req = httpMock.expectOne('api/products/');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });
  
  it('should create a todo', () => {
    const newTodo: Todo = {
      id: 0,
      name: 'New Todo',
      description: 'New Description',
      statut: false
    };
    
    service.createProduct(newTodo).subscribe(response => {
      expect(response).toBeTruthy();
    });
    
    const req = httpMock.expectOne('api/products/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush({ id: 2, ...newTodo });
  });
  
  it('should handle errors', () => {
    service.getAll().subscribe(
      () => fail('should have failed'),
      error => {
        expect(error).toContain('Server Error');
      }
    );
    
    const req = httpMock.expectOne('api/products/');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
```

---

*This guide provides comprehensive documentation and usage examples for all services in the Angular 17 CRUD application.*
