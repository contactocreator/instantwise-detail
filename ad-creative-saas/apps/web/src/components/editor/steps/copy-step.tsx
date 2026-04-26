'use client'
import { useState } from 'react'
import { useCreativeStore } from '@/store/creative-store'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

export default function CopyStep({ creativeId }: { creativeId: string }) {
  const { layers, productInfo, copies, selectedCopies, setCopies, toggleCopySelection } = useCreativeStore()
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creative_id: creativeId, layers, product_info: productInfo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCopies(data.copies)
      toast.success('광고 카피 10개 생성 완료!')
    } catch {
      toast.error('카피 생성 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  function downloadExcel() {
    const rows = copies.map((c, i) => ({
      '번호': i + 1,
      '헤드라인': c.headline,
      '서브헤드라인': c.subheadline,
      'CTA': c.cta,
      '선택': selectedCopies.includes(i) ? 'O' : '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '광고카피')
    XLSX.writeFile(wb, '광고카피.xlsx')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-2">광고 카피 제작</h2>
      <p className="text-slate-500 mb-8">AI가 레이어 구조를 분석해 10개의 광고 카피를 제작합니다</p>

      {copies.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">광고 카피 생성</h3>
          <p className="text-slate-500 mb-6">제품 정보와 레이어 구조를 바탕으로 10개의 광고 카피를 생성합니다</p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? '생성 중...' : '카피 생성 시작'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-600 text-sm">{selectedCopies.length}개 선택됨</p>
            <div className="flex gap-2">
              <button onClick={downloadExcel} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                Excel 다운로드
              </button>
              <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                {loading ? '재생성 중...' : '다시 생성'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {copies.map((copy, i) => (
              <div
                key={i}
                onClick={() => toggleCopySelection(i)}
                className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-colors ${
                  selectedCopies.includes(i) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400 font-mono">#{i + 1}</span>
                      {selectedCopies.includes(i) && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">선택됨</span>
                      )}
                    </div>
                    <p className="font-bold text-slate-900 text-lg">{copy.headline}</p>
                    <p className="text-slate-600 mt-1">{copy.subheadline}</p>
                    <p className="text-blue-600 font-medium text-sm mt-2">{copy.cta}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ml-4 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selectedCopies.includes(i) ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {selectedCopies.includes(i) && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
