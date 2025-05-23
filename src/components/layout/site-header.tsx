import { type FC } from 'react'
import Link from 'next/link'
import type { User } from '@clerk/nextjs/server'
import {
  LayoutDashboard,
  LogOut,
  Settings,
  User2 as UserIcon,
} from 'lucide-react'

import { dashboardConfig } from '@/config/dashboard'
import { siteConfig } from '@/config/site'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Combobox from '../combobox'
import { SavedRecipesIcon } from '../saved-recipes-icon'
import { ThemeSwitch } from '../theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
import { MainNav } from './main-nav'
import { MobileNav } from './mobile-nav'

interface SiteHeaderProps {
  user: User | null
}

const SiteHeader: FC<SiteHeaderProps> = ({ user }) => {
  const email = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress

  const initials = user?.firstName
    ? user?.firstName?.charAt(0) + user?.lastName?.charAt(0)
    : null
  return (
    <header className='bg-background sticky top-0 z-40 w-full border-b'>
      <div className='container flex h-16 items-center'>
        <MainNav items={siteConfig.MainNavItem} />
        <MobileNav
          mainNavItems={siteConfig.MainNavItem}
          dashboardItem={dashboardConfig.sidebarNav}
        />
        <div className='flex flex-1 items-center justify-end space-x-4'>          <nav className='flex items-center space-x-2'>
            <Combobox />
            <SavedRecipesIcon />
            <ThemeSwitch />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label='Open user menu'
                    variant='secondary'
                    className='relative size-8 rounded-full'
                  >
                    <Avatar className='size-8'>
                      <AvatarImage
                        src={user.imageUrl}
                        loading='lazy'
                        alt={
                          user.firstName
                            ? user.firstName + user.lastName
                            : (user.username ?? '')
                        }
                      />
                      <AvatarFallback>
                        {initials
                          ? initials
                          : user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end' forceMount>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        {user.firstName ?? user.username} {user.lastName ?? ''}
                      </p>
                      <p className='text-muted-foreground text-xs leading-none'>
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href='/dashboard/account'>
                        <UserIcon className='mr-2 size-4' aria-hidden='true' />
                        Account
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/dashboard/recipes/my-recipes'>
                        <LayoutDashboard
                          className='mr-2 size-4'
                          aria-hidden='true'
                        />
                        Dashboard
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild disabled>
                      <Link href='/dashboard/settings'>
                        <Settings className='mr-2 size-4' aria-hidden='true' />
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/signout'>
                      <LogOut className='mr-2 size-4' aria-hidden='true' />
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href='/signin'
                className={buttonVariants({
                  size: 'sm',
                })}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
export default SiteHeader
