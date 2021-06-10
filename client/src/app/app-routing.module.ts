import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrawlerComponent } from './crawler/crawler.component';

const routes: Routes = [
  {
    path: '',
    component: CrawlerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
