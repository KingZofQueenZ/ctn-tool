import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule, MzTabModule, MzSpinnerModule, MzButtonModule, MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule, MzModalModule } from 'ng2-materialize';

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
    MzCheckboxModule,
    MzModalModule 
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
    MzCheckboxModule,
    MzModalModule 
  ],
})
export class CustomMaterializeModule { }
