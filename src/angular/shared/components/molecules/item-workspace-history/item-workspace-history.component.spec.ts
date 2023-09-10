import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceHistoryItemComponent } from './workspace-history-item.component';

describe('WorkspaceHistoryItemComponent', () => {
  let component: WorkspaceHistoryItemComponent;
  let fixture: ComponentFixture<WorkspaceHistoryItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkspaceHistoryItemComponent]
    });
    fixture = TestBed.createComponent(WorkspaceHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
