import Link from 'next/link'

import { Footer } from './Footer'
import { Header } from './Header'
import { Logo } from '@/components/Logo'
// import { Navigation } from '@/components/Navigation'
// import { Prose } from '@/components/Prose'

export default function Home() {
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
        <main className="py-16">
          {/* <Prose as="article">{children}</Prose> */}
          Auth form here
        </main>
        <Footer />
      </div>
    </div>
  )
}
