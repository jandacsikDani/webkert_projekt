import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { DateFormatPipe } from '../../shared/pipes/dateFormat/date-format.pipe';
import { News } from '../../shared/models/News';
import { NewsService } from '../../shared/services/news/news.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [MatDividerModule, DateFormatPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  news: News[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private newsService: NewsService){}

  loadNews(): void{
    this.subscriptions.push(this.newsService.getAllNewsAdmin().subscribe(data => {
      if(data.length != 0){
        this.news = data;
      }
    }));
  }

  ngOnInit(): void {
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
