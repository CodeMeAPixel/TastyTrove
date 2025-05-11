/* eslint-disable deprecation/deprecation */
import Link from 'next/link'
import { Github } from 'lucide-react'
import { FaDiscord, FaTwitter } from 'react-icons/fa'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Shell } from '../shell'
import { buttonVariants } from '../ui/button'

const SiteFooter = () => {
  return (
    <footer className='bg-background w-full border-t h-fit mt-10'>
      <Shell>
        <section
          id='footer-bottom'
          aria-labelledby='footer-bottom-heading'
          className='flex flex-col items-center justify-between gap-4 py-6 sm:flex-row'
        >
          <div className='text-muted-foreground text-sm text-center sm:text-left w-full sm:w-auto'>
            &copy; {new Date().getFullYear()} ByteBrush Studios. All rights reserved.
          </div>
          <div className='flex items-center justify-center space-x-2 w-full sm:w-auto'>
            <Link
              href={siteConfig.sourceCode}
              target='_blank'
              rel='noreferrer'
              className={cn(
                buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                }),
              )}
            >
              <Github className='size-4' aria-hidden='true' />
              <span className='sr-only'>GitHub</span>
            </Link>
            <Link
              href={siteConfig.twitterUrl}
              target='_blank'
              rel='noreferrer'
              className={cn(
                buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                }),
              )}
            >
              <FaTwitter className='size-4' aria-hidden='true' />
              <span className='sr-only'>Twitter</span>
            </Link>
            <Link
              href={siteConfig.discordUrl}
              target='_blank'
              rel='noreferrer'
              className={cn(
                buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                }),
              )}
            >
              <FaDiscord className='size-4' aria-hidden='true' />
              <span className='sr-only'>Discord</span>
            </Link>
          </div>
        </section>
      </Shell>
    </footer>
  )
}
export default SiteFooter
