import { Task, COLUMNS, PRIORITY_CONFIG, TAG_COLORS } from '../types'
import { useTask } from '../context/TaskContext'

interface ListViewProps {
  onTaskClick: (task: Task) => void
}

export default function ListView({ onTaskClick }: ListViewProps) {
  const { filteredTasks, deleteTask, moveTask } = useTask()

  const grouped = COLUMNS.map(col => ({
    ...col,
    tasks: filteredTasks.filter(t => t.status === col.id),
  })).filter(col => col.tasks.length > 0)

  return (
    <div className="space-y-6">
      {grouped.map(col => (
        <div key={col.id}>
          {/* Group header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">{col.emoji}</span>
            <h3 className="font-sans font-semibold text-sm text-gray-700 dark:text-gray-200">{col.title}</h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span
              className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
              style={{ background: col.color }}
            >
              {col.tasks.length}
            </span>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {col.tasks.map(task => {
              const priority = PRIORITY_CONFIG[task.priority]
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
              const daysLeft = task.dueDate
                ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div
                  key={task.id}
                  className="group flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700 cursor-pointer shadow-sm hover:shadow-md transition-all"
                  onClick={() => onTaskClick(task)}
                >
                  {/* Priority dot */}
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priority.dot}`} />

                  {/* Status toggle */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const next: Record<string, string> = { todo: 'inprogress', inprogress: 'review', review: 'done', done: 'todo' }
                      moveTask(task.id, next[task.status] as any)
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.status === 'done'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                    }`}
                  >
                    {task.status === 'done' && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  {/* Title */}
                  <span className={`font-sans text-sm font-medium flex-1 min-w-0 truncate ${
                    task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'
                  }`}>
                    {task.title}
                  </span>

                  {/* Tags */}
                  <div className="hidden md:flex gap-1.5 flex-shrink-0">
                    {task.tags.slice(0, 2).map((tag, i) => (
                      <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Priority */}
                  <span className={`hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${priority.bg}`}>
                    {priority.label}
                  </span>

                  {/* Due date */}
                  {daysLeft !== null && (
                    <span className={`font-mono text-xs flex-shrink-0 ${
                      isOverdue ? 'text-red-500' :
                      daysLeft <= 2 ? 'text-orange-500' :
                      'text-gray-400 dark:text-gray-500'
                    }`}>
                      {isOverdue ? `${Math.abs(daysLeft)}d ago` :
                       daysLeft === 0 ? 'Today' :
                       `${daysLeft}d`}
                    </span>
                  )}

                  {/* Delete */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
                    className="w-6 h-6 rounded-full text-gray-300 dark:text-gray-600 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {filteredTasks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 dark:text-gray-400 font-sans">No tasks match your filters</p>
        </div>
      )}
    </div>
  )
}
