import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule, MzTabModule, MzSpinnerModule, MzButtonModule, MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule } from 'ng2-materialize';

@NgModule({
  imports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule,
    MzSpinnerModule,
    MzButtonModule,
    MzInputModule,
    MzTextareaModule,
    MzDatepickerModule,
    MzTimepickerModule,
    MzCheckboxModule 
  ],
  exports: [
    MzParallaxModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzTabModule,
    MzSpinnerModule,
    MzButtonModule,
    MzInputModule,
    MzTextareaModule,
    MzDatepickerModule,
    MzTimepickerModule,
    MzCheckboxModule 
  ],
})
export class CustomMaterializeModule { }
