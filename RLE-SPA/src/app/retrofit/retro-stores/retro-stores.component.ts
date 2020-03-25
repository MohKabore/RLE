import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RetrofitService } from 'src/app/_services/retrofit.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-retro-stores',
  templateUrl: './retro-stores.component.html',
  styleUrls: ['./retro-stores.component.scss']
})
export class RetroStoresComponent implements OnInit {
  storeForm: FormGroup;
  color = '';
  stores: any = [];

  constructor(private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createStockForm();
  }

  createStockForm() {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      color: ['']
    });
  }

  setColor() {
    this.storeForm.patchValue({ color: this.color });
  }

  saveStore() {
    const store = this.storeForm.value;
    this.retroService.addNewStore(store).subscribe((res: any) => {
      this.stores = [...this.stores, res];
      this.alertify.success('enregistrement terminé...');
    });
  }

}
