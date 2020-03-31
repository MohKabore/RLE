import { Component, OnInit } from '@angular/core';
import { RetrofitService } from 'src/app/_services/retrofit.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-retrofit-products',
  templateUrl: './retrofit-products.component.html',
  styleUrls: ['./retrofit-products.component.scss']
})
export class RetrofitProductsComponent implements OnInit {
  products: any = [];
  productForm: FormGroup;
  productId: number;
  editMode = 'add';
  waitDiv = false;

  noResult = '';
  constructor(private router: Router, private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }


  ngOnInit() {
    this.getProducts();
    this.createProductForm(null);
  }

  getProducts() {
    this.retroService.getProductsDetails().subscribe((res: any[]) => {
      if (res.length > 0) {
        this.products = res;
      } else {
        this.noResult = 'aucun matériel trouvé...';
      }
    });
  }

  createProductForm(model) {
    this.productId = null;
    let productName: null;
    this.editMode = 'add';
    if (model != null) {
      productName = model.name;
      this.productId = model.id;
      this.editMode = 'edit';
    }

    this.productForm = this.fb.group({
      name: [productName, Validators.required]
    });

  }

  save() {
    debugger;
    this.waitDiv = true;
    const productName = this.productForm.value.name;
    if (this.editMode === 'add') {
      // nouvelle ajout
      this.retroService.addNewProduct(productName).subscribe((res: any) => {
        this.products = [...this.products, res];
        this.alertify.success('enregistrement terminée...');
        this.productForm.reset();
      });
    } else {
      // msie a jour

      this.retroService.updateProduct(this.productId, productName).subscribe((res: any) => {
        const idx = this.products.findIndex(a => a.id === this.productId);
        this.products[idx].name = productName;
        this.alertify.success('enregistrement terminée...');
        this.productForm.reset();
      });
    }
    this.waitDiv = false;

  }

}
