import { FirestoreDataConverter } from "@angular/fire/firestore";

export interface Reservations{
    id: string;
    uid: string;
    nop: number;
    phone: number;
    email: string;
    name: {
        lastname: string;
        firstname: string;
    }
    date: Date;
}

export const reservationConverter: FirestoreDataConverter<Reservations> = {
    toFirestore(reservation: Reservations){
        return {
            uid: reservation.uid,
            nop: reservation.nop,
            phone: reservation.phone,
            email: reservation.email,
            name: reservation.name,
            date: reservation instanceof Date ? reservation.date : new Date(reservation.date)
        };
    },
    fromFirestore(snapshot, options): Reservations {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            uid: data['uid'],
            nop: data['nop'],
            phone: data['phone'],
            email: data['email'],
            name: {
                lastname: data['name']?.lastname,
                firstname: data['name']?.firstname
            },
            date: data['date']?.toDate ? data['date'].toDate() : data['date']
        };
    }
}