import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemToastComponent } from './item-toast.component';

describe('ItemToastComponent', () => {
  let component: ItemToastComponent;
  let fixture: ComponentFixture<ItemToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemToastComponent]
    });
    fixture = TestBed.createComponent(ItemToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
