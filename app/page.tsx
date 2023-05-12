import Link from 'next/link'

import { Footer } from '@/app/Footer'
import { Header } from '@/app/Header'
import { Logo } from '@/components/Logo'
// import { Navigation } from '@/components/Navigation'
// import { Prose } from '@/components/Prose'

import * as store from '@/store'

const sbsOwnerID = 'YToMTO4GhbbbAshq4I5rdPyQZyu2'

export default async function Home() {
  const competitions = await store.competitions(sbsOwnerID)

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
          {/* <Navigation className="hidden lg:mt-10 lg:block" /> */}
        </div>
      </header>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-8">
          <ul role="list" className="divide-y divide-gray-100">
            {competitions.map((comp) => (
              <li key={comp.id} className="flex justify-between gap-x-6 py-5">
                <div className="flex gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <Link href={`/${comp.id}`}>
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {comp.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {new Date(
                          comp.created.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    <Link
                      href={`/${comp.id}`}
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Open
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </main>
        <Footer />
      </div>
    </div>
  )
}
