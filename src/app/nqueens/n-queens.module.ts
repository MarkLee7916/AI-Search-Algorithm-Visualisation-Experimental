import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { TutorialModalComponent } from './components/tutorial-modal/tutorial-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { NQueensRoutingModule } from './n-queens-routing-module';
import { SharedModule } from '../shared/shared.module';
import { TileComponent } from './components/tile/tile.component';

@NgModule({
  declarations: [PageComponent, TutorialModalComponent, TileComponent],
  imports: [CommonModule, BrowserModule, NQueensRoutingModule, SharedModule],
})
export class NQueensModule {}
