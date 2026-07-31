import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { TaskService } from '../../../../core/services/task.service';
import { Task, TaskStatus, TASK_STATUSES, TASK_STATUS_LABELS } from '../../../../core/models/task.model';
import {
  TaskFormModalComponent,
  TaskFormSubmit,
} from '../../components/task-form-modal/task-form-modal.component';
import { StatusChangeEvent, TaskTableComponent } from '../../components/task-table/task-table.component';

/**
 * Componente "smart": única pieza de esta feature que conoce al TaskService.
 * Orquesta la carga de datos, delega la presentación a task-table y el
 * formulario a task-form-modal, y coordina las alertas de SweetAlert2.
 */
@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [CommonModule, TaskTableComponent, TaskFormModalComponent],
  templateUrl: './task-list-page.component.html',
})
export class TaskListPageComponent implements OnInit {
  @ViewChild(TaskFormModalComponent) private formModal!: TaskFormModalComponent;

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly submitting = signal(false);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<'all' | TaskStatus>('all');

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;

  readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.tasks().filter((task) => {
      const matchesStatus = status === 'all' || task.status === status;
      const matchesTerm =
        !term ||
        task.title.toLowerCase().includes(term) ||
        (task.description ?? '').toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value as 'all' | TaskStatus);
  }

  openCreateModal(): void {
    this.formModal.open();
  }

  openEditModal(task: Task): void {
    this.formModal.open(task);
  }

  onSave({ id, data }: TaskFormSubmit): void {
    this.submitting.set(true);
    const request = id ? this.taskService.update(id, data) : this.taskService.create(data);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.formModal.close();
        this.loadTasks();
        Swal.fire({
          icon: 'success',
          title: id ? 'Tarea actualizada' : 'Tarea creada',
          timer: 1600,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.submitting.set(false);
        if (err.status === 400) {
          const details = (err.error?.errors as { message: string }[] | undefined)
            ?.map((e) => e.message)
            .join('\n');
          Swal.fire({
            icon: 'error',
            title: 'Datos inválidos',
            text: details || 'Revisa los datos del formulario.',
          });
        }
      },
    });
  }

  onDeleteRequest(task: Task): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar tarea?',
      text: `Esta acción eliminará "${task.title}" de forma permanente.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.taskService.delete(task.id).subscribe({
        next: () => {
          this.loadTasks();
          Swal.fire({ icon: 'success', title: 'Tarea eliminada', timer: 1400, showConfirmButton: false });
        },
      });
    });
  }

  onStatusChange({ task, status }: StatusChangeEvent): void {
    this.taskService.update(task.id, { status }).subscribe({
      next: (updated) => {
        this.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      },
      error: () => this.loadTasks(),
    });
  }
}
