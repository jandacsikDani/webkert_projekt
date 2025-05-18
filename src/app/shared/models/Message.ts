import { FirestoreDataConverter } from "@angular/fire/firestore";

export interface Message{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    isRead: boolean;
    date: Date;
}

export const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore(message: Message){
        return {
            name: message.name,
            email: message.email,
            phone: message.phone,
            message: message.message,
            isRead: message.isRead,
            date: message instanceof Date ? message.date : new Date(message.date)
        };
    },
    fromFirestore(snapshot, options): Message {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            name: data['name'],
            email: data['email'],
            phone: data['phone'],
            message: data['message'],
            isRead: data['isRead'],
            date: data['date']?.toDate ? data['date'].toDate() : data['date']
        };
    }
}