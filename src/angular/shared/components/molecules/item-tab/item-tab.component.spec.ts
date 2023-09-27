import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTabComponent } from './item-tab.component';

describe('ItemTabComponent', () => {
  let component: ItemTabComponent;
  let fixture: ComponentFixture<ItemTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItemTabComponent]
    });
    fixture = TestBed.createComponent(ItemTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
