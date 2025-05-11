'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useMounted } from '@/hooks/useMounted'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex w-full flex-col-reverse items-center gap-2 sm:flex-row'>
      <Button
        variant='secondary'
        size='sm'
        className='w-full'
        onClick={() => router.back()}
      >
        Go back
        <span className='sr-only'>Previous page</span>
      </Button>

      {mounted ? (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button size='sm' className='w-full' variant='destructive'>
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;ll need to sign in again to access your recipes,
                cookbooks, and other content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <SignOutButton
                redirectUrl={`${window.location.origin}/?redirect=false`}
              >
                <AlertDialogAction>Log out</AlertDialogAction>
              </SignOutButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: 'sm' }),
            'bg-muted text-muted-foreground w-full',
          )}
        >
          Log out
        </Skeleton>
      )}
    </div>
  )
}
