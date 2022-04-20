import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { TileComponent } from './components/tile/tile.component';
import { TutorialModalComponent } from './components/tutorial-modal/tutorial-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { PathfindingRoutingModule } from './pathfinding-routing-module';
import { SharedModule } from '../shared/shared.module';
import { TheoryModalComponent } from './components/theory-modal/theory-modal.component';

@NgModule({
  declarations: [PageComponent, TileComponent, TutorialModalComponent, TheoryModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PathfindingRoutingModule,
    SharedModule,
  ],
})
export class PathfindingModule {}
