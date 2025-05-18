import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { News } from '../../shared/models/News';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-news-editor',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './news-editor.component.html',
  styleUrl: './news-editor.component.css'
})
export class NewsEditorComponent implements OnInit{
  news!: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewsEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: {news: News}){}

  ngOnInit(): void {
    this.news = new FormGroup({
      title: new FormControl(this.data.news.title, Validators.required),
      desc: new FormControl(this.data.news.desc, Validators.required),
      datePicker: new FormControl(new Date(this.data.news.date), Validators.required)
    });
  }
}
