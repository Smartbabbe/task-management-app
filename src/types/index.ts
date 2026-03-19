export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'inprogress' | 'review' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string
  tags: string[]
  createdAt: string
}

export interface Column {
  id: Status
  title: string
  color: string
  emoji: string
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: '#8B5CF6', emoji: '📋' },
  { id: 'inprogress', title: 'In Progress', color: '#F97316', emoji: '🔥' },
  { id: 'review', title: 'In Review', color: '#3B82F6', emoji: '👀' },
  { id: 'done', title: 'Done', color: '#10B981', emoji: '✅' },
]

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#10B981', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
  high: { label: 'High', color: '#EF4444', bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
}

export const TAG_COLORS = [
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
]
