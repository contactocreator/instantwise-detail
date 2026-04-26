import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">AdCreative</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm hover:text-blue-300 transition-colors">
            로그인
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
            무료 시작
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-bold mb-6">
          AI로 광고 소재를<br />자동으로 제작하세요
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          제품 사진과 레퍼런스만 업로드하면, AI가 광고 레이어 분석부터
          카피 제작, 이미지 생성까지 자동으로 처리합니다.
        </p>
        <Link href="/signup" className="inline-block px-8 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-500 transition-colors">
          무료로 시작하기 →
        </Link>
      </div>
    </main>
  )
}
