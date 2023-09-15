import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayToastComponent } from './display-toast.component';

describe('DisplayToastComponent', () => {
  let component: DisplayToastComponent;
  let fixture: ComponentFixture<DisplayToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisplayToastComponent]
    });
    fixture = TestBed.createComponent(DisplayToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
