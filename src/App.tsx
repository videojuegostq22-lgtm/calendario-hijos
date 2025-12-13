import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { EventModal } from './components/EventModal';
import { CalendarEvent } from './types';
import { Menu } from 'lucide-react';

function App() {
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    const handleOpenModal = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-20">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -ml-2 text-gray-700 dark:text-gray-200"
                >
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg">FamilySync</span>
                <div className="w-8" /> {/* Spacer for balance */}
            </div>

            <Sidebar
                selectedChild={selectedChild}
                onSelectChild={(id) => {
                    setSelectedChild(id);
                    setIsMobileMenuOpen(false);
                }}
                isMobileOpen={isMobileMenuOpen}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
            />

            {/* Overlay for mobile sidebar */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
                    <header className="hidden md:flex mb-6 flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Calendario</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {selectedChild ? `Actividades de ${selectedChild}` : 'Todas las actividades familiares'}
                            </p>
                        </div>

                        <button
                            onClick={handleOpenModal}
                            className="bg-gray-900 dark:bg-indigo-600 text-white dark:text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all active:scale-95 hover:bg-gray-800 dark:hover:bg-indigo-500"
                        >
                            + Nuevo Evento
                        </button>
                    </header>

                    <div className="flex-1 min-h-0">
                        <CalendarView
                            selectedChild={selectedChild}
                            onEditEvent={(event) => {
                                setEditingEvent(event);
                                setIsModalOpen(true);
                            }}
                        />
                    </div>
                </div>
            </main>

            {/* Floating Action Button for Mobile/Quick Access */}
            <button
                onClick={handleOpenModal}
                className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gray-900 dark:bg-zinc-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-90 z-40 border border-transparent dark:border-zinc-600"
                aria-label="Nuevo Evento"
            >
                <span className="text-3xl font-light mb-1">+</span>
            </button>

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
