/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FailureReportComponent } from './failure-report.component';

describe('FailureReportComponent', () => {
  let component: FailureReportComponent;
  let fixture: ComponentFixture<FailureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
