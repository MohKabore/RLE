/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SdcardComponent } from './sdcard.component';

describe('SdcardComponent', () => {
  let component: SdcardComponent;
  let fixture: ComponentFixture<SdcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
