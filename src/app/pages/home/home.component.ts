import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import newsjson from '../../../data/news.json';

@Component({
  selector: 'app-home',
  imports: [MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  news = newsjson
}
