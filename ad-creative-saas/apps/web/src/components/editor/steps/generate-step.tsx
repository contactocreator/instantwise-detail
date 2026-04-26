'use client'
import { useState } from 'react'
import { useCreativeStore } from '@/store/creative-store'
import { toast } from 'sonner'
import Image from 'next/image'

export default function GenerateStep({ creativeId }: { creativeId: string }) {
  const { productImage, referenceImage, layers, copies, selectedCopies, generatedImages, setGeneratedImages } = useCreativeStore()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const selectedCopyData = selectedCopies.map(i => copies[i])

  async function handleGenerate() {
    if (!productImage || !referenceImage) return
    setLoading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('product_image', productImage)
      formData.append('reference_image', referenceImage)
      formData.append('creative_id', creativeId)
      formData.append('layers', JSON.stringify(layers))
      formData.append('copies', JSON.stringify(selectedCopyData))

      // Simulate progress
      const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 3000)

      const res = await fetch('/api/generate-image', { method: 'POST', body: formData })
      clearInterval(interval)
      setProgress(100)

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGeneratedImages(data.images)
      toast.success('이미지 생성 완료!')
    } catch {
      toast.error('이미지 생성 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-2">이미지 생성</h2>
      <p className="text-slate-500 mb-8">선택된 카피로 최종 광고 이미지를 생성합니다</p>

      {/* Selected copies preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3">선택된 카피 ({selectedCopyData.length}개)</h3>
        <div className="space-y-2">
          {selectedCopyData.map((copy, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-400 font-mono w-6">#{selectedCopies[i] + 1}</span>
              <div>
                <p className="font-medium text-slate-800 text-sm">{copy.headline}</p>
                <p className="text-slate-500 text-xs">{copy.cta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {generatedImages.length === 0 ? (
        <div className="text-center py-12">
          {loading ? (
            <div>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">이미지 생성 중...</h3>
              <p className="text-slate-500 mb-4">Ideogram AI로 광고 이미지를 제작하고 있습니다</p>
              <div className="w-64 mx-auto bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-slate-400 text-sm mt-2">{progress}%</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">광고 이미지 생성</h3>
              <p className="text-slate-500 mb-6">레이어 구조와 선택된 카피로 최종 광고 이미지를 생성합니다</p>
              <button
                onClick={handleGenerate}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
              >
                이미지 생성 시작
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {generatedImages.map((img, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={img.url} alt={`generated-${i}`} fill className="object-cover" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <p className="text-sm text-slate-600">{copies[selectedCopies[i]]?.headline}</p>
                  <a
                    href={img.url}
                    download={`ad-creative-${i + 1}.png`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    다운로드
                  </a>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            다시 생성
          </button>
        </div>
      )}
    </div>
  )
}
