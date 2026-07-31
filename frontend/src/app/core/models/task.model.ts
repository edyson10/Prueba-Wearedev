export type TaskStatus = 'pending' | 'in_progress' | 'done';

export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'done'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  done: 'Completada',
};

/** Tarea tal como la devuelve la API. */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/** Datos que el formulario envía al crear o actualizar una tarea. */
export interface TaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
}
