import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { RedirectGuard } from '@auth/guards/redirect.guard';

export const routes: Routes = [
    {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch:[
      NotAuthenticatedGuard,
      // ()=>{
      //   console.log('Hola Mundo');
      //   return true;
      // }
    ]
    //TODO Guards
  },
  {
    path:'admin',
    loadChildren:()=>import('./admin-dashboard/admin-daschboard.routes'),

  },
  {
    path:'',
    loadChildren:()=> import('./test-front/test.front.routes'),
    canActivate: [RedirectGuard],
  }
];
