import { Users, Calendar as CalendarIcon } from 'lucide-react';
import { CHILDREN } from '../types';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
    selectedChild: string | null;
    onSelectChild: (childId: string | null) => void;
}

export function Sidebar({ selectedChild, onSelectChild }: SidebarProps) {
    return (
        <aside className="w-20 md:w-64 h-full flex flex-col justify-between border-r border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl transition-all">
            <div className="p-4 md:p-6 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <CalendarIcon className="text-white" size={24} />
                    </div>
                    <h1 className="hidden md:block text-xl font-bold text-gray-900 dark:text-white tracking-tight">FamilySync</h1>
                </div>

                <nav className="space-y-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:block px-2">
                        Filtros
                    </div>

                    <button
                        onClick={() => onSelectChild(null)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                            !selectedChild
                                ? "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                        )}
                    >
                        <Users size={20} />
                        <span className="hidden md:block font-medium">Ver Todos</span>
                    </button>

                    <div className="space-y-2">
                        {CHILDREN.map(child => (
                            <button
                                key={child.id}
                                onClick={() => onSelectChild(child.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                                    selectedChild === child.id
                                        ? cn("shadow-sm", child.color, child.darkColor)
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                <div className={cn("w-3 h-3 rounded-full", child.dotColor)} />
                                <span className="hidden md:block font-medium">{child.name}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-zinc-800">
                <ThemeToggle />
            </div>
        </aside>
    );
}
