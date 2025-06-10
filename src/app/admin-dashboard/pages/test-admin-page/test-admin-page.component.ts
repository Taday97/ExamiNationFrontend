import { Component, signal } from '@angular/core';
import { AdminTestsHeaderComponent } from '@admin-dashboard/components/admin-tests-header/admin-tests-header.component';
import { TestAdminCrudComponent } from '../../components/admin-tests-table/admin-tests-table.component';

@Component({
  selector: 'app-test-admin-page',
  imports: [AdminTestsHeaderComponent, TestAdminCrudComponent],
  templateUrl: './test-admin-page.component.html',
})
export class TestAdminPageComponent {}
