import { useState } from 'react'
import ChatPanel from './ChatPanel'
import DocumentView from './DocumentView'
import AnalysisReport from './AnalysisReport'
import FileDropZone from '../common/FileDropZone'
import { useDocumentStore } from '../../store/documentStore'
import './MainPanel.css'

type Tab = 'chat' | 'document' | 'analysis'

export default function MainPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const { document } = useDocumentStore()

  const tabs: { key: Tab; label: string }[] = [
    { key: 'chat', label: '채팅' },
    { key: 'document', label: '문서' },
    { key: 'analysis', label: '분석' },
  ]

  return (
    <div className="main-panel">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {!document && activeTab !== 'chat' && (
          <FileDropZone />
        )}

        {activeTab === 'chat' && <ChatPanel />}
        {activeTab === 'document' && document && <DocumentView />}
        {activeTab === 'analysis' && <AnalysisReport />}
        {activeTab === 'document' && !document && <FileDropZone />}
      </div>
    </div>
  )
}
