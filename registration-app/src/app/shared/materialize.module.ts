import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule, MzTabModule } from 'ng2-materialize';

@NgModule({
  imports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule
  ],
  exports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule
  ],
})
export class CustomMaterializeModule { }
