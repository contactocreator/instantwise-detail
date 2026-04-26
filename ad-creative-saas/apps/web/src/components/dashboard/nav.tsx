'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">AdCreative</Link>
          <Link href="/dashboard" className={`text-sm ${pathname === '/dashboard' ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}>
            프로젝트
          </Link>
        </div>
        <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-700">
          로그아웃
        </button>
      </div>
    </nav>
  )
}
