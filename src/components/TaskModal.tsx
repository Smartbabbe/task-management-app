import { useState, useEffect } from 'react'
import { Task, Status, Priority, COLUMNS, PRIORITY_CONFIG } from '../types'
import { useTask } from '../context/TaskContext'

interface TaskModalProps {
  task: Task | null
  isNew?: boolean
  onClose: () => void
}

const emptyTask = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  status: 'todo' as Status,
  dueDate: '',
  tags: [] as string[],
}

export default function TaskModal({ task, isNew, onClose }: TaskModalProps) {
  const { addTask, updateTask } = useTask()
  const [form, setForm] = useState(task || emptyTask)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    setForm(task || emptyTask)
  }, [task])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = () => {
    if (!form.title.trim()) return
    if (isNew) {
      addTask(form)
    } else if (task) {
      updateTask(task.id, form)
    }
    onClose()
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">

        {/* Colorful top bar */}
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans font-bold text-lg text-gray-800 dark:text-gray-100">
              {isNew ? '✨ New Task' : '✏️ Edit Task'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add more details..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none transition-all resize-none"
              />
            </div>

            {/* Priority + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map(p => {
                    const cfg = PRIORITY_CONFIG[p]
                    return (
                      <button
                        key={p}
                        onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                          form.priority === p ? cfg.bg + ' ring-2 ring-offset-1' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-purple-400 rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none"
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id}>{col.emoji} {col.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-purple-400 rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none transition-all"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-purple-400 rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none transition-all"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-sans text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans text-sm font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
            >
              {isNew ? '✨ Create Task' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
