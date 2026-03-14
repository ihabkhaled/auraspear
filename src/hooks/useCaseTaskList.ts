import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CaseTaskStatus } from '@/enums'
import type { CaseTaskListProps } from '@/types'

interface UseCaseTaskListProps {
  tasks: CaseTaskListProps['tasks']
  onAddTask?: ((title: string) => void) | undefined
}

export function useCaseTaskList({ tasks, onAddTask }: UseCaseTaskListProps) {
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

  return {
    t,
    newTaskTitle,
    setNewTaskTitle,
    completedCount,
    totalCount,
    progressValue,
    handleAddTask,
    handleKeyDown,
  }
}
