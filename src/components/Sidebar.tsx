import { Users, Calendar as CalendarIcon, X } from 'lucide-react';
import { CHILDREN } from '../types';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
    selectedChild: string | null;
    onSelectChild: (childId: string | null) => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export function Sidebar({ selectedChild, onSelectChild, isMobileOpen, onCloseMobile }: SidebarProps) {
    return (
        <>
            {/* Sidebar Container: Fixed OFF-CANVAS on mobile, Relative on desktop */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:inset-auto",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <CalendarIcon className="text-white" size={24} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">FamilySync</h1>
                        </div>
                        {/* Close button mobile only */}
                        <button
                            onClick={onCloseMobile}
                            className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
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
                            <span className="font-medium">Ver Todos</span>
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
                                    {/* Always show text on drawer */}
                                    <span className="font-medium">{child.name}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                        <ThemeToggle />
                    </div>
                </div>
            </aside>
        </>
    );
}
