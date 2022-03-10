import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinimaxRoutingModule } from './minimax-routing.module';
import { PageComponent } from './components/page/page.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { TutorialModalComponent } from './components/tutorial-modal/tutorial-modal.component';
import { EnterLeafValuesModalComponent } from './components/enter-leaf-values-modal/enter-leaf-values-modal.component';
import { InfinitySymbolPipe } from './pipes/infinity-symbol.pipe';
import { NodeComponent } from './components/node/node.component';

@NgModule({
  declarations: [
    PageComponent,
    TutorialModalComponent,
    EnterLeafValuesModalComponent,
    InfinitySymbolPipe,
    NodeComponent,
  ],
  imports: [CommonModule, MinimaxRoutingModule, BrowserModule, SharedModule],
})
export class MinimaxModule {}
