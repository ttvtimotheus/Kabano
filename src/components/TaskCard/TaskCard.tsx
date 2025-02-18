import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Task } from '../../types';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {task.dueDate && (
          <div className="task-due-date">Due: {task.dueDate}</div>
        )}
        {task.assignee && (
          <div className="task-assignee">Assigned to: {task.assignee}</div>
        )}
        {task.labels && task.labels.length > 0 && (
          <div className="task-labels">
            {task.labels.map((label) => (
              <span key={label} className="label">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button className="icon-button" onClick={onEdit}>
          <IconPencil size={16} />
        </button>
        <button className="icon-button danger" onClick={onDelete}>
          <IconTrash size={16} />
        </button>
      </div>
    </div>
  );
};
