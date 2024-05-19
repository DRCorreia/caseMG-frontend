import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModalComponent implements OnInit {
  @Input() product!: Product;
  @Input() isEditMode = false;
  @Output() productUpdated = new EventEmitter<void>();

  productForm!: FormGroup;
  imageFile: File | null = null;
  enviandoForm: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      description: [this.product?.description || '', Validators.required],
      value: [this.product?.value || 0, [Validators.required, Validators.min(0)]],
      stock: [this.product?.stock?.qty || 0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.productForm.patchValue({
        image: file
      });
    }
  }

  restrictNumeric(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  validateNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value.includes('e') || value.includes('.') || value.includes('-')) {
      value = value.replace(/[e.-]/g, '');
    }

    // Limita a entrada a 10 dígitos
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    input.value = value;
    this.productForm.get(input.id)?.setValue(parseInt(value, 10) || 0);
  }


  submitForm() {
    if (this.productForm.valid && !this.enviandoForm) {
      this.enviandoForm = true;
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('value', this.productForm.get('value')?.value);
      formData.append('stock', this.productForm.get('stock')?.value);
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }
      if (!this.isEditMode) {
        this.productsService.createProduct(formData).subscribe({
          next: (response) => {
            this.activeModal.close(formData);
            this.productUpdated.emit();
          },
          error: (err) => {
            this.enviandoForm = false;
            this.toastrService.showError('Erro ao criar produto');
          }
        })
      } else {
        this.productsService.updateProduct(formData, this.product.id).subscribe({
          next: (response) => {
            this.activeModal.close(formData);
            this.productUpdated.emit();
          },
          error: (err) => {
            this.enviandoForm = false;
            this.toastrService.showError('Erro ao editar produto');
          }
        })
      }

    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
