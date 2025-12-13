import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, isSameMonth, isSameDay,
    addMonths, subMonths, isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { CalendarEvent, CHILDREN } from '../types';
import { useEvents } from '../firebase/services';
import { cn } from '../utils/cn';

interface CalendarViewProps {
    selectedChild: string | null;
    onEditEvent: (event: CalendarEvent) => void;
}

export function CalendarView({ selectedChild, onEditEvent }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { events, loading } = useEvents();

    const filteredEvents = useMemo(() => events.filter(e =>
        !selectedChild || e.assignedTo === selectedChild
    ), [events, selectedChild]);

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Calendar Grid Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Week Days Header
    const weekDaysHeader = useMemo(() => eachDayOfInterval({
        start: startOfWeek(new Date(), { locale: es }),
        end: endOfWeek(new Date(), { locale: es })
    }).map(d => format(d, 'EEE', { locale: es })), []);

    // Events for the selected date
    const selectedDateEvents = filteredEvents
        .filter(e => isSameDay(e.startDate, selectedDate))
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden max-h-full">

            {/* Left Column: Calendar Grid */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white pl-2">
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

                {/* Week Header */}
                <div className="grid grid-cols-7 mb-2 shrink-0">
                    {weekDaysHeader.map(day => (
                        <div key={day} className="text-center text-xs font-bold uppercase text-gray-400 tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2 overflow-y-auto pr-1">
                    {calendarDays.map((day) => {
                        const dayEvents = filteredEvents.filter(e => isSameDay(e.startDate, day));
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "relative rounded-xl md:rounded-2xl p-1 transition-all flex flex-col items-center justify-start pt-2 gap-1",
                                    isCurrentMonth ? "hover:bg-gray-50 dark:hover:bg-zinc-800/50" : "opacity-30",
                                    // Removed ring/bg from generic selection on the cell
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-all",
                                    isSelected
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-110"
                                        : isToday(day)
                                            ? "text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-900/20"
                                            : "text-gray-700 dark:text-gray-300"
                                )}>
                                    {format(day, 'd')}
                                </span>

                                {/* Indicators Dots */}
                                <div className="flex gap-0.5 mt-auto mb-2 flex-wrap justify-center content-end px-1 w-full h-4">
                                    {dayEvents.slice(0, 4).map((event, i) => {
                                        const child = CHILDREN.find(c => c.id === event.assignedTo);
                                        return (
                                            <div
                                                key={i}
                                                className={cn("w-1.5 h-1.5 rounded-full", child?.dotColor)}
                                            />
                                        )
                                    })}
                                    {dayEvents.length > 4 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Column: Selected Day Agenda */}
            <div className="lg:w-[400px] flex flex-col bg-gray-50 dark:bg-zinc-900/50 rounded-[2rem] border border-gray-200 dark:border-zinc-800 lg:border-none lg:bg-transparent lg:dark:bg-transparent overflow-hidden h-[400px] lg:h-auto shrink-0 relative">
                <div className="p-6 pb-0 flex items-center justify-between mb-4 sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                            {format(selectedDate, 'EEEE, d MMM', { locale: es })}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {selectedDateEvents.length} eventos programados
                        </p>
                    </div>
                    {/* Add Event Button for Mobile context if needed here, or keep global FAB */}
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map(event => {
                            const child = CHILDREN.find(c => c.id === event.assignedTo);
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => onEditEvent(event)}
                                    className="group relative overflow-hidden bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all cursor-pointer active:scale-[0.98]"
                                >
                                    <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", child?.dotColor)} />

                                    <div className="pl-3 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base line-clamp-1">
                                                {event.title}
                                            </h4>
                                            <span className={cn(
                                                "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-opacity-10 dark:bg-opacity-20",
                                                child?.color.split(' ')[0], // Hacky way to get bg color
                                                "text-gray-600 dark:text-gray-300"
                                            )}>
                                                {child?.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>
                                                    {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                                                </span>
                                            </div>
                                            {(event.description || event.category) && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    <span className="truncate max-w-[120px]">
                                                        {event.category || 'Sin ubicación'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-zinc-600">
                            <CalendarIcon size={40} className="mb-3 opacity-20" />
                            <p className="text-sm font-medium">No hay eventos</p>
                            <p className="text-xs opacity-70">Toca '+' para añadir uno</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
