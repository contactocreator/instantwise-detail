'use client'
import { useState } from 'react'
import UploadStep from './steps/upload-step'
import AnalyzeStep from './steps/analyze-step'
import CopyStep from './steps/copy-step'
import GenerateStep from './steps/generate-step'
import { useCreativeStore } from '@/store/creative-store'

const STEPS = [
  { id: 'upload', label: '업로드' },
  { id: 'analyze', label: '레이어 분석' },
  { id: 'copy', label: '광고 카피' },
  { id: 'generate', label: '이미지 생성' },
]

export default function CreativeEditor({ creative }: { creative: { id: string; name: string; status: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const { productImage, referenceImage, layers, copies, selectedCopies } = useCreativeStore()

  function canProceed(stepIndex: number) {
    if (stepIndex === 0) return !!(productImage && referenceImage)
    if (stepIndex === 1) return !!layers
    if (stepIndex === 2) return selectedCopies.length > 0
    return false
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Step indicator */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-slate-500 text-sm">광고 소재 제작</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium text-sm">{creative.name}</span>
          </div>
          <div className="flex items-center gap-0 mt-4">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    i === currentStep ? 'bg-blue-600 text-white' :
                    i < currentStep ? 'text-blue-600 hover:bg-blue-50' :
                    'text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={i > currentStep}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    i === currentStep ? 'bg-white text-blue-600' :
                    i < currentStep ? 'bg-blue-600 text-white' :
                    'bg-slate-200 text-slate-500'
                  }`}>{i + 1}</span>
                  {step.label}
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="container mx-auto px-6 py-8">
        {currentStep === 0 && <UploadStep creativeId={creative.id} />}
        {currentStep === 1 && <AnalyzeStep creativeId={creative.id} />}
        {currentStep === 2 && <CopyStep creativeId={creative.id} />}
        {currentStep === 3 && <GenerateStep creativeId={creative.id} />}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(s => s - 1)}
            disabled={currentStep === 0}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-0 transition-colors"
          >
            이전
          </button>
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed(currentStep)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
            >
              다음 단계 →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
