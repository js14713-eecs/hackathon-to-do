import { useEffect, useMemo, useState, type FormEvent } from 'react'

type Todo = { id: string; text: string; done: boolean; createdAt: number }
type Filter = 'all' | 'active' | 'done'

const STORAGE_KEY = 'todos.v1'
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE ?? 'Hackathon Todo'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '未完成' },
  { key: 'done', label: '已完成' },
]

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Todo[]) : []
  } catch {
    return []
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const visible = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.done)
    if (filter === 'done') return todos.filter((t) => t.done)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.done).length

  function add(e: FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: value, done: false, createdAt: Date.now() },
      ...prev,
    ])
    setText('')
  }

  function toggle(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main className="app">
      <header>
        <h1>{APP_TITLE}</h1>
        <p className="sub">
          {remaining} 项待完成 · 共 {todos.length} 项
        </p>
      </header>

      <form className="add" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今天要做什么？"
          autoFocus
        />
        <button type="submit">添加</button>
      </form>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? 'on' : ''}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="list">
        {visible.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span>{t.text}</span>
            </label>
            <button className="del" onClick={() => remove(t.id)} aria-label="删除">
              ×
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="empty">这里还没有任务</li>}
      </ul>

      {todos.some((t) => t.done) && (
        <button
          className="clear"
          onClick={() => setTodos((prev) => prev.filter((t) => !t.done))}
        >
          清除已完成
        </button>
      )}
    </main>
  )
}
