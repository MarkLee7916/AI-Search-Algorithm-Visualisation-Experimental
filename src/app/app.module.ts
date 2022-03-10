import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MinimaxModule } from './minimax/minimax.module';
import { NQueensModule } from './nqueens/n-queens.module';
import { PathfindingModule } from './pathfinding/pathfinding.module';

@NgModule({
  declarations: [AppComponent],
  providers: [],
  imports: [
    PathfindingModule,
    NQueensModule,
    MinimaxModule,
    AppRoutingModule,
    RouterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
