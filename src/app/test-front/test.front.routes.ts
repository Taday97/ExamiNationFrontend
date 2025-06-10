import { Routes } from '@angular/router';
import { TestFrontLayoutComponent } from './layouts/test-front-layout/test-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TypeTestPageComponent } from './pages/type-test-page/type-test-page.component';
import { TestPageStartComponent } from './pages/test-page-start/test-page-start.component';
import { TestBareLayoutComponent } from './layouts/test-bare-layout/test-bare-layout/test-bare-layout.component';
import { TestPageResultsComponent } from './pages/test-page-results/test-page-results.component';
import { StandardLayoutComponent } from './layouts/standard.layout/standard.layout.component';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { ForbiddenComponent } from '@shared/components/forbidden/forbidden.component';
import { TestPageHistoriesComponent } from './pages/test-page-histories/test-page-histories.component';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';

export const testFrontRoutes: Routes = [
  {
    path: '',
    component: TestFrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'test/:type',
        component: TypeTestPageComponent,
      },
    ],
  },
  {
    path: '',
    component: TestBareLayoutComponent,
    children: [
      {
        path: 'test/:testId/start',
        component: TestPageStartComponent,
      },
    ],
  },
  {
    path: '',
    component: StandardLayoutComponent,
    children: [
      {
        path: 'test-result/:id/details',
        component: TestPageResultsComponent,
      },
      {
        path: 'test-result/history',
        component: TestPageHistoriesComponent,
        canActivate: [AuthenticatedGuard],
      },
    ],
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent,
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
export default testFrontRoutes;
