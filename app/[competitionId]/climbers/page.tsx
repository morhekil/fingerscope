import Link from 'next/link'

import { Footer } from '@/app/Footer'
import { Header } from '@/app/Header'
import { Logo } from '@/components/Logo'

import * as store from '@/store'
import ClimberSelect from './ClimberSelect'

export default async function Climbers({
  params,
}: {
  params: { competitionId: string }
}) {
  const compId = params.competitionId
  const competition = await store.competition(compId)
  const competitors = await store.competitors(compId)

  return (
    <div className="lg:ml-72 xl:ml-80">
      <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
        <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
          <div className="hidden lg:flex">
            <Link href="/" aria-label="Home">
              <Logo className="h-6" />
            </Link>
          </div>
          <Header />
        </div>
      </header>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-8">
          <article className="prose">
            <div className="min-w-0 flex-1">
              <h2 className="mt-0 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Comp: <Link href="/">{competition.name}</Link>
              </h2>
              <h3>Select your climber</h3>
            </div>

            <ClimberSelect competitors={competitors} compId={compId} />
          </article>
        </main>
        <Footer />
      </div>
    </div>
  )
}
