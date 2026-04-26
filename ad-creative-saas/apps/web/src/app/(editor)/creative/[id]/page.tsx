import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CreativeEditor from '@/components/editor/creative-editor'

export default async function CreativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: creative } = await supabase
    .from('creatives')
    .select('*, projects(*)')
    .eq('id', id)
    .single()

  if (!creative) notFound()

  return <CreativeEditor creative={creative} />
}
