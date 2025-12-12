export type ChildId = 'Liam' | 'Maya' | 'Milo';

export type Category = 'Deporte' | 'Médico' | 'Escuela' | 'Otro';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    startDate: Date; // In Firestore this will be a Timestamp, handled by converter
    endDate: Date;
    category: Category;
    assignedTo: ChildId;
    createdAt?: Date;
}

export const CHILDREN: { id: ChildId; name: string; color: string; darkColor: string; dotColor: string }[] = [
    { id: 'Liam', name: 'Liam', color: 'bg-sky-100 text-sky-700', darkColor: 'dark:bg-sky-900/40 dark:text-sky-300', dotColor: 'bg-sky-500' },
    { id: 'Maya', name: 'Maya', color: 'bg-purple-100 text-purple-700', darkColor: 'dark:bg-purple-900/40 dark:text-purple-300', dotColor: 'bg-purple-500' },
    { id: 'Milo', name: 'Milo', color: 'bg-emerald-100 text-emerald-700', darkColor: 'dark:bg-emerald-900/40 dark:text-emerald-300', dotColor: 'bg-emerald-500' },
];

export const CATEGORIES: Category[] = ['Deporte', 'Médico', 'Escuela', 'Otro'];
