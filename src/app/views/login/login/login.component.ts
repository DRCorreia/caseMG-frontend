import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  solicitandoLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onLogin(): void {
    if (this.solicitandoLogin) return;
    this.loginForm.markAllAsTouched();
    if(this.loginForm.invalid) return;
    this.solicitandoLogin = true;
    this.authService.login(this.email.value, this.password.value).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.router.navigate(['products']);
          this.authService.setToken(response.access_token);
        } else {
          this.toastr.showError('Credenciais inválidas');
        }
        this.solicitandoLogin = false;
      },

      error: (err) => {
        console.log(err);
        this.solicitandoLogin = false;
        this.toastr.showError('Credenciais inválidas');
      }
    })
  };



}
