'use client'

import clsx from 'clsx'

import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import ReloadPageButton from '@/components/ReloadPageButton'

export function Header({ className }: { className?: string }): JSX.Element {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  return (
    <div
      className={clsx(
        className,
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
        !isInsideMobileNavigation &&
          'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
        isInsideMobileNavigation
          ? 'bg-white dark:bg-zinc-900'
          : 'bg-white/0.9 dark:bg-zinc-900/0.8'
      )}
    >
      <div className="flex items-center gap-5 lg:hidden">
        <ReloadPageButton />
      </div>
    </div>
  )
}
