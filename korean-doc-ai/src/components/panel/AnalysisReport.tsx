import { useEffect } from 'react'
import { useDocumentStore } from '../../store/documentStore'
import FileDropZone from '../common/FileDropZone'
import './AnalysisReport.css'

export default function AnalysisReport() {
  const { document, analysisResult, isAnalyzing, clearAnalysis, appendAnalysis, setAnalyzing } =
    useDocumentStore()

  useEffect(() => {
    window.electronAPI?.onAnalyzeChunk((chunk) => appendAnalysis(chunk))
    window.electronAPI?.onAnalyzeDone(() => setAnalyzing(false))

    return () => {
      window.electronAPI?.removeAllListeners('ai:analyze-chunk')
      window.electronAPI?.removeAllListeners('ai:analyze-done')
    }
  }, [appendAnalysis, setAnalyzing])

  const handleAnalyze = async () => {
    if (!document || isAnalyzing) return
    clearAnalysis()
    setAnalyzing(true)
    await window.electronAPI?.analyzeDocument(document.rawText)
  }

  if (!document) {
    return <FileDropZone />
  }

  return (
    <div className="analysis-report">
      <div className="analysis-header">
        <span className="doc-info">
          {document.title} · {document.wordCount.toLocaleString()}자
        </span>
        <button
          className={`analyze-btn ${isAnalyzing ? 'loading' : ''}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? '분석 중...' : analysisResult ? '다시 분석' : '전체 분석 시작'}
        </button>
      </div>

      <div className="analysis-content">
        {!analysisResult && !isAnalyzing && (
          <div className="analysis-empty">
            <p>분석 시작 버튼을 눌러 문서를 분석하세요.</p>
            <p className="hint">맞춤법, 문장 구조, 논리 흐름을 검토합니다.</p>
          </div>
        )}
        {(analysisResult || isAnalyzing) && (
          <div className="analysis-text">
            <p>{analysisResult}</p>
            {isAnalyzing && <span className="cursor" />}
          </div>
        )}
      </div>
    </div>
  )
}
