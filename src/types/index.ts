export type ChildId = 'Daura' | 'Dani' | 'Liam' | 'Maya' | 'Milo';

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

export const CHILDREN: { id: ChildId; name: string; color: string; darkColor: string; dotColor: string; avatar: string }[] = [
    { id: 'Daura', name: 'Daura', color: 'bg-rose-100 text-rose-700', darkColor: 'dark:bg-rose-500/20 dark:text-rose-200', dotColor: 'bg-rose-500', avatar: '/avatars/daura.png' },
    { id: 'Dani', name: 'Dani', color: 'bg-amber-100 text-amber-800', darkColor: 'dark:bg-amber-500/20 dark:text-amber-200', dotColor: 'bg-amber-500', avatar: '/avatars/dani.png' },
    { id: 'Liam', name: 'Liam', color: 'bg-sky-100 text-sky-700', darkColor: 'dark:bg-sky-500/20 dark:text-sky-200', dotColor: 'bg-sky-500', avatar: '/avatars/liam.png' },
    { id: 'Maya', name: 'Maya', color: 'bg-purple-100 text-purple-700', darkColor: 'dark:bg-purple-500/20 dark:text-purple-200', dotColor: 'bg-purple-500', avatar: '/avatars/maya.png' },
    { id: 'Milo', name: 'Milo', color: 'bg-emerald-100 text-emerald-700', darkColor: 'dark:bg-emerald-500/20 dark:text-emerald-200', dotColor: 'bg-emerald-500', avatar: '/avatars/milo.png' },
];

export const CATEGORIES: Category[] = ['Deporte', 'Médico', 'Escuela', 'Otro'];
