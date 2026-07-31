import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Task, TaskInput } from '../models/task.model';

/**
 * Único punto de acceso HTTP para tareas. Los componentes nunca llaman a HttpClient
 * directamente: siempre pasan por este service (así se puede probar o cambiar la
 * fuente de datos sin tocar los componentes).
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http
      .get<ApiResponse<Task[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<Task> {
    return this.http
      .get<ApiResponse<Task>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(task: TaskInput): Observable<Task> {
    return this.http
      .post<ApiResponse<Task>>(this.apiUrl, task)
      .pipe(map((response) => response.data));
  }

  update(id: number, task: Partial<TaskInput>): Observable<Task> {
    return this.http
      .put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }
}
