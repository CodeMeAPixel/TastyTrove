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
    <footer className='bg-background w-full border-t h-fit mt-20'>
      <Shell>
        {/* Main footer with navigation links */}
        <div className='grid grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand section */}
          <div className='flex flex-col space-y-4'>
            <h3 className='text-lg font-medium'>{siteConfig.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {siteConfig.description}
            </p>

            {/* Social links */}
            <div className='flex space-x-3 mt-2'>
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
          </div>

          {/* Navigation sections from footerNav */}
          {siteConfig.footerNav.map((section) => (
            <div key={section.title} className='space-y-4'>
              <h3 className='text-sm font-medium uppercase tracking-wider'>
                {section.title}
              </h3>
              <ul className='space-y-2'>
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and bottom section */}
        <div className='border-t py-6'>
          <div className='flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row'>
            <div>
              &copy; {new Date().getFullYear()} ByteBrush Studios. All rights
              reserved.
            </div>
            <div>
              Crafted with care by{' '}
              <a
                href='https://github.com/CodeMeAPixel'
                className='hover:text-foreground underline underline-offset-4'
              >
                CodeMeAPixel
              </a>
            </div>
          </div>
        </div>
      </Shell>
    </footer>
  )
}

export default SiteFooter
