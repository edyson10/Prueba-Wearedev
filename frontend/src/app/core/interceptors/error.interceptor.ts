import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../services/auth.service';

/**
 * Manejo centralizado de errores HTTP.
 *
 * Diferencia el tipo de error para reaccionar apropiadamente:
 * - 0 / sin respuesta: problema de red o timeout -> alerta genérica.
 * - 401: token inválido o expirado -> cierra sesión y redirige al login.
 * - 500+: error del servidor -> alerta genérica.
 * - 400 / 404: se dejan pasar tal cual, porque el componente que hizo la
 *   petición sabe mostrar el detalle específico (ej. errores de un formulario).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Sin conexión',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet o que el backend esté disponible.',
        });
      } else if (error.status === 401) {
        const wasLoggedIn = authService.isAuthenticated();
        authService.logout();
        if (wasLoggedIn) {
          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión expiró o no es válida. Inicia sesión nuevamente.',
          });
        }
        router.navigate(['/login']);
      } else if (error.status >= 500) {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'Ocurrió un problema en el servidor. Intenta nuevamente en unos minutos.',
        });
      }

      return throwError(() => error);
    })
  );
};
