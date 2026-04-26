import { useDocumentStore } from '../../store/documentStore'
import './DocumentView.css'

export default function DocumentView() {
  const { document } = useDocumentStore()
  if (!document) return null

  return (
    <div className="document-view">
      <div className="doc-header">
        <span className="doc-format">{document.format.toUpperCase()}</span>
        <h2 className="doc-title">{document.title}</h2>
        <span className="doc-meta">{document.wordCount.toLocaleString()}자</span>
      </div>
      <div className="doc-body">
        {document.paragraphs.map((p) => (
          <p
            key={p.id}
            className={`doc-paragraph ${p.level > 0 ? `heading-${p.level}` : ''}`}
          >
            {p.text}
          </p>
        ))}
      </div>
    </div>
  )
}
