import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavComponent } from './vertical-nav.component';

describe('VerticalNavComponent', () => {
  let component: VerticalNavComponent;
  let fixture: ComponentFixture<VerticalNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VerticalNavComponent]
    });
    fixture = TestBed.createComponent(VerticalNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
