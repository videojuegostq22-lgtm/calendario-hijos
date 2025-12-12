import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { EventModal } from './components/EventModal';
import { CalendarEvent } from './types';

function App() {
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const handleOpenModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            <Sidebar
                selectedChild={selectedChild}
                onSelectChild={setSelectedChild}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Calendario</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {selectedChild ? `Actividades de ${selectedChild}` : 'Todas las actividades familiares'}
                            </p>
                        </div>

                        <button
                            onClick={handleOpenModal}
                            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            + Nuevo Evento
                        </button>
                    </header>

                    <CalendarView
                        selectedChild={selectedChild}
                        onEditEvent={(event) => {
                            setEditingEvent(event);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </main>

            {isModalOpen && (
                <EventModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
                    eventToEdit={editingEvent}
                />
            )}
        </div>
    )
}

export default App
