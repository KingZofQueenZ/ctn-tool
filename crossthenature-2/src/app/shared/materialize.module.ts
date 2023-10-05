import { NgModule } from '@angular/core';
import { MzParallaxModule, MzSidenavModule, MzIconModule, MzIconMdiModule, MzTabModule, MzSpinnerModule } from 'ng2-materialize';
import { MzButtonModule, MzInputModule, MzTextareaModule, MzDatepickerModule, MzTimepickerModule, MzCheckboxModule } from 'ng2-materialize';
import { MzModalModule, MzTooltipModule  } from 'ng2-materialize';

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
    MzModalModule,
    MzTooltipModule
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
    MzModalModule,
    MzTooltipModule
  ],
})
export class CustomMaterializeModule { }
