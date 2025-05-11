'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { CircleDashed } from 'lucide-react'

import type { SidebarNavItem } from '@/types/nav'
import { cn } from '@/lib/utils'

import { Icons } from '../icons'

export interface SidebarNavProps {
  items: SidebarNavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const segment = useSelectedLayoutSegment()

  if (!items?.length) return null
  return (
    <div className='flex w-full flex-col gap-2'>
      {items[0].items.map((item) => {
        const LucideIcon =
          Icons[item.icon as keyof typeof Icons] || CircleDashed

        // Common styling for the item
        const itemClassName = cn(
          'group flex w-full items-center rounded-md border border-transparent px-2 py-1',
          item.href?.includes(String(segment))
            ? 'bg-muted text-foreground font-medium'
            : 'text-muted-foreground',
          item.disabled
            ? 'opacity-60 cursor-not-allowed bg-muted/50'
            : 'hover:bg-muted hover:text-foreground',
        )

        // If item is disabled, render a div instead of a link
        if (item.disabled) {
          return (
            <div
              key={item.title}
              className={itemClassName}
              title={item.disabled ? 'This option is currently unavailable' : undefined}
            >
              <LucideIcon className='mr-2 size-5' />
              <span>{item.title}</span>
            </div>
          )
        }

        // Otherwise render a normal link
        return item.href ? (
          <Link
            aria-label={item.title}
            key={item.title}
            href={item.href}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            <span className={itemClassName}>
              <LucideIcon className='mr-2 size-5' />
              <span>{item.title}</span>
            </span>
          </Link>
        ) : (
          <span
            key={item.title}
            className='text-muted-foreground flex w-full cursor-not-allowed items-center rounded-md p-2 hover:underline'
          >
            {item.title}
          </span>
        )
      })}
    </div>
  )
}
