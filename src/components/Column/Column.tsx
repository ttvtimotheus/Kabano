import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconPlus, IconDots } from '@tabler/icons-react';
import { Column as ColumnType, Task } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import { TaskModal } from '../TaskModal/TaskModal';
import './Column.scss';

interface ColumnProps {
  boardId: string;
  column: ColumnType;
  index: number;
  onAddTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  boardId,
  column,
  index,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddTask(column.id, taskData);
    setIsTaskModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`column ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <div className="column-actions">
          <button
            className="icon-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <IconDots size={16} />
          </button>
          {isMenuOpen && (
            <div className="column-menu">
              <button onClick={() => setIsTaskModalOpen(true)}>
                Add Task
              </button>
              <button className="danger">Delete Column</button>
            </div>
          )}
        </div>
      </div>

      <div className="task-list">
        {column.tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>

      <button
        className="add-task-button"
        onClick={() => setIsTaskModalOpen(true)}
      >
        <IconPlus size={16} />
        Add Task
      </button>

      {isTaskModalOpen && (
        <TaskModal
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleAddTask}
        />
      )}
    </div>
  );
};
