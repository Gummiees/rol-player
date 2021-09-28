import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { TopbarComponent } from './topbar.component';

@NgModule({
  declarations: [TopbarComponent],
  imports: [SharedModule, MatToolbarModule, MatIconModule, MatMenuModule, RouterModule],
  exports: [TopbarComponent],
  providers: [],
})
export class TopbarModule {}