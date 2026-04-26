import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">프로젝트</h1>
          <p className="text-slate-500 mt-1">광고 캠페인을 관리하세요</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          <Plus size={16} />
          새 프로젝트
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">첫 프로젝트를 만들어보세요</h3>
          <p className="text-slate-500 mb-6">제품 사진과 레퍼런스를 업로드하면 AI가 광고 소재를 제작합니다</p>
          <Link href="/projects/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
            프로젝트 시작하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: { id: string; name: string; created_at: string }) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-slate-500 text-sm">{new Date(project.created_at).toLocaleDateString('ko-KR')}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
