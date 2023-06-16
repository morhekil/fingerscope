'use client'

import clsx from 'clsx'

export function Header({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}): JSX.Element {
  return (
    <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
      <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
        <div
          className={clsx(
            className,
            'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
            'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
            'bg-white/0.9 dark:bg-zinc-900/0.8'
          )}
        >
          <div className="flex items-center gap-5 lg:hidden">{children}</div>
        </div>
      </div>
    </header>
  )
}
