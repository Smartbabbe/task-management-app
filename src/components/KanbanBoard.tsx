import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { COLUMNS, Task, Status } from '../types'
import { useTask } from '../context/TaskContext'
import TaskCard from './TaskCard'

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void
}

export default function KanbanBoard({ onTaskClick }: KanbanBoardProps) {
  const { filteredTasks, moveTask } = useTask()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const onDragEnd = (result: DropResult) => {
    setDraggingId(null)
    if (!result.destination) return
    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as Status
    moveTask(taskId, newStatus)
  }

  const onDragStart = (start: any) => {
    setDraggingId(start.draggableId)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id)
          return (
            <div key={col.id} className="flex flex-col min-h-[400px]">
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{col.emoji}</span>
                  <h3 className="font-sans font-semibold text-sm text-gray-700 dark:text-gray-200">
                    {col.title}
                  </h3>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: col.color }}
                  >
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-2xl p-2 space-y-2 transition-colors min-h-[200px] ${
                      snapshot.isDraggingOver
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-dashed border-purple-300 dark:border-purple-600'
                        : 'bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent'
                    }`}
                  >
                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center h-32 gap-2">
                        <span className="text-2xl opacity-30">{col.emoji}</span>
                        <p className="text-xs text-gray-400 dark:text-gray-600 font-sans">Drop tasks here</p>
                      </div>
                    )}
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onClick={onTaskClick}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
