import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import NewCreativeButton from '@/components/dashboard/new-creative-button'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*, creatives(*)')
    .eq('id', id)
    .single()

  if (!project) notFound()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-1">광고 소재 {project.creatives?.length ?? 0}개</p>
        </div>
        <NewCreativeButton projectId={id} />
      </div>

      {!project.creatives || project.creatives.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">첫 광고 소재를 만들어보세요</h3>
          <p className="text-slate-500">제품 누끼샷과 레퍼런스 광고를 업로드하면 시작됩니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.creatives.map((creative: { id: string; name: string; status: string }) => (
            <Link
              key={creative.id}
              href={`/creative/${creative.id}`}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-900">{creative.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  creative.status === 'completed' ? 'bg-green-100 text-green-700' :
                  creative.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {creative.status === 'completed' ? '완료' :
                   creative.status === 'generating' ? '생성 중' : '초안'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
