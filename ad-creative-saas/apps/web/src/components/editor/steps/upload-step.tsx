'use client'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCreativeStore } from '@/store/creative-store'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

export default function UploadStep({ creativeId }: { creativeId: string }) {
  const { productImage, referenceImage, productInfo, setProductImage, setReferenceImage, setProductInfo } = useCreativeStore()

  const onProductDrop = useCallback((files: File[]) => {
    if (files[0]) setProductImage(files[0])
  }, [setProductImage])

  const onReferenceDrop = useCallback((files: File[]) => {
    if (files[0]) setReferenceImage(files[0])
  }, [setReferenceImage])

  const { getRootProps: getProductProps, getInputProps: getProductInputProps, isDragActive: isProductDrag } = useDropzone({
    onDrop: onProductDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  })

  const { getRootProps: getRefProps, getInputProps: getRefInputProps, isDragActive: isRefDrag } = useDropzone({
    onDrop: onReferenceDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-2">이미지 업로드</h2>
      <p className="text-slate-500 mb-8">제품 누끼샷과 광고 레퍼런스를 업로드하세요</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product image */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">제품 누끼샷 <span className="text-red-500">*</span></h3>
          {productImage ? (
            <div className="relative bg-checkered rounded-xl overflow-hidden border-2 border-blue-500 aspect-square">
              <Image src={URL.createObjectURL(productImage)} alt="product" fill className="object-contain p-4" />
              <button onClick={() => setProductImage(null)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-slate-100">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              {...getProductProps()}
              className={`border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isProductDrag ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400'
              }`}
            >
              <input {...getProductInputProps()} />
              <Upload size={32} className="text-slate-400 mb-3" />
              <p className="text-slate-600 font-medium">누끼샷 업로드</p>
              <p className="text-slate-400 text-sm mt-1">PNG (투명 배경) 권장</p>
            </div>
          )}
        </div>

        {/* Reference image */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">광고 레퍼런스 <span className="text-red-500">*</span></h3>
          {referenceImage ? (
            <div className="relative rounded-xl overflow-hidden border-2 border-green-500 aspect-square">
              <Image src={URL.createObjectURL(referenceImage)} alt="reference" fill className="object-cover" />
              <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-slate-100">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              {...getRefProps()}
              className={`border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isRefDrag ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white hover:border-green-400'
              }`}
            >
              <input {...getRefInputProps()} />
              <Upload size={32} className="text-slate-400 mb-3" />
              <p className="text-slate-600 font-medium">레퍼런스 광고 업로드</p>
              <p className="text-slate-400 text-sm mt-1">분석할 광고 이미지</p>
            </div>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-3">제품 정보</h3>
        <textarea
          value={productInfo}
          onChange={e => setProductInfo(e.target.value)}
          placeholder="제품명, 주요 특징, 타겟 고객, 핵심 메시지 등을 입력하세요..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
      </div>
    </div>
  )
}
