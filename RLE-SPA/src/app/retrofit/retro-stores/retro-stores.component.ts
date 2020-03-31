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
  showExport = false;
  editionMode = 'add';
  stores: any = [];
  formModel: any;
  storeId: number;

  constructor(private fb: FormBuilder, private retroService: RetrofitService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createStockForm(null);
    this.getStores();
  }

  createStockForm(model) {
    if (model === null) {
      this.editionMode = 'add';
      model = {
        name: '',
        color: ''
      };
    } else {
      this.editionMode = 'edit';
      this.storeId = model.id;

    }

    this.storeForm = this.fb.group({
      name: [model.name, Validators.required],
      color: [model.color]
    });

  }

  setColor() {
    this.storeForm.patchValue({ color: this.color });
  }

  saveStore() {
    const store = this.storeForm.value;

    if (this.editionMode === 'add') {
      this.retroService.addNewStore(store).subscribe((res: any) => {
        this.stores = [...this.stores, res];
        this.alertify.success('enregistrement terminé...');
        this.storeForm.reset();
      });
    } else {
      this.retroService.updateStore(this.storeId, store).subscribe((res: any) => {
        let ss = this.stores.find(a => a.id === this.storeId);
        ss.name = store.name;
        ss.color = store.color;
        this.alertify.success('enregistrement terminé...');
        this.storeForm.reset();
      });
    }
  }

  getStores() {
    this.retroService.getStoresDetailList().subscribe((res: any[]) => {
      this.stores = res;
    });
  }



}
