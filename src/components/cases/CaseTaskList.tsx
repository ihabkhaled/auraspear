'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { CaseTaskStatus } from '@/enums'
import type { CaseTask } from '@/types'

interface CaseTaskListProps {
  tasks: CaseTask[]
  onToggleTask?: (taskId: string, completed: boolean) => void
  onAddTask?: (title: string) => void
  onDeleteTask?: (taskId: string) => void
  addingTask?: boolean
}

export function CaseTaskList({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  addingTask,
}: CaseTaskListProps) {
  const t = useTranslations('cases')
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const completedCount = tasks.filter(task => task.status === CaseTaskStatus.COMPLETED).length
  const totalCount = tasks.length
  const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim()
    if (trimmed && onAddTask) {
      onAddTask(trimmed)
      setNewTaskTitle('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t('tasksCompleted', { completed: completedCount, total: totalCount })}
          </span>
          <span className="text-muted-foreground font-mono text-xs">
            {Math.round(progressValue)}%
          </span>
        </div>
        <Progress value={progressValue} />
      </div>

      {onAddTask && (
        <div className="flex items-center gap-2">
          <Input
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('addTaskPlaceholder')}
            className="h-8 text-sm"
            disabled={addingTask}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim() || addingTask}
          >
            <Plus className="h-3.5 w-3.5" />
            {t('addTask')}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tasks.map(task => {
          const isCompleted = task.status === CaseTaskStatus.COMPLETED

          return (
            <label
              key={task.id}
              className="border-border hover:bg-muted/50 group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={checked => {
                  onToggleTask?.(task.id, Boolean(checked))
                }}
              />
              <div className="flex flex-1 items-center justify-between gap-2">
                <span
                  className={isCompleted ? 'text-muted-foreground text-sm line-through' : 'text-sm'}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-1">
                  {task.assignee && (
                    <span className="text-muted-foreground text-xs">{task.assignee}</span>
                  )}
                  {onDeleteTask && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDeleteTask(task.id)
                      }}
                      title={t('delete')}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </label>
          )
        })}

        {tasks.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">{t('noTasks')}</p>
        )}
      </div>
    </div>
  )
}
