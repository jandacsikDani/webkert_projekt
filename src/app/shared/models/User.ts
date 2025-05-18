import { FirestoreDataConverter } from "@angular/fire/firestore";

export interface User{
    id: string;
    name: {
        firstname: string;
        lastname: string;
    };
    email: string;
    phone: string;
    role: string;
}

export const userConverter: FirestoreDataConverter<User> = {
    toFirestore(user: User){
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            role: user.role
        };
    },
    fromFirestore(snapshot, options): User{
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            email: data['email'],
            name: {
                firstname: data['name']?.firstname,
                lastname: data['name']?.lastname
            },
            phone: data['phone'],
            role: data['role']
        };
    }
}