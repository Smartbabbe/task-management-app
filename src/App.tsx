import { useState } from 'react'
import { TaskProvider, useTask } from './context/TaskContext'
import { Task, PRIORITY_CONFIG } from './types'
import KanbanBoard from './components/KanbanBoard'
import ListView from './components/ListView'
import TaskModal from './components/TaskModal'

function AppContent() {
  const { filteredTasks, filter, setFilter, view, setView, dark, toggleDark, tasks } = useTask()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isNewTask, setIsNewTask] = useState(false)

  const allTags = [...new Set(tasks.flatMap(t => t.tags))].sort()

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inprogress: tasks.filter(t => t.status === 'inprogress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  }

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>

      {/* Header */}
      <header className={`sticky top-0 z-40 ${dark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md border-b ${dark ? 'border-gray-800' : 'border-gray-100'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
              T
            </div>
            <span className={`font-sans font-bold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Taskly</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={filter.search}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                placeholder="Search tasks..."
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border-2 border-transparent outline-none transition-all ${
                  dark
                    ? 'bg-gray-800 text-gray-100 placeholder-gray-500 focus:border-purple-500'
                    : 'bg-gray-100 text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className={`flex rounded-xl p-1 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setView('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === 'kanban'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                ⬛ Board
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === 'list'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                ☰ List
              </button>
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* New task */}
            <button
              onClick={() => { setSelectedTask(null); setIsNewTask(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:scale-105"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Tasks', value: stats.total, emoji: '📋', color: 'from-purple-500 to-purple-600' },
            { label: 'In Progress', value: stats.inprogress, emoji: '🔥', color: 'from-orange-400 to-orange-500' },
            { label: 'Completed', value: stats.done, emoji: '✅', color: 'from-emerald-400 to-emerald-500' },
            { label: 'Overdue', value: stats.overdue, emoji: '⚠️', color: 'from-red-400 to-red-500' },
          ].map(stat => (
            <div key={stat.label} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stat.emoji}</span>
                <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Priority filter */}
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilter({ ...filter, priority: p })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter.priority === p
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30'
                  : dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {p === 'all' ? '🌈 All' :
               p === 'high' ? '🔴 High' :
               p === 'medium' ? '🟡 Medium' : '🟢 Low'}
            </button>
          ))}

          <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Tag filters */}
          {allTags.slice(0, 6).map(tag => (
            <button
              key={tag}
              onClick={() => setFilter({ ...filter, tag: filter.tag === tag ? '' : tag })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter.tag === tag
                  ? 'bg-pink-500 text-white shadow-md'
                  : dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              # {tag}
            </button>
          ))}

          {/* Clear filters */}
          {(filter.priority !== 'all' || filter.tag || filter.search) && (
            <button
              onClick={() => setFilter({ priority: 'all', tag: '', search: '' })}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Board / List */}
        {view === 'kanban' ? (
          <KanbanBoard onTaskClick={task => { setSelectedTask(task); setIsNewTask(false) }} />
        ) : (
          <ListView onTaskClick={task => { setSelectedTask(task); setIsNewTask(false) }} />
        )}
      </main>

      {/* Task Modal */}
      {(selectedTask || isNewTask) && (
        <TaskModal
          task={selectedTask}
          isNew={isNewTask}
          onClose={() => { setSelectedTask(null); setIsNewTask(false) }}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
}
