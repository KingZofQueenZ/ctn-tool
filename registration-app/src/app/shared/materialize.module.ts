import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule } from 'ng2-materialize';

@NgModule({
  imports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule
  ],
  exports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule
  ],
})
export class CustomMaterializeModule { }
