import { Component, OnInit } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.scss']
})
export class CrawlerComponent implements OnInit {

  crawlerCategories:Array<any> = [];
  Categories:Array<any> = [];
  loading = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCategory();
  }
  getCategory() {
    this.loading = true;
    this.http.get(environment.cApi + 'category').subscribe((res: any) =>{
      this.Categories = res;
      this.loading = false;
    }, err => {
      console.log(err)
      this.loading = false;
    })
  }
  crawlerCategory() {
    this.loading = true;
    this.http.get(environment.cApi + 'crawler-category').subscribe((res: any) =>{
      this.crawlerCategories = res;
      this.loading = false;
    }, err => {
      console.log(err)
      this.loading = false;
    })
  }
}
