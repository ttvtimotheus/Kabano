import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IconPlus } from '@tabler/icons-react';
import { Column } from '../Column/Column';
import { TaskModal } from '../TaskModal/TaskModal';
import { Board as BoardType, Task } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import './Board.scss';

interface BoardProps {
  board: BoardType;
}

export const Board: React.FC<BoardProps> = ({ board }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { activeBoard, addTask, updateTask, moveTask, updateColumn } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumnIndex = board.columns.findIndex(
      (col) => col.id === activeId
    );
    const overColumnIndex = board.columns.findIndex((col) => col.id === overId);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      // Handle column reordering
      const newColumns = arrayMove(
        board.columns,
        activeColumnIndex,
        overColumnIndex
      );
      // Update column order
      newColumns.forEach((column, index) => {
        updateColumn(board.id, column.id, column.title);
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = board.columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === activeId);

    const overColumn = board.columns.find((col) => col.id === overId);

    if (activeTask && overColumn) {
      const activeColumn = board.columns.find((col) =>
        col.tasks.some((task) => task.id === activeTask.id)
      );
      if (activeColumn) {
        moveTask(board.id, activeColumn.id, overColumn.id, activeTask.id, overColumn.tasks.length);
      }
    }
  };

  const handleAddTask = (columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (board.id) {
      addTask(board.id, columnId, taskData);
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      const column = board.columns.find((col) =>
        col.tasks.some((task) => task.id === editingTask.id)
      );
      if (column) {
        updateTask(board.id, column.id, editingTask.id, taskData);
        setEditingTask(null);
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const column = board.columns.find((col) =>
      col.tasks.some((task) => task.id === taskId)
    );
    if (column) {
      // Implement task deletion
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="board">
        <SortableContext
          items={board.columns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="columns">
            {board.columns.map((column, index) => (
              <Column
                key={column.id}
                boardId={board.id}
                column={column}
                index={index}
                onAddTask={handleAddTask}
                onEditTask={handleTaskClick}
                onDeleteTask={handleDeleteTask}
              />
            ))}
            <button className="add-column-button">
              <IconPlus size={16} />
              Add Column
            </button>
          </div>
        </SortableContext>
      </div>

      {editingTask && (
        <TaskModal
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
          initialTask={editingTask}
        />
      )}
    </DndContext>
  );
};
