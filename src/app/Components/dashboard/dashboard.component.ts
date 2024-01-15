import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Helpers/products';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageService } from '../../Services/image.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  providers: [ProductService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  files: File[] = [];
  onSelect(e: any) {
    this.files.push(...e.addedFiles);
  }
  onRemove(r: any) {
    this.files.splice(this.files.indexOf(r, 1));
  }
  uploadfiles() {
    if (!this.files[0]) {
      alert('No file selected');
    } else {
      let file_data = this.files[0];
      let data = new FormData();
      data.append('file', file_data);
      data.append('upload_preset', 'cmbpis3g');
      data.append('cloud_name', 'dmdg4vamg');
      this.images.uploadimage(data).subscribe({
        next: (data: any) => (this.addedProduct.image = data.secure_url),
        complete: () => {
          this.Products.push(this.addedProduct);
          this.Products.sort(
            (product1: any, product2: any) => product1.id - product2.id
          );
          this.myService.updateSupplements(this.Products).subscribe({
            next: () => console.log('product added!'),
            error: () => console.log('Error Adding the product'),
            complete: () => {
              this.product.reset();
              this.files = [];
              this.closebutton.nativeElement.click();
            },
          });
        },
      });
    }
  }

  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonupdate') closebuttonupdate: any;

  product = new FormGroup({
    name: new FormControl(null, Validators.required),
    id: new FormControl(null, [Validators.required, Validators.min(1)]),
    quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
    seller: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    // image: new FormControl(null, Validators.required),
    description: new FormControl(null),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
  });

  updatedProduct = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    id: new FormControl({ value: 0, disabled: true }),
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
    seller: new FormControl('', [Validators.required, Validators.minLength(4)]),
    categories: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    description: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  editedProduct: Product = {};
  Products: Product[] = [];
  productIndex: number = 0;
  addedProduct: Product = {};
  constructor(
    private myService: ProductService,
    private images: ImageService
  ) {}

  ngOnInit(): void {
    this.myService.getAllSupplements().subscribe({
      next: (data) => {
        this.Products = this.Products.concat(data);
      },
      error: () => console.log('Error getting the data!'),
    });
  }

  deleteProduct(id: any) {
    if (confirm('Are you sure you wanna delete this product?')) {
      this.Products = this.Products.filter((element) => element.id != id);

      this.myService.deleteSupplement(this.Products).subscribe({
        next: () => console.log('Deleted'),
        error: () => console.log('Could not delete'),
      });
    }
  }

  page = 1;
  total: number = this.Products.length;
  itemsInPage: any = 12;
  changeValue(val: number) {
    this.itemsInPage = val;
    this.page = 1;
    this.total = this.Products.length;
  }

  changePage(event: any) {
    this.page = event;
    this.total = this.Products.length;
  }
  save() {
    if (this.Products.find((product) => product.id == this.product.value.id)) {
      document.getElementById('idExisted')!.style.display = 'inline';
      console.log('existed');
    } else {
      document.getElementById('idExisted')!.style.display = 'none';
      this.addedProduct = {
        id: this.product.value.id ?? 0,
        name: this.product.value.name ?? '',
        quantity: this.product.value.quantity ?? 0,
        price: this.product.value.price ?? 0,
        image: '',
        description: this.product.value.description ?? '',
        rating: 0,
        reviews: 0,
        categories: this.product.value.category ?? '',
        seller: this.product.value.seller ?? '',
      };
      this.uploadfiles();
    }
  }

  updateProduct(id?: number) {
    this.productIndex = this.Products.findIndex((product) => product.id == id);
    this.editedProduct = this.Products[this.productIndex];

    this.updatedProduct.patchValue(this.editedProduct);
  }
  update() {
    this.editedProduct.name = this.updatedProduct.value.name ?? '';
    this.editedProduct.price = this.updatedProduct.value.price ?? 0;
    this.editedProduct.quantity = this.updatedProduct.value.quantity ?? 0;
    this.editedProduct.categories = this.updatedProduct.value.categories ?? '';
    this.editedProduct.seller = this.updatedProduct.value.seller ?? '';
    this.editedProduct.description =
      this.updatedProduct.value.description ?? '';
    this.editedProduct.image = this.updatedProduct.value.image ?? '';

    this.Products[this.productIndex] = this.editedProduct;

    this.myService.updateSupplements(this.Products).subscribe({
      next: () => console.log('product updated!'),
      error: () => console.log('Error Adding the product'),
      complete: () => {
        this.updatedProduct.reset();
        this.closebuttonupdate.nativeElement.click();
      },
    });
  }
}
