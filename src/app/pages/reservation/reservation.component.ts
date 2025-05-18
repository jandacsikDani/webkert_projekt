import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule, MAT_TIMEPICKER_CONFIG, MatTimepickerOption } from '@angular/material/timepicker';
import { ReservationsService } from '../../shared/services/reservations/reservations.service';
import { User } from '../../shared/models/User';
import { Subscription } from 'rxjs';
import { Reservations } from '../../shared/models/Reservations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-reservation',
  imports: [
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTimepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit, OnDestroy{
  highlightDates: Date[] = [];
  first!: FormGroup;
  isLoading: boolean = true;
  private subscriptions: Subscription[] = [];

  @ViewChild('stepper') stepper: MatStepper = new MatStepper;

  customTimes: MatTimepickerOption<Date>[] = [
    {label: '10:00', value: new Date(2024, 0, 1, 10, 0, 0)},
    {label: '11:00', value: new Date(2024, 0, 1, 11, 0, 0)},
    {label: '12:00', value: new Date(2024, 0, 1, 12, 0, 0)},
    {label: '13:00', value: new Date(2024, 0, 1, 13, 0, 0)},
    {label: '14:00', value: new Date(2024, 0, 1, 14, 0, 0)},
    {label: '15:00', value: new Date(2024, 0, 1, 15, 0, 0)},
    {label: '16:00', value: new Date(2024, 0, 1, 16, 0, 0)},
    {label: '17:00', value: new Date(2024, 0, 1, 17, 0, 0)},
    {label: '18:00', value: new Date(2024, 0, 1, 18, 0, 0)},
    {label: '19:00', value: new Date(2024, 0, 1, 19, 0, 0)},
    {label: '20:00', value: new Date(2024, 0, 1, 20, 0, 0)},
    {label: '21:00', value: new Date(2024, 0, 1, 21, 0, 0)},
    {label: '22:00', value: new Date(2024, 0, 1, 22, 0, 0)},
  ];

  constructor(private reservationService: ReservationsService, private snackBar: MatSnackBar, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.subscriptions.push(this.userService.getUserDetails().subscribe(data => {
      this.first = new FormGroup({
        lastname: new FormControl(data[0].name.lastname, Validators.required),
        firstname: new FormControl(data[0].name.firstname, Validators.required),
        phone: new FormControl(data[0].phone, Validators.required),
        email: new FormControl(data[0].email, [Validators.required, Validators.email])
      });
      this.isLoading = false;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  nop = new FormGroup({
    nop: new FormControl('', Validators.required)
  });
  
  second = new FormGroup({
    datePicker: new FormControl('', Validators.required),
    timePicker: new FormControl('', Validators.required)
  });

  async storeReservation(): Promise<void>{
    if(this.first.invalid){
        this.stepper.selectedIndex = 0;
        this.first.markAllAsTouched();
        this.snackBar.open('Hiányzó mező, a foglaló adatai között', 'OK',{
          duration: 3000
        });
        return;
      }
      if(this.nop.invalid){
        this.stepper.selectedIndex = 1;
        this.first.markAllAsTouched();
        this.snackBar.open('Hiányzó mező, a létszám adatai között', 'OK',{
          duration: 3000
        });
        return;
      }
      if(this.second.invalid){
        this.stepper.selectedIndex = 2;
        this.second.markAllAsTouched();
        this.snackBar.open('Hiányzó mező, az időpontválasztásnál', 'OK',{
          duration: 3000
        });
        return;
      }
    const date: string | null = this.second.get('datePicker')?.value ?? null;
    const time: string | null = this.second.get('timePicker')?.value ?? null;
    if (!date || !time) {
      console.error("Dátum vagy idő nincs megadva");
      return;
    }
    const reservation: Reservations = {
      id: '',
      uid: '',
      nop: parseInt(this.nop.get('nop')?.value || ''),
      phone: this.first.get('phone')?.value || '',
      email: this.first.get('email')?.value || '',
      name: {
        lastname: this.first.get('lastname')?.value || '',
        firstname: this.first.get('firstname')?.value || ''
      },
      date: this.combinedDateTime(date, time)
    };
    await this.reservationService.addItem(reservation).then(() => {
      this.snackBar.open('Sikeres foglalás!', 'OK', {
        duration: 3000
      });
      this.router.navigateByUrl('/');
    }).catch(() =>{
      this.snackBar.open('Hiba történt a foglalás során!', 'Bezárás', {
        duration: 3000
      });
      this.router.navigateByUrl('/reservation');
    });
  }


  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      for (let d of this.highlightDates) {
        if (
          d.getFullYear() === cellDate.getFullYear() &&
          d.getMonth() === cellDate.getMonth() &&
          d.getDate() === cellDate.getDate()
        ) {
          return 'foglalt';
        }
      }
    }
    return '';
  };

  myDateFilter = (date: Date | null): boolean => {
    if (!date) return false;
  
    return !this.highlightDates.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };

  private combinedDateTime(date: string, time: string): Date{
    const timein: Date = new Date(time);
    const combined = new Date(date);
    combined.setHours(timein.getHours());
    combined.setMinutes(timein.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  }
}
