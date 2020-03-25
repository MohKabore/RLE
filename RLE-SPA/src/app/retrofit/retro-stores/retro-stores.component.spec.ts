/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RetroStoresComponent } from './retro-stores.component';

describe('RetroStoresComponent', () => {
  let component: RetroStoresComponent;
  let fixture: ComponentFixture<RetroStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetroStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetroStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
