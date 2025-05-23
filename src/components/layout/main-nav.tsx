'use client'

import Link from 'next/link'
import { forwardRef, type FC } from 'react'
import { Pizza } from 'lucide-react'
import Image from 'next/image'

import type { MainNavItem } from '@/types/nav'
import { siteConfig } from '@/config/site'
import { cn, toTitleCase } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

interface MainNavProps {
  items?: MainNavItem[]
}

export const MainNav: FC<MainNavProps> = ({ items }) => {
  return (
    <div className='hidden gap-6 lg:flex'>
      <Link
        aria-label='Home'
        href='/'
        className='hidden items-center space-x-2 lg:flex'
      >
        <Image src='/logo.png' alt='Logo' width={32} height={32} className='h-8 w-8 rounded-full' />
        <span className='hidden font-bold lg:inline-block ml-1'>
          {" "}{siteConfig.name}
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {items
            ?.filter((item) => item.title !== items[0]?.title)
            .map((item, i) =>
              item.items ? (
                <NavigationMenuItem key={item.title + i}>
                  <NavigationMenuTrigger className='h-auto capitalize'>
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                      {item.items.map((item, i) => (
                        <ListItem
                          aria-label={item.title}
                          key={item.title + i}
                          title={item.title}
                          href={item.href}
                          disabled={item.disabled}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                item.href && (
                  <NavigationMenuItem key={item.title + i}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'h-auto',
                        item.disabled && 'pointer-events-none opacity-50',
                      )}
                      aria-label={item.title}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              ),
            )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = forwardRef<
  React.ComponentRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    disabled?: boolean
  }
>(({ className, title, children, href, disabled, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={`${href}`}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
            disabled && 'pointer-events-none opacity-50',
            className,
          )}
          {...props}
        >
          <div className='text-sm leading-none font-medium'>
            {toTitleCase(title!)}
          </div>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
