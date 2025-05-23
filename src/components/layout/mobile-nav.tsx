'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, Pizza } from 'lucide-react'

import type { MainNavItem, SidebarNavItem } from '@/types/nav'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { DialogTitle } from '../ui/dialog'
import Image from 'next/image'

interface MobileNavProps {
  mainNavItems?: MainNavItem[]
  dashboardItem?: SidebarNavItem[]
}

export function MobileNav({ mainNavItems, dashboardItem }: MobileNavProps) {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
        >
          <MenuIcon className='size-6' />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pr-0 pl-1'>
        <div className='px-7'>
          <Link
            aria-label='Home'
            href='/'
            className='flex items-center'
            onClick={() => setIsOpen(false)}
          >
            <Image src='/logo.png' alt='Logo' width={32} height={32} className='h-8 w-8 rounded-full mr-1' />
            <DialogTitle className='text-lg font-bold'>
              {siteConfig.name}
            </DialogTitle>
          </Link>
        </div>

        <ScrollArea className='my-4 h-[calc(100vh-8rem)] px-6 pb-10'>
          {mainNavItems?.map((item) =>
            item.items ? (
              <div key={item.title}>
                <Accordion type='single' collapsible>
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className='py-1 text-lg capitalize'>
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='flex flex-col'>
                        {item.items.map((item) => (
                          <MobileLink
                            href={item.href!}
                            key={item.title}
                            pathname={pathname}
                            setIsOpen={setIsOpen}
                          >
                            <span className='text-lg capitalize'>
                              {item.title}
                            </span>
                          </MobileLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : (
              item.href && (
                <div
                  className='flex flex-col space-y-4 font-medium'
                  key={item.title}
                >
                  <MobileLink
                    href={item.href}
                    pathname={pathname}
                    setIsOpen={setIsOpen}
                  >
                    <span className='text-lg capitalize'>{item.title}</span>
                  </MobileLink>
                </div>
              )
            ),
          )}
          {dashboardItem?.map((item) =>
            item.items ? (
              <div key={item.title}>
                <Accordion type='single' collapsible>
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className='py-1 text-lg capitalize'>
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='flex flex-col'>
                        {item.items.map((item) => (
                          <MobileLink
                            href={item.href!}
                            key={item.title}
                            pathname={pathname}
                            setIsOpen={setIsOpen}
                          >
                            <span className='text-lg capitalize'>
                              {item.title}
                            </span>
                          </MobileLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : (
              item.href && (
                <div
                  className='flex flex-col space-y-4 font-medium'
                  key={item.title}
                >
                  <MobileLink
                    href={item.href}
                    pathname={pathname}
                    setIsOpen={setIsOpen}
                  >
                    <span className='text-lg capitalize'>{item.title}</span>
                  </MobileLink>
                </div>
              )
            ),
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  children?: React.ReactNode
  href: string
  disabled?: boolean
  pathname: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileLink({
  children,
  href,
  disabled,
  pathname,
  setIsOpen,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-foreground/70 hover:text-foreground transition-colors',
        pathname === href && 'text-foreground',
        disabled && 'pointer-events-none opacity-60',
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  )
}
