import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule, MzTabModule, MzSpinnerModule, MzButtonModule } from 'ng2-materialize';

@NgModule({
  imports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule,
    MzSpinnerModule,
    MzButtonModule 
  ],
  exports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule,
    MzSpinnerModule,
    MzButtonModule 
  ],
})
export class CustomMaterializeModule { }
