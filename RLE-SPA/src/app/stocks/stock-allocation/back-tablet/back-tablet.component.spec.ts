/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BackTabletComponent } from './back-tablet.component';

describe('BackTabletComponent', () => {
  let component: BackTabletComponent;
  let fixture: ComponentFixture<BackTabletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackTabletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackTabletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
