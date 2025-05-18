import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../shared/services/message/message.service';
import { Message } from '../../shared/models/Message';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contact = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required)
  });

  constructor(private service: MessageService, private snackBar: MatSnackBar) {}

  async sendMessage(): Promise<void>{
    if(this.contact.invalid) return;
    const message: Message = {
      id: '',
      name: this.contact.get('name')?.value || '',
      email: this.contact.get('email')?.value || '',
      phone: this.contact.get('phone')?.value || '',
      message: this.contact.get('message')?.value || '',
      isRead: false,
      date: new Date()
    };
    await this.service.sendMessage(message).then(() => {
      this.contact.reset();
      this.snackBar.open('Az üzenet sikeresen elküldve!', 'OK', {
        duration: 3000
      });
    }).catch(() => {
      this.snackBar.open('Az üzenetlüldés sikeretelen, próbáld újra később!', 'OK', {
        duration: 3000
      });
    });
  }
}
