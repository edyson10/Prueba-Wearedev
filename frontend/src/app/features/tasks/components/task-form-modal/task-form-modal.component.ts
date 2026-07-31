import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

import { Task, TaskInput, TaskStatus, TASK_STATUSES, TASK_STATUS_LABELS } from '../../../../core/models/task.model';

export interface TaskFormSubmit {
  id?: number;
  data: TaskInput;
}

/**
 * Componente "dumb": no llama a la API directamente. Solo maneja el formulario
 * reactivo dentro de un modal de Bootstrap y emite "save" con los datos listos
 * para que el componente padre (task-list-page) haga la petición HTTP.
 */
@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent implements AfterViewInit, OnDestroy {
  @Input() submitting = false;
  @Output() save = new EventEmitter<TaskFormSubmit>();

  @ViewChild('modalRef') private modalRef!: ElementRef<HTMLDivElement>;
  private modalInstance!: Modal;

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;

  private readonly fb = inject(FormBuilder);

  editingId: number | null = null;

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['pending' as TaskStatus, [Validators.required]],
  });

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalRef.nativeElement, { backdrop: 'static' });
  }

  ngOnDestroy(): void {
    this.modalInstance?.dispose();
  }

  /** Abre el modal. Si se pasa una tarea, entra en modo edición; si no, en modo creación. */
  open(task?: Task): void {
    this.editingId = task?.id ?? null;
    this.form.reset({
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'pending',
    });
    this.modalInstance.show();
  }

  /** El padre lo llama después de que la petición HTTP terminó exitosamente. */
  close(): void {
    this.modalInstance.hide();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description, status } = this.form.getRawValue();

    this.save.emit({
      id: this.editingId ?? undefined,
      data: {
        title: title!.trim(),
        description: description?.trim() || null,
        status: status!,
      },
    });
  }
}
