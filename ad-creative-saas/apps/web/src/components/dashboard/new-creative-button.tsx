'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

export default function NewCreativeButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleCreate() {
    setLoading(true)
    const { data, error } = await supabase
      .from('creatives')
      .insert({ project_id: projectId, name: '새 광고 소재', status: 'draft' })
      .select()
      .single()
    if (!error && data) {
      router.push(`/creative/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors font-medium"
    >
      <Plus size={16} />
      {loading ? '생성 중...' : '새 소재'}
    </button>
  )
}
