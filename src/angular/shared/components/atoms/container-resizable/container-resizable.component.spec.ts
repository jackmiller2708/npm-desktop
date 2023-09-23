import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerResizableComponent } from './container-resizable.component';

describe('ContainerResizableComponent', () => {
  let component: ContainerResizableComponent;
  let fixture: ComponentFixture<ContainerResizableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContainerResizableComponent]
    });
    fixture = TestBed.createComponent(ContainerResizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
