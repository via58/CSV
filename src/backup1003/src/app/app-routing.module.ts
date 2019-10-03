import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CsvlayoutComponent } from './csv/components/csvlayout/csvlayout.component';

const routes: Routes = [
  { path: 'home', component: CsvlayoutComponent },
  { path: '',  redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
