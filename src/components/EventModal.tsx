import { useState, useEffect } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { CalendarEvent, CHILDREN, CATEGORIES, Category, ChildId } from '../types';
import { addEvent, updateEvent, deleteEvent } from '../firebase/services';
import { cn } from '../utils/cn';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventToEdit: CalendarEvent | null;
}

export function EventModal({ isOpen, onClose, eventToEdit }: EventModalProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState(''); // New field (visual only for now/description)
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [category, setCategory] = useState<Category>('Otro');
    const [assignedTo, setAssignedTo] = useState<ChildId>('Liam');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDescription(eventToEdit.description);
            // Format: YYYY-MM-DDThh:mm
            const startStr = new Date(eventToEdit.startDate.getTime() - (eventToEdit.startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            const endStr = new Date(eventToEdit.endDate.getTime() - (eventToEdit.endDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

            setStartDate(startStr);
            setEndDate(endStr);
            setCategory(eventToEdit.category);
            setAssignedTo(eventToEdit.assignedTo);
            // Deduce location/allDay if we stored them, otherwise mock defaults
        } else {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setStartDate(now.toISOString().slice(0, 16));

            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            setEndDate(oneHourLater.toISOString().slice(0, 16));

            setTitle('');
            setDescription('');
            setLocation('');
            setCategory('Otro');
            setAssignedTo('Liam');
            setIsAllDay(false);
        }
    }, [eventToEdit, isOpen]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const finalDescription = location ? `${description}\n📍 ${location}`.trim() : description;

            const eventData = {
                title: title || 'Nuevo Evento',
                description: finalDescription,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                category,
                assignedTo,
            };

            if (eventToEdit) {
                await updateEvent(eventToEdit.id, eventData);
            } else {
                await addEvent(eventData);
            }
            onClose();
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Error al guardar el evento");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!eventToEdit || !confirm("¿Eliminar este evento?")) return;
        setLoading(true);
        try {
            await deleteEvent(eventToEdit.id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper renderers
    const renderDateRow = (label: string, value: string, setValue: (v: string) => void) => (
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50 last:border-0">
            <span className="text-white text-base">{label}</span>
            <div className="relative">
                <input
                    type="datetime-local"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="bg-zinc-700 text-white rounded-lg px-2 py-1 text-sm border-none focus:ring-1 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-black sm:bg-zinc-950 w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-md sm:rounded-[2rem] flex flex-col overflow-hidden sm:shadow-2xl sm:border border-zinc-800">

                {/* Header (iOS Style) */}
                <div className="flex items-center justify-between px-4 py-4 bg-black/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
                    <button
                        onClick={onClose}
                        className="text-indigo-500 text-base font-medium px-2 py-1 hover:opacity-80 transition-opacity"
                    >
                        Cancelar
                    </button>
                    <h3 className="text-white font-bold text-lg">
                        {eventToEdit ? 'Editar Evento' : 'Nuevo Evento'}
                    </h3>
                    <button
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="text-indigo-500 text-lg font-bold px-2 py-1 hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                        {loading ? '...' : 'Añadir'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6 custom-scrollbar bg-black text-white">

                    {/* Title & Location Group */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden mt-2">
                        <div className="p-3 border-b border-gray-800">
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Título"
                                className="w-full bg-transparent text-white placeholder-gray-500 text-lg outline-none border-none"
                            />
                        </div>
                        <div className="p-3 flex items-center gap-2">
                            <MapPin size={18} className="text-gray-500" />
                            <input
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="Ubicación"
                                className="w-full bg-transparent text-white placeholder-gray-500 text-base outline-none border-none"
                            />
                        </div>
                    </div>

                    {/* Time Group */}
                    <div className="bg-zinc-900 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-3 border-b border-gray-800">
                            <span className="text-white text-base">Todo el día</span>
                            <button
                                onClick={() => setIsAllDay(!isAllDay)}
                                className={cn(
                                    "w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative",
                                    isAllDay ? "bg-green-500" : "bg-gray-600"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
                                    isAllDay ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                        {renderDateRow("Empieza", startDate, setStartDate)}
                        {renderDateRow("Termina", endDate, setEndDate)}
                        <div className="flex items-center justify-between p-3 text-white">
                            <span>Repetir</span>
                            <div className="flex items-center gap-1 text-gray-500">
                                <span className="text-sm">Nunca</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Assigned To (Avatars) */}
                    <div>
                        <label className="text-gray-500 text-xs font-semibold uppercase ml-3 mb-2 block">Para Quién</label>
                        <div className="bg-zinc-900 rounded-xl p-4 flex justify-between items-center overflow-x-auto gap-4 custom-scrollbar">
                            {CHILDREN.map(child => {
                                const isSelected = assignedTo === child.id;
                                return (
                                    <button
                                        key={child.id}
                                        type="button"
                                        onClick={() => setAssignedTo(child.id)}
                                        className="flex flex-col items-center gap-2 min-w-[64px] group"
                                    >
                                        <div className={cn(
                                            "w-16 h-16 rounded-full flex items-center justify-center relative transition-all border-2",
                                            isSelected ? "border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20" : "border-transparent opacity-60 group-hover:opacity-80"
                                        )}>
                                            {/* Avatar Image Placeholder or Initials if no image */}
                                            {child.avatar ? (
                                                // Using a gradient placeholder if image fails or just styles
                                                <div className={cn(
                                                    "w-full h-full rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden bg-cover bg-center",
                                                    child.color,
                                                    child.darkColor
                                                )}>
                                                    {/* Ideally we use <img src={child.avatar} /> but since they don't exist, we use colored initials which looks good too */}
                                                    {child.name.substring(0, 1)}
                                                </div>
                                            ) : (
                                                <div className={cn("w-full h-full rounded-full", child.color)} />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium transition-colors",
                                            isSelected ? "text-indigo-400" : "text-gray-500"
                                        )}>
                                            {child.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-gray-500 text-xs font-semibold uppercase ml-3 mb-2 block">Categoría</label>
                        <div className="bg-zinc-900 rounded-xl overflow-hidden">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 border-b border-gray-800 last:border-0 hover:bg-zinc-800 transition-colors",
                                        category === cat ? "text-indigo-400" : "text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            category === cat ? "bg-indigo-500" : "bg-gray-600"
                                        )} />
                                        <span>{cat}</span>
                                    </div>
                                    {category === cat && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-500 text-xs font-semibold uppercase ml-3 mb-2 block">Notas</label>
                        <div className="bg-zinc-900 rounded-xl overflow-hidden p-3">
                            <textarea
                                rows={4}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-transparent text-white text-base resize-none focus:outline-none placeholder-gray-600"
                                placeholder="Escribe notas adicionales..."
                            />
                        </div>
                    </div>

                    {/* Delete Button */}
                    {eventToEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-3.5 rounded-xl bg-zinc-900 text-red-500 font-medium hover:bg-red-900/10 transition-colors border border-zinc-800"
                        >
                            Eliminar Evento
                        </button>
                    )}

                    <div className="h-4" /> {/* Spacer */}

                </div>
            </div>
        </div>
    )
}
