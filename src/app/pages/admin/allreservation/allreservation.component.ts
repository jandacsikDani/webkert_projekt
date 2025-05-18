import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReservationsService } from '../../../shared/services/reservations/reservations.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { DatetimeformatPipe } from '../../../shared/pipes/datetimeformat/datetimeformat.pipe';

@Component({
  selector: 'app-allreservation',
  imports: [MatTableModule, MatButtonModule, MatPaginator, DatetimeformatPipe],
  templateUrl: './allreservation.component.html',
  styleUrl: './allreservation.component.css'
})
export class AllreservationComponent implements OnInit, OnDestroy{
isEmpty: boolean = true;
private subsriptions: Subscription[] = [];
dataSource = new MatTableDataSource();
displayedColumns: string[] = ['date', 'name', 'email', 'phone', 'nop'];

@ViewChild(MatPaginator) pageinator!: MatPaginator;

constructor(private reservationService: ReservationsService){}

loadReservations(): void{
  this.subsriptions.push(this.reservationService.getAllReservations().subscribe(data => {
    if(data.length != 0){
      this.dataSource.data = data;
      this.isEmpty = false;
    }
  }));
}

ngOnInit(): void {
  this.loadReservations();
}
ngOnDestroy(): void {
  this.subsriptions.forEach(sub => {
    sub.unsubscribe();
  });
}
}
