/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AssignAccountComponent } from './assign-account.component';

describe('AssignAccountComponent', () => {
  let component: AssignAccountComponent;
  let fixture: ComponentFixture<AssignAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
