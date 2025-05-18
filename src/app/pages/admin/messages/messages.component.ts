import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatetimeformatPipe } from '../../../shared/pipes/datetimeformat/datetimeformat.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService } from '../../../shared/services/message/message.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  imports: [MatTableModule, MatButtonModule, MatPaginator, DatetimeformatPipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = ['date', 'name', 'email', 'phone', 'message', 'action'];
  isEmpty: boolean = true;
  private subsriptions: Subscription[] = [];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) pageinator!: MatPaginator;

  constructor(private messageService: MessageService, private dialog: MatDialog, private snackBar: MatSnackBar){}

  setAsRead(id: string): void{
    this.messageService.setAsRead(id);
  }

  loadMessages(): void{
    this.subsriptions.push(this.messageService.getAllMessages().subscribe(data => {
      if(data.length != 0){
        this.dataSource.data = data;
        this.isEmpty = false;
      }
    }));
  }

  confirmDelete(id: string){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {message: 'Biztosan törölni szeretnéd ezt az üzenetet?'}
    });

    this.subsriptions.push(dialogRef.afterClosed().subscribe(result => {
      if (result) this.messageService.deleteMessage(id).then(() => {
        this.snackBar.open('Sikeres törlés!', 'OK', {
          duration: 3000
        });
      }).catch(() => {
        this.snackBar.open('Sikeretelen törlés!', 'OK', {
          duration: 3000
        });
      });
      else return;
    }));
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
