import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import useLocalStorage from './hooks/useLocalStorage';
import { filterTasks, calculateFilterCounts } from './utils/taskFilters';
import { sortTasks } from './utils/taskSorting';

// Initial seed tasks for fresh users
const INITIAL_TASKS = [
  {
    id: 'seed-1',
    title: 'Finalize Phase 1 Requirement Analysis',
    description: 'Review project guidelines, establish wireframes, and document the architectural plan.',
    priority: 'High',
    dueDate: '2026-09-10',
    completed: true,
    createdAt: new Date('2026-09-08T09:00:00Z').toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Configure React & Vite Architecture',
    description: 'Initialize reusable component structure without placing the entire app in App.jsx.',
    priority: 'High',
    dueDate: '2026-09-12',
    completed: true,
    createdAt: new Date('2026-09-08T11:30:00Z').toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Implement Task CRUD & Form Validation',
    description: 'Provide Add, Edit, Delete (with modal confirmation), and Complete/Restore actions.',
    priority: 'High',
    dueDate: '2026-09-15',
    completed: false,
    createdAt: new Date('2026-09-09T14:00:00Z').toISOString(),
  },
  {
    id: 'seed-4',
    title: 'State Management & LocalStorage Persistence',
    description: 'Ensure task data persists across page refreshes and updates dashboard statistics.',
    priority: 'Medium',
    dueDate: '2026-09-18',
    completed: false,
    createdAt: new Date('2026-09-09T16:45:00Z').toISOString(),
  },
  {
    id: 'seed-5',
    title: 'Cross-Device Responsiveness & A11y Audit',
    description: 'Test layout on desktop, tablet, and mobile views to ensure seamless usability.',
    priority: 'Low',
    dueDate: '2026-09-22',
    completed: false,
    createdAt: new Date('2026-09-09T18:15:00Z').toISOString(),
  },
];

const LOCAL_STORAGE_KEY = 'taskflow_phase1_tasks';

export default function App() {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Load tasks using custom hook with persistent localStorage synchronization
  const [tasks, setTasks] = useLocalStorage(LOCAL_STORAGE_KEY, INITIAL_TASKS);

  // Search & Filter state (Phase 2: Status, Priority, Search, and Sort work simultaneously)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');       // 'all' | 'pending' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');   // 'all' | 'high' | 'medium' | 'low'
  const [sortBy, setSortBy] = useState('newest');               // 'newest' | 'oldest' | 'dueDate' | 'priority'

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Toast auto-dismiss after 3.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Support URL view parameter for automated visual testing and screenshots
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'add-task') {
        setIsFormOpen(true);
        setEditingTask(null);
      } else if (view === 'edit-task') {
        if (tasks && tasks.length > 0) {
          setEditingTask(tasks[0]);
          setIsFormOpen(true);
        }
      } else if (view === 'search-filter-sort') {
        setSearchQuery('Task');
        setStatusFilter('pending');
        setPriorityFilter('high');
        setSortBy('dueDate');
      } else if (view === 'empty-state') {
        setSearchQuery('NonExistentSearchMatchXYZ');
      } else if (view === 'completed-task') {
        setStatusFilter('completed');
      }
    } catch {
      // Ignore in non-browser environments
    }
  }, [tasks]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  // ---------------------------------------------------------------------------
  // 2. CRUD HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenAddModal = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleFormSubmit = useCallback((taskData) => {
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
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task created successfully!', 'success');
    }

    handleCloseFormModal();
  }, [editingTask, handleCloseFormModal, setTasks, showToast]);

  // COMPLETE / RESTORE TASK
  const handleToggleComplete = useCallback((taskId) => {
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
  }, [setTasks, showToast]);

  // DELETE WITH CONFIRMATION
  const handleDeleteRequest = useCallback((task) => {
    setDeleteConfirmTask(task);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirmTask) return;
    const title = deleteConfirmTask.title;
    setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmTask.id));
    showToast(`"${title}" has been deleted.`, 'danger');
    setDeleteConfirmTask(null);
  }, [deleteConfirmTask, setTasks, showToast]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmTask(null);
  }, []);

  // RESET FILTERS & SORT
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('newest');
  }, []);

  // DASHBOARD CARD FILTER SHORTCUT
  const handleDashboardFilter = useCallback((status, priority = 'all') => {
    setStatusFilter(status);
    setPriorityFilter(priority);
  }, []);

  // ---------------------------------------------------------------------------
  // 3. COMPUTED METRICS, FILTERING & SORTING (Optimized Memoization)
  // ---------------------------------------------------------------------------
  // Metrics for dashboard counters
  const stats = useMemo(() => {
    const total = tasks.length;
    let pending = 0;
    let completed = 0;
    let highPriority = 0;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.completed) {
        completed += 1;
      } else {
        pending += 1;
      }
      if (task.priority === 'High') {
        highPriority += 1;
      }
    }

    return { total, pending, completed, highPriority };
  }, [tasks]);

  // Dynamic filter counts for filter badges
  const filterCounts = useMemo(() => {
    return calculateFilterCounts(tasks);
  }, [tasks]);

  // Combined Search + Status + Priority filtering (derived from state without data mutation)
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, {
      searchQuery,
      statusFilter,
      priorityFilter,
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Sorting applied on filtered results
  const visibleTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortBy);
  }, [filteredTasks, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'newest';

  // ---------------------------------------------------------------------------
  // 4. RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="app-wrapper">
      {/* Header */}
      <Header onOpenAddModal={handleOpenAddModal} />

      {/* Main Container */}
      <main className="main-content" id="main-content">
        {/* Dashboard Statistics */}
        <Dashboard
          stats={stats}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onSelectFilter={handleDashboardFilter}
        />

        {/* Search, Filter, and Sorting Controls */}
        <section className="controls-section" aria-label="Search, filter, and sorting toolbar">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
          <FilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={filterCounts}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* Task List / Grid with Contextual Empty States */}
        <TaskList
          tasks={visibleTasks}
          totalTaskCount={tasks.length}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
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
          <div className="modal-content delete-modal-content">
            <div className="delete-modal-body">
              <div className="delete-icon-box" aria-hidden="true">
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
                Are you sure you want to delete this task? This action is permanent and cannot be undone.
              </p>
              <div className="delete-task-preview" title={deleteConfirmTask.title}>
                "{deleteConfirmTask.title}"
              </div>
            </div>

            <div className="modal-footer delete-modal-footer">
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

      {/* Toast Feedback Notifications */}
      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast-message ${toast.type}`}>
            {toast.type === 'success' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            )}
            {toast.type === 'danger' && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
