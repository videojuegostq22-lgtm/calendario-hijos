import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, isSameMonth, isSameDay,
    addMonths, subMonths, isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent, CHILDREN } from '../types';
import { useEvents } from '../firebase/services';
import { cn } from '../utils/cn';

interface CalendarViewProps {
    selectedChild: string | null;
    onEditEvent: (event: CalendarEvent) => void;
}

export function CalendarView({ selectedChild, onEditEvent }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
    const { events, loading } = useEvents();

    const filteredEvents = events.filter(e =>
        !selectedChild || e.assignedTo === selectedChild
    );

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Calendar Grid Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Week Days Header
    const weekDaysHeader = eachDayOfInterval({
        start: startOfWeek(new Date(), { locale: es }),
        end: endOfWeek(new Date(), { locale: es })
    }).map(d => format(d, 'EEE', { locale: es }));


    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col h-full overflow-hidden">

            {/* Header Controls */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all text-gray-600 dark:text-gray-300">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-all text-gray-600 dark:text-gray-300">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('month')}
                        className={cn(
                            "p-2 rounded-lg transition-all flex gap-2 items-center text-sm font-medium",
                            viewMode === 'month'
                                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <CalendarIcon size={18} />
                        <span className="hidden md:inline">Mes</span>
                    </button>
                    <button
                        onClick={() => setViewMode('agenda')}
                        className={cn(
                            "p-2 rounded-lg transition-all flex gap-2 items-center text-sm font-medium",
                            viewMode === 'agenda'
                                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        )}
                    >
                        <List size={22} />
                        <span className="hidden md:inline">Agenda</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : viewMode === 'month' ? (
                /* Month View */
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Week Header */}
                    <div className="grid grid-cols-7 mb-4">
                        {weekDaysHeader.map(day => (
                            <div key={day} className="text-center text-xs font-bold uppercase text-gray-400 tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2 md:gap-4 overflow-y-auto">
                        {calendarDays.map((day) => {
                            const dayEvents = filteredEvents.filter(e => isSameDay(e.startDate, day));
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            return (
                                <div
                                    key={day.toISOString()}
                                    className={cn(
                                        "relative p-2 rounded-2xl flex flex-col gap-1 transition-all min-h-[80px]",
                                        isCurrentMonth ? "bg-gray-50/50 dark:bg-zinc-800/20 hover:bg-gray-50 dark:hover:bg-zinc-800/40" : "opacity-30",
                                        isToday(day) && "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900"
                                    )}
                                >
                                    <span className={cn(
                                        "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                                        isToday(day) ? "bg-indigo-600 text-white" : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                        {dayEvents.map(event => {
                                            const child = CHILDREN.find(c => c.id === event.assignedTo);
                                            return (
                                                <button
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                                                    className={cn(
                                                        "w-full text-left text-xs truncate py-1.5 px-2 rounded-lg font-medium transition-transform hover:scale-[1.02]",
                                                        child?.color,
                                                        child?.darkColor
                                                    )}
                                                >
                                                    {event.title}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                /* Agenda View */
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                    {filteredEvents
                        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                        .filter(e => isSameMonth(e.startDate, currentDate))
                        .map(event => {
                            const child = CHILDREN.find(c => c.id === event.assignedTo);
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => onEditEvent(event)}
                                    className="group flex items-center gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-zinc-800/30 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-indigo-100 dark:hover:border-zinc-700"
                                >
                                    <div className={cn(
                                        "flex flex-col items-center justify-center w-16 h-16 rounded-2xl shrink-0",
                                        child?.color,
                                        child?.darkColor
                                    )}>
                                        <span className="text-xl font-bold">{format(event.startDate, 'd')}</span>
                                        <span className="text-xs uppercase font-bold opacity-70">{format(event.startDate, 'MMM')}</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">{event.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{event.description || 'Sin descripción'}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 font-medium">
                                                {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                                            </span>
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-md font-medium",
                                                child?.color,
                                                child?.darkColor
                                            )}>
                                                {child?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {filteredEvents.filter(e => isSameMonth(e.startDate, currentDate)).length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <CalendarIcon size={48} className="mb-4 opacity-20" />
                            <div className="text-center">
                                <p className="text-lg font-medium">No hay eventos</p>
                                <p className="text-sm">para {selectedChild || 'la familia'} este mes.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
