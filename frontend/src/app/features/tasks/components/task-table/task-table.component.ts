import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Task, TaskStatus, TASK_STATUSES, TASK_STATUS_LABELS } from '../../../../core/models/task.model';

export interface StatusChangeEvent {
  task: Task;
  status: TaskStatus;
}

/**
 * Componente "dumb": solo recibe datos y emite eventos. No conoce el TaskService
 * ni hace ninguna petición HTTP; toda la orquestación vive en task-list-page.
 */
@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-table.component.html',
})
export class TaskTableComponent {
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  @Output() statusChange = new EventEmitter<StatusChangeEvent>();

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;

  statusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case 'pending':
        return 'text-bg-secondary';
      case 'in_progress':
        return 'text-bg-warning';
      case 'done':
        return 'text-bg-success';
    }
  }

  onStatusSelect(task: Task, status: string): void {
    this.statusChange.emit({ task, status: status as TaskStatus });
  }
}
