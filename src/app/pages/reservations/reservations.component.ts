import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Reservations, reservationConverter } from '../../shared/models/Reservations';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { DatetimeformatPipe } from '../../shared/pipes/datetimeformat/datetimeformat.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { ReservationsService } from '../../shared/services/reservations/reservations.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-reservations',
  imports: [MatTableModule, MatButtonModule, MatSnackBarModule, DatetimeformatPipe, MatPaginator],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})

export class ReservationsComponent implements AfterViewInit, OnInit, OnDestroy{
  displayedColumns: string[] = ['date', 'nop', 'actions'];
  reservations: Reservations[] = [];
  private subscriptions: Subscription[] = [];
  dataSource = new MatTableDataSource(this.reservations);
  isEmpty: boolean = true;

  @ViewChild(MatPaginator) pageinator!: MatPaginator;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private reservationService: ReservationsService){}

  confirmDelete(reservation: Reservations): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {message: "Biztosan törölni szeretné a foglalását?"}});

    this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteReservation(reservation)
      }
    }));
  }

  async deleteReservation(reservation: Reservations): Promise<void>{
    const index = this.dataSource.data.findIndex(u => u.id === reservation.id);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
      await this.reservationService.deleteReservation(reservation.id);
      this.snackBar.open('Sikeres törlés', 'Bezárás', {
        duration: 3000
      });
      if(this.reservations.length == 0) this.isEmpty = true;
    }
  }

  loadReservations(): void{
    this.subscriptions.push(this.reservationService.getItemsByUserId().subscribe(data => {
      if(data.length !== 0){
        this.dataSource.data = data;
        this.isEmpty = false;
      }
    }));
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.pageinator;
  }
}
