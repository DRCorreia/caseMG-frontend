// src/app/shared/services/toastr.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private toastr = Swal.mixin({
    toast: true,
    icon: 'error',
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toastr: any) => {
      toastr.addEventListener('mouseenter', Swal.stopTimer);
      toastr.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  showError(message: string) {
    this.toastr.fire({
      icon: 'error',
      title: message,
    });
  }

  showSuccess(message: string) {
    this.toastr.fire({
      icon: 'success',
      title: message,
    });
  }
}
