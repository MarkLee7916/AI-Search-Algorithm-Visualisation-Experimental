import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from './components/page/page.component';

const routes = [
  {
    path: 'n-queens',
    component: PageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NQueensRoutingModule {}
