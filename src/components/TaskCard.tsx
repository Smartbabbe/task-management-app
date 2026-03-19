import { useState } from 'react'
import { Task, PRIORITY_CONFIG, TAG_COLORS } from '../types'
import { useTask } from '../context/TaskContext'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  isDragging?: boolean
}

export default function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const { deleteTask } = useTask()
  const [showDelete, setShowDelete] = useState(false)
  const priority = PRIORITY_CONFIG[task.priority]

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  const daysLeft = task.dueDate
    ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-2 cursor-pointer transition-all duration-200
        ${isDragging ? 'shadow-2xl scale-105 rotate-1 border-purple-300' : 'border-transparent hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md'}
      `}
      onClick={() => onClick(task)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* Delete button */}
      {showDelete && (
        <button
          onClick={e => { e.stopPropagation(); deleteTask(task.id) }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 text-xs"
        >
          ✕
        </button>
      )}

      {/* Priority dot + title */}
      <div className="flex items-start gap-2 mb-3 pr-6">
        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priority.dot}`} />
        <h4 className={`font-sans text-sm font-semibold leading-snug ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
          {task.title}
        </h4>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2 ml-4">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 ml-4">
          {task.tags.slice(0, 3).map((tag, i) => (
            <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between ml-4">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.bg}`}>
          {priority.label}
        </span>
        {daysLeft !== null && (
          <span className={`font-mono text-[10px] font-medium ${
            isOverdue ? 'text-red-500' :
            daysLeft <= 2 ? 'text-orange-500' :
            'text-gray-400 dark:text-gray-500'
          }`}>
            {isOverdue ? `${Math.abs(daysLeft)}d overdue` :
             daysLeft === 0 ? 'Due today' :
             `${daysLeft}d left`}
          </span>
        )}
      </div>
    </div>
  )
}
