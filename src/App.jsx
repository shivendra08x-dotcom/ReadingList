import { useState, useEffect } from 'react'

const STORAGE_KEY = 'reading-list-books'

const STATUSES = ['Want to Read', 'Reading', 'Finished']

const STATUS_CLASSES = {
  'Want to Read': 'status-want',
  'Reading': 'status-reading',
  'Finished': 'status-finished',
}

const FILTERS = ['All', ...STATUSES]

function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function App() {
  const [books, setBooks] = useState(loadBooks)
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }, [books])

  const addBook = (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setBooks((prev) => [
      { id: Date.now(), title: trimmed, status: 'Want to Read' },
      ...prev,
    ])
    setTitle('')
  }

  const changeStatus = (id, status) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = books.filter((b) => b.status === s).length
    return acc
  }, {})

  const filtered =
    filter === 'All' ? books : books.filter((b) => b.status === filter)

  return (
    <div className="app">
      <header className="header">
        <h1>Reading List</h1>
        <p>Track books you want to read, are reading, or have finished.</p>
      </header>

      <div className="card">
        <form className="add-form" onSubmit={addBook}>
          <input
            type="text"
            placeholder="Enter a book title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary">
            Add Book
          </button>
        </form>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== 'All' && <span className="filter-count">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          {books.length === 0 ? (
            <>
              <div className="empty-icon">&#128214;</div>
              <p>Your reading list is empty. Add your first book.</p>
            </>
          ) : (
            <p>No books in this category.</p>
          )}
        </div>
      ) : (
        <div className="book-list">
          {filtered.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <span className={`status-badge ${STATUS_CLASSES[book.status]}`}>
                  {book.status}
                </span>
              </div>
              <div className="book-actions">
                <select
                  className="status-select"
                  value={book.status}
                  onChange={(e) => changeStatus(book.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="btn-delete"
                  onClick={() => deleteBook(book.id)}
                  aria-label="Delete book"
                >
                  &#128465;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
