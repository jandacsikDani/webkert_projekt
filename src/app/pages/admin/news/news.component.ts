import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NewsService } from '../../../shared/services/news/news.service';
import { Subscription, take } from 'rxjs';
import { News } from '../../../shared/models/News';
import { DateFormatPipe } from '../../../shared/pipes/dateFormat/date-format.pipe';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { NewsEditorComponent } from '../../../components/news-editor/news-editor.component';

@Component({
  selector: 'app-news',
  imports: [MatDividerModule, MatButtonModule, DateFormatPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit, OnDestroy{
  news: News[] = [];
  private subcriptions: Subscription[] = [];

  constructor(private newsService: NewsService, private snackbar: MatSnackBar, private dialog: MatDialog){}

  newsInput = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required)
  });

  loadNews(): void{
    this.subcriptions.push(this.newsService.getAllNewsAdmin().subscribe(data => {
      if(data.length != 0){
        this.news = data;
      }
    }));
  }

  editNews(id: string): void{
    this.newsService.getNewsById(id).pipe(take(1)).subscribe(data => {
      const dialogRef = this.dialog.open(NewsEditorComponent, {data: {news: data[0]}});

      dialogRef.afterClosed().pipe(take(1)).subscribe(returnData => {
        const newNews: Partial<News> = {
          title: returnData.get('title')?.value || '',
          desc: returnData.get('desc')?.value || '',
          date: returnData.get('datePicker')?.value || ''
        };
        this.newsService.updateNews(id, newNews).then(() => {
          this.snackbar.open('A hír sikeresen frissítve.', 'OK', {duration: 3000});
        }).catch(() => {
          this.snackbar.open('Hiba a frissítés közben.', 'OK', {duration: 3000});
        });
      });
    });
  }

  deleteNews(id: string): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {message: "Biztos törölni szeretnéd ezt a hírt?"}});
    this.subcriptions.push(dialogRef.afterClosed().subscribe(result => {
      if(result) this.newsService.deleteNews(id).then(() => {
        this.snackbar.open('Sikeres törlés', 'OK', {duration: 3000});
      }).catch(() => {
        this.snackbar.open('Hiba lépett fel a törlés közben.', 'OK', {duration: 3000});
      });
      else return;
    }));
  }

  addNews(): void{
    const newNews: News = {
      id: "",
      title: this.newsInput.get('title')?.value || '',
      desc: this.newsInput.get('desc')?.value || '',
      date: new Date()
    };
    this.newsService.addNews(newNews).then(() => {
      this.snackbar.open('Hír sikersen létrhozva!', 'OK', {duration: 3000});
      this.newsInput.reset();
    }).catch(() => {
      this.snackbar.open('Hiba lépett fel a művelet közben.', 'OK', {duration: 3000});
    });
  }

  ngOnInit(): void {
    this.loadNews();
  }

  ngOnDestroy(): void {
    this.subcriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
