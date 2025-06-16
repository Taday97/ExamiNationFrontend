import {  Routes } from "@angular/router";
import { IsAdminGuard } from "@auth/guards/is-admin.guard";
import { AdminDashboardLayoutComponent } from "./layout/admin-dashboard-layout/admin-dashboard-layout.component";
import { TestAdminPageComponent } from "./pages/test-admin-page/test-admin-page.component";
import { QuestionAdminPageComponent } from "./pages/question-admin-page/question-admin-page.component";

export const adminDashboardRoutes:Routes=[{
  path:'',
  component:AdminDashboardLayoutComponent,
  canMatch:[
    IsAdminGuard
  ],
  children:[
     {
      path:'tests',
      component:TestAdminPageComponent
    },
    {
      path:'questions',
      component:QuestionAdminPageComponent
    },
    {
      path:'**',
      redirectTo:'tests'
    }
  ]
}];
export default adminDashboardRoutes;

