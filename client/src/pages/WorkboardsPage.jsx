import { useState, useRef, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Sidebar from '../components/Sidebar'
import './WorkboardsPage.css'

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Bell: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Grid: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Trend: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Drag: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
      <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
      <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
    </svg>
  ),
}

// ─── Column config ────────────────────────────────────────────────────────────
const COLUMN_CONFIG = [
  { id: 'todo',       label: 'TO DO',       dotColor: '#4a4947' },
  { id: 'inprogress', label: 'IN PROGRESS', dotColor: '#4ccec0' },
  { id: 'done',       label: 'DONE',        dotColor: '#6366f1' },
]

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: '#4a4947', bg: 'rgba(255,255,255,0.06)' },
  medium: { label: 'Medium', color: '#e8b84b', bg: 'rgba(232,184,75,0.12)' },
  high:   { label: 'High',   color: '#dd6974', bg: 'rgba(221,105,116,0.12)' },
}

// ─── Create Task Modal ────────────────────────────────────────────────────────
function CreateTaskModal({ onClose, onAdd }) {
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('medium')
  const [due, setDue]           = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Task title is required.'); return }
    onAdd({
      title:    title.trim(),
      description: desc.trim() || null,
      category: category.trim().toUpperCase() || 'TASK',
      priority,
      due:      due || null,
      column:   'todo',
      createdAt: Date.now(),
    })
    onClose()
  }

  return (
    <div className="wb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wb-modal">
        <div className="wb-modal-header">
          <h2 className="wb-modal-title">Create Task</h2>
          <button type="button" className="wb-modal-close" onClick={onClose} aria-label="Close">
            <Icon.X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="wb-modal-form">
          <div className="wb-modal-field">
            <label className="wb-modal-label">Title *</label>
            <input
              className="wb-modal-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError('') }}
              autoFocus
            />
            {error && <p className="wb-modal-error">{error}</p>}
          </div>

          <div className="wb-modal-field">
            <label className="wb-modal-label">Description</label>
            <textarea
              className="wb-modal-textarea"
              placeholder="Add details (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </div>

          <div className="wb-modal-row">
            <div className="wb-modal-field">
              <label className="wb-modal-label">Category</label>
              <input
                className="wb-modal-input"
                placeholder="e.g. UI DESIGN"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="wb-modal-field">
              <label className="wb-modal-label">Priority</label>
              <select
                className="wb-modal-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="wb-modal-field">
            <label className="wb-modal-label">Due Date</label>
            <input
              type="date"
              className="wb-modal-input"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </div>

          <div className="wb-modal-footer">
            <button type="button" className="wb-modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="wb-modal-btn-submit">Add to To Do</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ card, onDelete, onDragStart }) {
  const pri = PRIORITY_CONFIG[card.priority] || PRIORITY_CONFIG.medium
  const isDone = card.column === 'done'

  // Format due date
  let dueLabel = null
  let dueUrgent = false
  if (card.due) {
    const d = new Date(card.due)
    const now = new Date()
    const diffDays = Math.ceil((d - now) / 86400000)
    if (diffDays < 0)       { dueLabel = 'Overdue';          dueUrgent = true }
    else if (diffDays === 0){ dueLabel = 'Today';             dueUrgent = true }
    else if (diffDays === 1){ dueLabel = 'Tomorrow';          dueUrgent = false }
    else                    { dueLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); dueUrgent = false }
  }

  return (
    <div
      className={`wb-card ${isDone ? 'wb-card--done' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
    >
      <div className="wb-card-header">
        <div className="wb-card-drag-handle" aria-hidden="true"><Icon.Drag /></div>
        <span
          className="wb-badge"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#797876' }}
        >
          {card.category}
        </span>
        <div className="wb-card-header-right">
          <span
            className="wb-badge"
            style={{ background: pri.bg, color: pri.color }}
          >
            {pri.label}
          </span>
          {isDone && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          <button
            type="button"
            className="wb-card-delete-btn"
            onClick={() => onDelete(card.id)}
            aria-label="Delete task"
          >
            <Icon.Trash />
          </button>
        </div>
      </div>

      <p className={`wb-card-title ${isDone ? 'wb-card-title--muted' : ''}`}>
        {card.title}
      </p>

      {card.description && (
        <p className="wb-card-desc">{card.description}</p>
      )}

      {(dueLabel) && (
        <div className={`wb-due ${dueUrgent ? 'wb-due--urgent' : ''}`}>
          {dueUrgent && <span className="wb-due-dot" />}
          {dueLabel}
        </div>
      )}
    </div>
  )
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
function KanbanColumn({ config, cards, onDelete, onDragStart, onDrop, onAddClick }) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }
  function handleDragLeave() { setIsDragOver(false) }
  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(e, config.id)
  }

  return (
    <div
      className={`wb-column ${isDragOver ? 'wb-column--dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="wb-col-header">
        <div className="wb-col-label">
          <span className="wb-col-dot" style={{ background: config.dotColor }} />
          <span className="wb-col-name">{config.label}</span>
          <span className="wb-col-count">{cards.length}</span>
        </div>
      </div>

      {cards.length === 0 && (
        <div className="wb-col-empty">
          <p>No tasks yet</p>
          {config.id === 'todo' && <p className="wb-col-empty-hint">Create a task to get started</p>}
          {config.id !== 'todo' && <p className="wb-col-empty-hint">Drag tasks here</p>}
        </div>
      )}

      {cards.map((card) => (
        <TaskCard
          key={card.id}
          card={card}
          onDelete={onDelete}
          onDragStart={onDragStart}
        />
      ))}

      {config.id === 'todo' && (
        <button type="button" className="wb-new-task" onClick={onAddClick}>
          <Icon.Plus /> New Task
        </button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkboardsPage({ onLogout }) {
  const [tasks, setTasks]           = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [search, setSearch]         = useState('')
  const dragCardId                  = useRef(null)

  useEffect(() => {
    async function fetchTasks() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) return

      const { data, error } = await supabase
        .from('workboard_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        const formatted = data.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          category: t.category,
          priority: t.priority,
          due: t.due_date,
          column: t.status,
          createdAt: t.created_at
        }))

        setTasks(formatted)
      }
    }

    fetchTasks()
  }, [])

  // ── Derived columns ──────────────────────────────────────────────────────
  const filteredTasks = search.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    : tasks

  const columns = COLUMN_CONFIG.map(col => ({
    ...col,
    cards: filteredTasks.filter(t => t.column === col.id),
  }))

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleAddTask(newTask) {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return

    const { data, error } = await supabase
      .from('workboard_tasks')
      .insert([
        {
          user_id: user.id,
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          priority: newTask.priority,
          due_date: newTask.due,
          status: newTask.column,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('INSERT ERROR:', error)
      return
    }

    setTasks(prev => [{
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      due: data.due_date,
      column: data.status,
      createdAt: data.created_at
    }, ...prev])
  }

  async function handleDeleteTask(taskId) {
    const { error } = await supabase
      .from('workboard_tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('DELETE ERROR:', error)
      return
    }

    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  function handleDragStart(e, cardId) {
    dragCardId.current = cardId
    e.dataTransfer.effectAllowed = 'move'
  }

  async function handleDrop(e, targetColumnId) {
    e.preventDefault()
    const id = dragCardId.current
    if (!id) return

    const { error } = await supabase
      .from('workboard_tasks')
      .update({ status: targetColumnId })
      .eq('id', id)

    if (error) {
      console.error('UPDATE ERROR:', error)
      return
    }

    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, column: targetColumnId } : t
      )
    )

    dragCardId.current = null
  }

  // ── Velocity bar widths ───────────────────────────────────────────────────
  const total    = tasks.length || 1
  const todoPct  = Math.round((tasks.filter(t => t.column === 'todo').length       / total) * 100)
  const progPct  = Math.round((tasks.filter(t => t.column === 'inprogress').length / total) * 100)
  const donePct  = 100 - todoPct - progPct

  return (
    <div className="wb-root">
      <Sidebar activePage="workboards" onLogout={onLogout} />

      <div className="wb-main">
        {/* Top bar */}
        <header className="wb-topbar">
          <div className="wb-search">
            <Icon.Search />
            <input
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="wb-topbar-right">
            <button type="button" className="wb-icon-btn" aria-label="Notifications">
              <Icon.Bell />
              <span className="wb-notif-dot" />
            </button>
            <button type="button" className="wb-icon-btn" aria-label="Grid view">
              <Icon.Grid />
            </button>
            <button
              type="button"
              className="wb-btn-add-task"
              onClick={() => setShowModal(true)}
            >
              <Icon.Plus /> Add Task
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="wb-content">
          {/* Project header */}
          <div className="wb-project-header">
            <div>
              <div className="wb-active-label">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ccec0', display: 'inline-block' }} />
                Active Workspace
              </div>
              <h1 className="wb-project-title">
                Project Workboard: <span className="wb-project-name">Canvas Deck</span>
              </h1>
              <p className="wb-project-desc">
                Track your tasks, move them through the pipeline, and stay on top of your work.
              </p>
            </div>
            <div className="wb-project-actions">
              <button
                type="button"
                className="wb-btn-create"
                onClick={() => setShowModal(true)}
              >
                <Icon.Plus /> Create Task
              </button>
            </div>
          </div>

          {/* Kanban board */}
          <div className="wb-board">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                config={col}
                cards={col.cards}
                onDelete={handleDeleteTask}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onAddClick={() => setShowModal(true)}
              />
            ))}
          </div>

          {/* Velocity widget */}
          <div className="wb-velocity">
            <div className="wb-velocity-header">
              <span className="wb-velocity-label">Task Progress</span>
              <Icon.Trend />
            </div>
            <div className="wb-velocity-value">
              <span className="wb-velocity-num">{tasks.filter(t => t.column === 'done').length}</span>
              <span className="wb-velocity-unit">/ {tasks.length} done</span>
            </div>
            <div className="wb-velocity-bars">
              {tasks.length > 0 ? (
                <>
                  <div className="wb-vel-bar wb-vel-bar--todo"  style={{ width: `${todoPct}%` }} />
                  <div className="wb-vel-bar wb-vel-bar--prog"  style={{ width: `${progPct}%` }} />
                  <div className="wb-vel-bar wb-vel-bar--done"  style={{ width: `${donePct}%` }} />
                </>
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 3 }} />
              )}
            </div>
            <div className="wb-velocity-legend">
              <span><span className="wb-leg-dot" style={{ background: '#4a4947' }} /> Todo</span>
              <span><span className="wb-leg-dot" style={{ background: '#4ccec0' }} /> In Progress</span>
              <span><span className="wb-leg-dot" style={{ background: '#6366f1' }} /> Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  )
}
