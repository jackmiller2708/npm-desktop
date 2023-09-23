import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPackageComponent } from './details-package.component';

describe('DetailsPackageComponent', () => {
  let component: DetailsPackageComponent;
  let fixture: ComponentFixture<DetailsPackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailsPackageComponent]
    });
    fixture = TestBed.createComponent(DetailsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
