/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApproSpareComponent } from './appro-spare.component';

describe('ApproSpareComponent', () => {
  let component: ApproSpareComponent;
  let fixture: ComponentFixture<ApproSpareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproSpareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproSpareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
