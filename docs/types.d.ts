/**
 * Type Definitions for Angular 17 CRUD Application
 * 
 * This file contains all the TypeScript interfaces and types used in the application.
 * It serves as a comprehensive reference for developers working with the codebase.
 */

// ============================================================================
// CORE DATA MODELS
// ============================================================================

/**
 * Represents a Todo item in the application
 * 
 * @interface Todo
 * @example
 * ```typescript
 * const todo: Todo = {
 *   id: 1,
 *   name: "Learn Angular",
 *   description: "Complete Angular tutorial and practice",
 *   statut: false
 * };
 * ```
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: number;
  
  /** Display name/title of the todo item */
  name: string;
  
  /** Detailed description of the todo item */
  description: string;
  
  /** Completion status - false: incomplete, true: complete */
  statut: boolean;
}

/**
 * Extended Todo interface with optional additional properties
 * for future enhancements
 */
export interface ExtendedTodo extends Todo {
  /** Optional category for organizing todos */
  category?: string;
  
  /** Priority level of the todo */
  priority?: 'low' | 'medium' | 'high';
  
  /** Due date for the todo */
  dueDate?: Date;
  
  /** Tags associated with the todo */
  tags?: string[];
  
  /** Creation timestamp */
  createdAt?: Date;
  
  /** Last update timestamp */
  updatedAt?: Date;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

/**
 * Interface for CRUD operations on Todo items
 */
export interface ITodoService {
  /** Retrieve all todo items */
  getAll(): Observable<Todo[]>;
  
  /** Retrieve a specific todo by ID */
  getProduct(id: number): Observable<Todo>;
  
  /** Create a new todo item */
  createProduct(todo: Todo): Observable<any>;
  
  /** Update an existing todo item */
  updateProduct(todo: Todo): Observable<any>;
  
  /** Delete a todo item by ID */
  deleteProduct(id: number): Observable<any>;
}

/**
 * Interface for in-memory database service
 */
export interface IDataService {
  /** Create and return the in-memory database */
  createDb(): {} | Observable<{}> | Promise<{}>;
}

/**
 * Configuration options for TodoService
 */
export interface TodoServiceConfig {
  /** Base API URL */
  apiUrl: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Number of retry attempts for failed requests */
  retryCount?: number;
  
  /** Enable caching */
  enableCache?: boolean;
  
  /** Cache timeout in milliseconds */
  cacheTimeout?: number;
}

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

/**
 * Interface for AppComponent public properties and methods
 */
export interface IAppComponent {
  // Properties
  title: string;
  todolist: Todo[];
  editData: Todo;
  dataSources: any;
  displayedColumns: string[];
  isAdd: boolean;
  isEdit: boolean;
  longueur: number;
  complet: number;
  incomplet: number;
  
  // Lifecycle methods
  ngOnInit(): void;
  
  // CRUD operations
  loadTodo(): void;
  saveTodo(): void;
  editTodo(id: number): void;
  deleteTodo(id: number): void;
  checkboxer(id: number): void;
  
  // UI state management
  showAddProductForm(): void;
  backToList(): void;
  
  // Statistics
  totalTasks(): void;
  completedTasks(): void;
  incompletedTasks(): void;
}

/**
 * Form data interface for todo operations
 */
export interface TodoFormData {
  id: number;
  name: string;
  description: string;
  statut: boolean;
}

/**
 * Component state interface
 */
export interface ComponentState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isEditing: boolean;
  isAdding: boolean;
  selectedTodo?: Todo;
}

// ============================================================================
// HTTP AND API INTERFACES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

/**
 * Error response from API
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search parameters for todo filtering
 */
export interface SearchParams {
  query?: string;
  category?: string;
  status?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dateFrom?: Date;
  dateTo?: Date;
}

// ============================================================================
// FORM AND VALIDATION INTERFACES
// ============================================================================

/**
 * Form validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Form state interface
 */
export interface FormState {
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: ValidationError[];
}

/**
 * Custom validator function type
 */
export type CustomValidator = (control: AbstractControl) => ValidationErrors | null;

// ============================================================================
// EVENT INTERFACES
// ============================================================================

/**
 * Todo events that components can emit
 */
export interface TodoEvents {
  /** Emitted when a todo is created */
  onTodoCreated: (todo: Todo) => void;
  
  /** Emitted when a todo is updated */
  onTodoUpdated: (todo: Todo) => void;
  
  /** Emitted when a todo is deleted */
  onTodoDeleted: (id: number) => void;
  
  /** Emitted when todo status is toggled */
  onTodoToggled: (todo: Todo) => void;
  
  /** Emitted when todos are filtered */
  onTodosFiltered: (todos: Todo[]) => void;
}

/**
 * Component event data
 */
export interface ComponentEvent<T = any> {
  type: string;
  data: T;
  timestamp: Date;
  source: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional except specified ones
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Create a type with only the specified properties
 */
export type PickOnly<T, K extends keyof T> = Pick<T, K>;

/**
 * Create a type without the specified properties
 */
export type OmitOnly<T, K extends keyof T> = Omit<T, K>;

/**
 * Todo creation data (without ID)
 */
export type TodoCreateData = OmitOnly<Todo, 'id'>;

/**
 * Todo update data (all properties optional except ID)
 */
export type TodoUpdateData = PartialExcept<Todo, 'id'>;

/**
 * Todo summary (minimal information)
 */
export type TodoSummary = PickOnly<Todo, 'id' | 'name' | 'statut'>;

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

/**
 * Application configuration
 */
export interface AppConfig {
  production: boolean;
  apiUrl: string;
  enableLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: {
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
  };
}

/**
 * Material table configuration
 */
export interface TableConfig {
  displayedColumns: string[];
  pageSize: number;
  pageSizeOptions: number[];
  sortable: boolean;
  filterable: boolean;
  selectable: boolean;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  warnColor: string;
  isDarkMode: boolean;
}

// ============================================================================
// TESTING INTERFACES
// ============================================================================

/**
 * Mock data for testing
 */
export interface MockData {
  todos: Todo[];
  users?: any[];
  categories?: any[];
}

/**
 * Test utilities interface
 */
export interface TestUtils {
  createMockTodo(overrides?: Partial<Todo>): Todo;
  createMockTodos(count: number): Todo[];
  createMockFormData(overrides?: Partial<TodoFormData>): TodoFormData;
}

/**
 * Component test harness
 */
export interface ComponentTestHarness<T> {
  component: T;
  fixture: ComponentFixture<T>;
  compiled: HTMLElement;
  detectChanges(): void;
  destroy(): void;
}

// ============================================================================
// ANGULAR SPECIFIC TYPES
// ============================================================================

/**
 * Angular Material table data source type
 */
export type TodoTableDataSource = MatTableDataSource<Todo>;

/**
 * Angular reactive form group for todos
 */
export type TodoFormGroup = FormGroup<{
  id: FormControl<number>;
  name: FormControl<string>;
  description: FormControl<string>;
  statut: FormControl<boolean>;
}>;

/**
 * Observable stream types commonly used in the app
 */
export type TodoStream = Observable<Todo>;
export type TodoListStream = Observable<Todo[]>;
export type TodoActionStream = Observable<any>;

// ============================================================================
// CONSTANTS AND ENUMS
// ============================================================================

/**
 * Todo status enumeration
 */
export enum TodoStatus {
  PENDING = false,
  COMPLETED = true
}

/**
 * Priority levels
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Component states
 */
export enum ComponentStateEnum {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  EDITING = 'editing',
  SAVING = 'saving'
}

/**
 * API endpoints
 */
export enum ApiEndpoints {
  TODOS = 'api/products/',
  TODO_BY_ID = 'api/products/{id}',
  SEARCH = 'api/products/search',
  BULK = 'api/products/bulk'
}

// ============================================================================
// RXJS OPERATOR TYPES
// ============================================================================

/**
 * Common RxJS operator combinations used in services
 */
export type ErrorHandlerOperator<T> = (source: Observable<T>) => Observable<T>;
export type RetryOperator<T> = (source: Observable<T>) => Observable<T>;
export type CacheOperator<T> = (source: Observable<T>) => Observable<T>;

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    /** Application configuration */
    APP_CONFIG?: AppConfig;
    
    /** Debug utilities */
    DEBUG_UTILS?: {
      logTodos: () => void;
      clearCache: () => void;
      exportData: () => string;
    };
  }
}

// ============================================================================
// MODULE AUGMENTATION
// ============================================================================

declare module '@angular/core' {
  interface ApplicationRef {
    /** Custom application properties */
    todoAppVersion?: string;
  }
}

declare module 'rxjs' {
  interface Observable<T> {
    /** Custom operator for todo-specific error handling */
    handleTodoError(): Observable<T>;
  }
}

// ============================================================================
// IMPORT STATEMENTS
// ============================================================================

import { Observable } from 'rxjs';
import { FormControl, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
