import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Task, Status, Priority } from '../types'
import { sampleTasks } from '../data/sampleTasks'

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: Status) => void
  filter: { priority: Priority | 'all'; tag: string; search: string }
  setFilter: (filter: any) => void
  filteredTasks: Task[]
  view: 'kanban' | 'list'
  setView: (view: 'kanban' | 'list') => void
  dark: boolean
  toggleDark: () => void
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskly-tasks')
    return saved ? JSON.parse(saved) : sampleTasks
  })
  const [filter, setFilter] = useState({ priority: 'all' as Priority | 'all', tag: '', search: '' })
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('taskly-dark')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('taskly-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('taskly-dark', JSON.stringify(dark))
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setTasks(prev => [newTask, ...prev])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const moveTask = (id: string, status: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false
    if (filter.tag && !task.tags.includes(filter.tag)) return false
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const toggleDark = () => setDark((d: boolean) => !d)

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask, filter, setFilter, filteredTasks, view, setView, dark, toggleDark }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => useContext(TaskContext)
