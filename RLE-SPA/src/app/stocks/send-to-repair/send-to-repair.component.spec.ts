/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SendToRepairComponent } from './send-to-repair.component';

describe('SendToRepairComponent', () => {
  let component: SendToRepairComponent;
  let fixture: ComponentFixture<SendToRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendToRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendToRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
