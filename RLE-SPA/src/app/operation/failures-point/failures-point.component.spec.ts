/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FailuresPointComponent } from './failures-point.component';

describe('FailuresPointComponent', () => {
  let component: FailuresPointComponent;
  let fixture: ComponentFixture<FailuresPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailuresPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailuresPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
