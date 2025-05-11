import type { Metadata } from 'next'

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import { Shell } from '@/components/shell'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? ''),
  title: 'About',
  description: 'About the Recipes',
}

export default function AboutPage() {
  return (
    <Shell>
      <div>
        <PageHeader>
          <PageHeaderHeading>About Tasty Trove</PageHeaderHeading>
          <PageHeaderDescription>
            Discover, upload, and share your favorite recipes with the world.
          </PageHeaderDescription>
        </PageHeader>
        <section className="max-w-2xl mx-auto mt-8 space-y-6 text-base text-foreground/90">
          <p>
            <strong>Tasty Trove</strong> is a community-driven platform for food
            lovers to explore, upload, and share recipes. Whether you&apos;re a
            home cook, a professional chef, or just looking for inspiration,
            Tasty Trove is your go-to destination for delicious ideas.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Browse a curated collection of recipes by category, difficulty, or
              prep time.
            </li>
            <li>
              Upload your own recipes with images, detailed steps, and ingredient
              lists.
            </li>
            <li>Save your favorite recipes and leave reviews for others.</li>
            <li>
              Share your creations with friends and the Tasty Trove community.
            </li>
          </ul>
          <p>
            <strong>How to contribute:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span>
                <strong>Add a recipe:</strong> Use the &quot;Add Recipe&quot; section
                of the dashboard to submit your culinary creations. Make sure to format your steps
                using new lines or hyphens, and use <code>**bold**</code> for
                emphasis.
              </span>
            </li>
            <li>
              <span>
                <strong>Engage:</strong> Save, review, and share recipes you love.
              </span>
            </li>
            <li>
              <span>
                <strong>Connect:</strong> Join our community on Discord or follow
                us on Twitter for updates and inspiration.
              </span>
            </li>
          </ul>
          <p>
            Tasty Trove is built by{' '}
            <a
              href="https://codemeapixel.dev"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-pink-accent font-semibold"
            >
              Pixelated (CodeMeAPixel)
            </a>{' '}
            and the ByteBrush Studios team. We&apos;re passionate about making
            cooking accessible and fun for everyone.
          </p>
          <p>
            Have questions? Visit our{' '}
            <a
              href="/faqs"
              className="underline hover:text-pink-accent font-semibold"
            >
              FAQs
            </a>{' '}
            or reach out on our social channels.
          </p>
        </section>
      </div>
    </Shell>
  )
}
