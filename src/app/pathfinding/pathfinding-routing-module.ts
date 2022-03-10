import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from './components/page/page.component';

const routes = [
  {
    path: 'pathfinding',
    component: PageComponent,
  },
  {
    path: '',
    redirectTo: '/pathfinding',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PathfindingRoutingModule {}
