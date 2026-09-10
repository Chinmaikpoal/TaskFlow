import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

// Initial seed tasks for fresh users
const INITIAL_TASKS = [
  {
    id: 'seed-1',
    title: 'Finalize Phase 1 Requirement Analysis',
    description: 'Review project guidelines, establish wireframes, and document the architectural plan.',
    priority: 'High',
    dueDate: '2026-09-10',
    completed: true,
    createdAt: new Date('2026-09-08').toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Configure React & Vite Architecture',
    description: 'Initialize reusable component structure without placing the entire app in App.jsx.',
    priority: 'High',
    dueDate: '2026-09-12',
    completed: true,
    createdAt: new Date('2026-09-08').toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Implement Task CRUD & Form Validation',
    description: 'Provide Add, Edit, Delete (with modal confirmation), and Complete/Restore actions.',
    priority: 'High',
    dueDate: '2026-09-15',
    completed: false,
    createdAt: new Date('2026-09-09').toISOString(),
  },
  {
    id: 'seed-4',
    title: 'State Management & LocalStorage Persistence',
    description: 'Ensure task data persists across page refreshes and updates dashboard statistics.',
    priority: 'Medium',
    dueDate: '2026-09-18',
    completed: false,
    createdAt: new Date('2026-09-09').toISOString(),
  },
  {
    id: 'seed-5',
    title: 'Cross-Device Responsiveness & A11y Audit',
    description: 'Test layout on desktop, tablet, and mobile views to ensure seamless usability.',
    priority: 'Low',
    dueDate: '2026-09-22',
    completed: false,
    createdAt: new Date('2026-09-09').toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'taskflow_phase1_tasks';

export default function App() {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Load tasks from LocalStorage or seed defaults
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('Failed to parse tasks from localStorage:', err);
    }
    return INITIAL_TASKS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // ---------------------------------------------------------------------------
  // 2. LOCAL STORAGE PERSISTENCE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }, [tasks]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // ---------------------------------------------------------------------------
  // 3. CRUD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      // EDIT EXISTING TASK
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...taskData,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      showToast('Task updated successfully!', 'success');
    } else {
      // ADD NEW TASK
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task created successfully!', 'success');
    }

    handleCloseFormModal();
  };

  // COMPLETE / RESTORE
  const handleToggleComplete = (taskId) => {
    let newStatus = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          newStatus = !t.completed;
          return {
            ...t,
            completed: newStatus,
            completedAt: newStatus ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );

    if (newStatus) {
      showToast('Task completed! Great job! 🎉', 'success');
    } else {
      showToast('Task restored to Pending.', 'info');
    }
  };

  // DELETE WITH CONFIRMATION
  const handleDeleteRequest = (task) => {
    setDeleteConfirmTask(task);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmTask.id));
    showToast(`"${deleteConfirmTask.title}" has been deleted.`, 'danger');
    setDeleteConfirmTask(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmTask(null);
  };

  // RESET FILTERS
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  // ---------------------------------------------------------------------------
  // 4. COMPUTED METRICS & FILTERING (Memoized)
  // ---------------------------------------------------------------------------
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;
    const highPriority = tasks.filter((t) => t.priority === 'High').length;
    return { total, pending, completed, highPriority };
  }, [tasks]);

  const filterCounts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
      high: tasks.filter((t) => t.priority === 'High').length,
      medium: tasks.filter((t) => t.priority === 'Medium').length,
      low: tasks.filter((t) => t.priority === 'Low').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Priority/Status Filter
      if (activeFilter === 'pending' && task.completed) return false;
      if (activeFilter === 'completed' && !task.completed) return false;
      if (activeFilter === 'high' && task.priority !== 'High') return false;
      if (activeFilter === 'medium' && task.priority !== 'Medium') return false;
      if (activeFilter === 'low' && task.priority !== 'Low') return false;

      // 2. Search Query (matches Title or Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descMatch;
      }

      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== '' || activeFilter !== 'all';

  // ---------------------------------------------------------------------------
  // 5. RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="app-wrapper">
      {/* Header */}
      <Header onOpenAddModal={handleOpenAddModal} />

      {/* Main Container */}
      <main className="main-content">
        {/* Dashboard Statistics */}
        <Dashboard stats={stats} onSelectFilter={(filterKey) => setActiveFilter(filterKey)} />

        {/* Search and Filters Section */}
        <section className="controls-section" aria-label="Search and Filter Controls">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* Task List / Cards */}
        <TaskList
          tasks={filteredTasks}
          totalTaskCount={tasks.length}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteRequest}
          onOpenAddModal={handleOpenAddModal}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Add / Edit Task Modal Form */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmTask && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelDelete();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="delete-modal-body">
              <div className="delete-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </div>
              <h3 id="delete-dialog-title" className="delete-title">
                Delete Task?
              </h3>
              <p className="delete-description">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="delete-task-preview">
                "{deleteConfirmTask.title}"
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                autoFocus
              >
                Yes, Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback Notification */}
      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast-message ${toast.type}`}>
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            )}
            {toast.type === 'danger' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
