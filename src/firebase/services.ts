import {
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions
} from 'firebase/firestore';
import { db } from './config';
import { CalendarEvent, ChildId, Category } from '../types';
import { useState, useEffect } from 'react';

// Custom Type for writing to Firestore (no ID)
interface FirestoreEvent extends Omit<CalendarEvent, 'id' | 'startDate' | 'endDate' | 'createdAt'> {
    startDate: Timestamp;
    endDate: Timestamp;
    createdAt: Timestamp;
}

const eventConverter: FirestoreDataConverter<CalendarEvent> = {
    toFirestore(event: CalendarEvent): FirestoreEvent {
        // Only used if setDoc is used with a full object including ID, which we rarely do here.
        // For addDoc, we typically pass the data directly.
        return {
            title: event.title,
            description: event.description,
            category: event.category,
            assignedTo: event.assignedTo,
            startDate: Timestamp.fromDate(event.startDate),
            endDate: Timestamp.fromDate(event.endDate),
            createdAt: event.createdAt ? Timestamp.fromDate(event.createdAt) : Timestamp.now(),
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): CalendarEvent {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            title: data.title,
            description: data.description || '',
            category: data.category as Category,
            assignedTo: data.assignedTo as ChildId,
            startDate: data.startDate?.toDate() || new Date(),
            endDate: data.endDate?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate(),
        };
    }
};

export function useEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'events').withConverter(eventConverter),
            orderBy('startDate', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newEvents = snapshot.docs.map(doc => doc.data());
            setEvents(newEvents);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching events:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { events, loading };
}

export async function addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>) {
    const col = collection(db, 'events');
    // Manual conversion for write
    const firestoreData = {
        ...event,
        startDate: Timestamp.fromDate(event.startDate),
        endDate: Timestamp.fromDate(event.endDate),
        createdAt: Timestamp.now(),
    };
    return addDoc(col, firestoreData);
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>) {
    const docRef = doc(db, 'events', id);
    const data: any = { ...updates };
    // Convert dates if they exist in updates
    if (data.startDate instanceof Date) data.startDate = Timestamp.fromDate(data.startDate);
    if (data.endDate instanceof Date) data.endDate = Timestamp.fromDate(data.endDate);

    delete data.id; // Ensure ID is not written
    delete data.createdAt; // Ensure created at is not overwritten (optional)

    return updateDoc(docRef, data);
}

export async function deleteEvent(id: string) {
    return deleteDoc(doc(db, 'events', id));
}
