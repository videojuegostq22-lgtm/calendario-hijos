import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, AlignLeft, Tag, User } from 'lucide-react';
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
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState<Category>('Otro');
    const [assignedTo, setAssignedTo] = useState<ChildId>('Liam');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDescription(eventToEdit.description);
            // Format for datetime-local: YYYY-MM-DDThh:mm
            setStartDate(new Date(eventToEdit.startDate.getTime() - (eventToEdit.startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
            setEndDate(new Date(eventToEdit.endDate.getTime() - (eventToEdit.endDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16));
            setCategory(eventToEdit.category);
            setAssignedTo(eventToEdit.assignedTo);
        } else {
            // Defaults
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setStartDate(now.toISOString().slice(0, 16));

            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
            setEndDate(oneHourLater.toISOString().slice(0, 16));

            setTitle('');
            setDescription('');
            setCategory('Otro');
            setAssignedTo('Liam');
        }
    }, [eventToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const eventData = {
                title,
                description,
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
        if (!eventToEdit || !confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
        setLoading(true);
        try {
            await deleteEvent(eventToEdit.id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Error al eliminar");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {eventToEdit ? 'Editar Evento' : 'Nuevo Evento'}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Título</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ej. Partido de Fútbol"
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-lg placeholder:text-gray-400"
                        />
                    </div>

                    {/* Assigned To */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                            <User size={16} /> Asignado a
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {CHILDREN.map(child => (
                                <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => setAssignedTo(child.id)}
                                    className={cn(
                                        "p-3 rounded-xl flex items-center justify-center gap-2 transition-all border-2",
                                        assignedTo === child.id
                                            ? cn("border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20", "text-indigo-700 dark:text-indigo-300")
                                            : "border-transparent bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400"
                                    )}
                                >
                                    <div className={cn("w-2 h-2 rounded-full", child.dotColor)} />
                                    <span className="font-medium">{child.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                                <Calendar size={16} /> Inicio
                            </label>
                            <input
                                required
                                type="datetime-local"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white accent-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                                <Clock size={16} /> Fin
                            </label>
                            <input
                                required
                                type="datetime-local"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white accent-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                            <Tag size={16} /> Categoría
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                        category === cat
                                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                                            : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
                            <AlignLeft size={16} /> Descripción
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none placeholder:text-gray-400"
                            placeholder="Detalles adicionales..."
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                        {eventToEdit && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="p-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 size={24} />
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "flex-1 py-4 px-6 rounded-2xl font-bold shadow-lg transition-all active:scale-95 text-white bg-indigo-600 hover:bg-indigo-700",
                                loading && "opacity-70 cursor-not-allowed",
                                !eventToEdit && "w-full"
                            )}
                        >
                            {loading ? 'Guardando...' : (eventToEdit ? 'Guardar Cambios' : 'Crear Evento')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
