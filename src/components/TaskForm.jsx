import React, { useState, useEffect, useRef } from 'react';

/**
 * TaskForm Component
 * Reusable modal form for both Adding and Editing tasks.
 * Validates required fields (Title and Due Date).
 */
export default function TaskForm({ isOpen, onClose, onSubmit, initialTask = null }) {
  const isEditMode = Boolean(initialTask && initialTask.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState({ title: false, dueDate: false });

  const titleInputRef = useRef(null);

  // Sync form inputs when modal opens or initialTask changes
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setPriority(initialTask.priority || 'Medium');
        setDueDate(initialTask.dueDate || '');
      } else {
        // Reset to default for new task
        setTitle('');
        setDescription('');
        setPriority('Medium');
        // Default due date to today or empty: Let user pick, or leave blank to require picking
        setDueDate('');
      }
      setErrors({});
      setIsTouched({ title: false, dueDate: false });

      // Focus title input on modal open
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen, initialTask]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTouched({ title: true, dueDate: true });

    if (!validate()) {
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
    };

    onSubmit(taskPayload);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: '' }));
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Task Title */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                id="task-title-input"
                ref={titleInputRef}
                type="text"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                placeholder="e.g. Implement user authentication flow"
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setIsTouched((prev) => ({ ...prev, title: true }))}
                aria-required="true"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <div id="title-error" className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                Description <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Add context, acceptance criteria, or relevant links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Priority Selection */}
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <div className="priority-selector" role="radiogroup" aria-label="Task Priority">
                {['Low', 'Medium', 'High'].map((p) => {
                  const pLower = p.toLowerCase();
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`priority-option-btn ${isSelected ? `selected-${pLower}` : ''}`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-duedate-input" className="form-label">
                Due Date <span className="required-star">*</span>
              </label>
              <input
                id="task-duedate-input"
                type="date"
                className={`form-input ${errors.dueDate ? 'has-error' : ''}`}
                value={dueDate}
                onChange={handleDueDateChange}
                onBlur={() => setIsTouched((prev) => ({ ...prev, dueDate: true }))}
                aria-required="true"
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? 'duedate-error' : undefined}
              />
              {errors.dueDate && (
                <div id="duedate-error" className="error-message" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{errors.dueDate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
