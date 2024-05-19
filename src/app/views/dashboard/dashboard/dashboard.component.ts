import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { faEdit, faEye, faRemove, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from 'src/app/widgets/product-modal/product-modal.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  loadingProducts: boolean = true;
  faEye = faEye;
  faEdit = faEdit;
  faRemove = faRemove;
  faLogout = faSignOut;
  placeholders = new Array(12); //número de cards que aparecerão como placeholders

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      value: [0, Validators.required],
      image: [null]
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.products = response;
        this.loadingProducts = false;
      },
      error: (err) => {
        if(err.status === 401){
          this.authService.removeToken();
          this.router.navigate(['login']);
        }
        console.error(err);
      }
    });
  }

  addProduct() {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.isEditMode = false;

    modalRef.componentInstance.productUpdated.subscribe(() => {
      this.loadingProducts = true;
      this.loadProducts();
    });

    modalRef.result.then((result) => {
      if (result) {
        this.products.push(result);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  editProduct(product: Product) {
    const modalRef = this.modalService.open(ProductModalComponent);
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.productUpdated.subscribe(() => {
      this.loadingProducts = true;
      this.loadProducts();
    });

    modalRef.result.then((result) => {
      if (result) {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index > -1) {
          this.products[index] = result;
        }
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.removeToken();
          this.router.navigate(['login']);
        } else {
          this.toastrService.showError('Erro ao solicitar logout');
        }
      },

      error: (err) => {
        this.toastrService.showError('Erro ao solicitar logout');
      }
    })
  }

  removeProduct(product: Product) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            Swal.fire(
              'Deletado!',
              'O produto foi deletado.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire(
              'Erro!',
              'Ocorreu um erro ao deletar o produto.',
              'error'
            );
          }
        });
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.productForm.patchValue({ image: file });
    }
  }

  viewProductDetails(index: number) {
    this.router.navigate([`products/movements-details/${index}`])
  }
}
