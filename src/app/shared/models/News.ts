import { FirestoreDataConverter } from "@angular/fire/firestore";

export interface News{
    id: string;
    title: string;
    date: Date;
    desc: string;
}

export const newsConverter: FirestoreDataConverter<News> = {
    toFirestore(news: News){
        return {
            id: news.id,
            title: news.title,
            desc: news.desc,
            date: news instanceof Date ? news.date : new Date(news.date)
        };
    },
    fromFirestore(snapshot, options): News{
        const data = snapshot.data(options);
        return{
            id: snapshot.id,
            title: data['title'],
            desc: data['desc'],
            date: data['date']?.toDate ? data['date'].toDate() : data['date']
        }
    }
}