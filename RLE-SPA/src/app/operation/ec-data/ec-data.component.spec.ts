/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EcDataComponent } from './ec-data.component';

describe('EcDataComponent', () => {
  let component: EcDataComponent;
  let fixture: ComponentFixture<EcDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
