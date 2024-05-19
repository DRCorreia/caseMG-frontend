import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowDown, faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Movements } from 'src/app/models/movements';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { MovementsService } from 'src/app/services/movements.service';

@Component({
  selector: 'app-movements-details',
  templateUrl: './movements-details.component.html',
  styleUrls: ['./movements-details.component.scss']
})
export class MovementsDetailsComponent implements OnInit {
  productId!: number | null;
  product!: Product;
  movements!: Movements[];
  qtySimulate: number = 0;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faArrowLeft = faArrowLeft;
  loadingMovements: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movementsService: MovementsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
    });
    if (!this.productId) this.router.navigate(['products']);
    this.loadMovements();
  }

  loadMovements() {
    this.movementsService.getProductMovementsByID(Number(this.productId)).subscribe({
      next: (response) => {
        console.log(response)

        if (response.movements && response.product) {
          console.log(response.product.stock?.qty);
          if (response.product.stock?.qty && response.product.stock?.qty >= 10) {
            this.qtySimulate = 10;
          } else if (response.product.stock?.qty && response.product.stock?.qty < 10) {
            this.qtySimulate = response.product.stock?.qty;
          }
          this.movements = response.movements;
          this.product = response.product;
          this.loadingMovements = false;
        } else {
          this.loadingMovements = false;
        }
      },
      error: (err) => {
        if (err.status === 404) this.router.navigate(['products']);
        if (err.status === 401) {
          this.authService.removeToken();
          this.router.navigate(['login']);
        }
        this.loadingMovements = false;
      }
    })
  }

  simulate(type: string) {
    let qtdToAddOrRemove = 0;
    if (type === 'E') {
      qtdToAddOrRemove = 10;
    } else {
      qtdToAddOrRemove = this.qtySimulate;
    }
    const dados = {
      'productId': this.productId,
      'movementQty': qtdToAddOrRemove,
      'movementType': type
    };

    this.movementsService.simulate(dados).subscribe({
      next: (response) => {
        this.qtySimulate = 0;
        this.loadingMovements = true;
        this.loadMovements();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
