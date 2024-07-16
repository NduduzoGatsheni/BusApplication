import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBusPage } from './add-bus.page';

describe('AddBusPage', () => {
  let component: AddBusPage;
  let fixture: ComponentFixture<AddBusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
