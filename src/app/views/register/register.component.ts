import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  solicitandoCadastro: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  onRegister(): void {
    if (this.solicitandoCadastro) return;
    this.registerForm.markAllAsTouched();
    if(this.registerForm.invalid) return;
    this.solicitandoCadastro = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['login']);
        this.toastr.showSuccess('Cadastro realizado com sucesso! Por favor, faça login.');
        this.solicitandoCadastro = false;
      },
      error: (err) => {
        console.log(err);
        this.solicitandoCadastro = false;
        if (err.status === 400 && err.error.email) {
          this.email.setErrors({ unique: true });
        } else {
          this.toastr.showError('Erro ao realizar cadastro');
        }
      }
    });
  }
}
