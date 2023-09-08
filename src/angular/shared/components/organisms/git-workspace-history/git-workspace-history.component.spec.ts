import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitWorkspaceHistoryComponent } from './git-workspace-history.component';

describe('GitWorkspaceHistoryComponent', () => {
  let component: GitWorkspaceHistoryComponent;
  let fixture: ComponentFixture<GitWorkspaceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GitWorkspaceHistoryComponent]
    });
    fixture = TestBed.createComponent(GitWorkspaceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
