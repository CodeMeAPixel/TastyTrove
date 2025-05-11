'use client'

import { useEffect, useState } from 'react'
import { UserProfile as ClerkUserProfile, useUser } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { type Theme } from '@clerk/types'
import { Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { saveUserToDatabase } from '@/app/_actions/users'

const appearance: Theme = {
  baseTheme: undefined,
  variables: {
    borderRadius: '0.25rem',
  },
}

export function UserProfile() {
  const { theme } = useTheme()
  const { user, isLoaded } = useUser()
  const [isSyncing, setIsSyncing] = useState(false)

  // Sync Clerk user with our database
  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          setIsSyncing(true)
          // Save user info to our database
          await saveUserToDatabase({
            displayName: user.fullName || user.username || '',
            profileImage: user.imageUrl,
          })
        } catch (error) {
          toast.error('Failed to sync user profile')
          console.error(error)
        } finally {
          setIsSyncing(false)
        }
      }
    }

    syncUser()
  }, [isLoaded, user])

  if (!isLoaded || isSyncing) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ClerkUserProfile
      appearance={{
        ...appearance,
        baseTheme:
          theme === 'system' || theme === 'dark' ? dark : appearance.baseTheme,
        variables: {
          ...appearance.variables,
          colorBackground: theme === 'light' ? '#fafafa' : '#1a1a1a',
        },
      }}
    />
  )
}
