import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllBusesPage } from './all-buses.page';

describe('AllBusesPage', () => {
  let component: AllBusesPage;
  let fixture: ComponentFixture<AllBusesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBusesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
