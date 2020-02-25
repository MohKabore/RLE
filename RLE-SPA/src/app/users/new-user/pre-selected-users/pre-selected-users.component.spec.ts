/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PreSelectedUsersComponent } from './pre-selected-users.component';

describe('PreSelectedUsersComponent', () => {
  let component: PreSelectedUsersComponent;
  let fixture: ComponentFixture<PreSelectedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreSelectedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSelectedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
