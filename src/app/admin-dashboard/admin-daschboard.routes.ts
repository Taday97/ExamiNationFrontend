import { Routes } from '@angular/router';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';
import { AdminDashboardLayoutComponent } from './layout/admin-dashboard-layout/admin-dashboard-layout.component';
import { TestAdminPageComponent } from './pages/test-admin-page/test-admin-page.component';
import { DashboardAdminPageComponent } from './pages/dashboard-admin-page/dashboard-admin-page.component';
import { QuestionAdminPageComponent } from './pages/question-admin-page/question-admin-page.component';
import { CognitiveCategoryAdminPageComponent } from './pages/cognitive-category-admin-page/cognitive-category-admin-page.component';
import { ScoringRangesAdminPagesComponent } from './pages/scoring-ranges-admin-pages/scoring-ranges-admin-pages.component';
import { TestResultAdminPagesComponent } from './pages/test-result-admin-pages/test-result-admin-pages.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    canMatch: [IsAdminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardAdminPageComponent,
      },
      {
        path: 'tests',
        component: TestAdminPageComponent,
      },
      {
        path: 'questions',
        component: QuestionAdminPageComponent,
      },
      {
        path: 'cognitiveCategories',
        component: CognitiveCategoryAdminPageComponent,
      },
      {
        path: 'scoringRanges',
        component: ScoringRangesAdminPagesComponent,
      },
      {
        path: 'testResults',
        component: TestResultAdminPagesComponent,
      },
      {
        path: '**',
        redirectTo: 'tests',
      },
    ],
  },
];
export default adminDashboardRoutes;
