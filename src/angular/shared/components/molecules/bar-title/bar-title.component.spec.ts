import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarTitleComponent } from './bar-title.component';

describe('BarTitleComponent', () => {
  let component: BarTitleComponent;
  let fixture: ComponentFixture<BarTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BarTitleComponent]
    });
    fixture = TestBed.createComponent(BarTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
