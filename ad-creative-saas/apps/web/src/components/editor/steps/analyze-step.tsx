'use client'
import { useState } from 'react'
import { useCreativeStore } from '@/store/creative-store'
import { toast } from 'sonner'

export default function AnalyzeStep({ creativeId }: { creativeId: string }) {
  const { referenceImage, productInfo, layers, setLayers } = useCreativeStore()
  const [loading, setLoading] = useState(false)

  async function handleAnalyze() {
    if (!referenceImage) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('reference_image', referenceImage)
      formData.append('product_info', productInfo)
      formData.append('creative_id', creativeId)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLayers(data.layers)
      toast.success('레이어 분석 완료!')
    } catch (e) {
      toast.error('분석 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-2">레이어 분석</h2>
      <p className="text-slate-500 mb-8">AI가 레퍼런스 광고의 구조를 분석합니다</p>

      {!layers ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">레퍼런스 분석 시작</h3>
          <p className="text-slate-500 mb-6">Claude Vision AI가 배경, 제품 배치, 텍스트 영역을 분석합니다</p>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? '분석 중...' : '분석 시작'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <p className="text-green-800 font-medium">레이어 분석 완료</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800 mb-3">배경</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">타입:</span> {layers.background?.type ?? '-'}</p>
                <p><span className="font-medium">컬러톤:</span> {layers.background?.color_tone ?? '-'}</p>
                <p><span className="font-medium">스타일:</span> {layers.background?.style ?? '-'}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800 mb-3">제품 배치</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">위치:</span> {layers.product?.position ?? '-'}</p>
                <p><span className="font-medium">크기:</span> {layers.product?.size ?? '-'}</p>
                <p><span className="font-medium">구도:</span> {layers.product?.composition ?? '-'}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="font-semibold text-slate-800 mb-3">텍스트 섹션</h4>
              <div className="space-y-2 text-sm text-slate-600">
                {layers.text_sections?.map((section: { part: number; position: string; role: string; font_style: string }, i: number) => (
                  <div key={i} className="border-l-2 border-blue-300 pl-2">
                    <p className="font-medium">파트 {section.part}</p>
                    <p>위치: {section.position}</p>
                    <p>역할: {section.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            다시 분석
          </button>
        </div>
      )}
    </div>
  )
}
