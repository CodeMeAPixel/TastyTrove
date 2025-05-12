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
  description: 'About Tasty Trove - A modern recipe sharing platform',
}

export default function AboutPage() {
  return (
    <Shell>
      <div>
        <PageHeader>
          <PageHeaderHeading>About Tasty Trove</PageHeaderHeading>
          <PageHeaderDescription>
            Your ultimate platform for discovering, creating, and sharing delicious recipes
          </PageHeaderDescription>
        </PageHeader>
        <section className="mx-auto mt-8 space-y-6 text-base text-foreground/90">
          <p>
            <strong>Tasty Trove</strong> is a community-driven platform designed for food
            enthusiasts to explore, create, organize, and share recipes. Whether you&apos;re a
            home cook looking for inspiration, a professional chef sharing your expertise,
            or simply someone who loves good food, Tasty Trove offers the tools and community
            to enhance your culinary journey.
          </p>
          
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <span>
                <strong>Recipe Discovery:</strong> Browse our growing collection of recipes by category, 
                difficulty, preparation time, and cuisine.
              </span>
            </li>
            <li>
              <span>
                <strong>Recipe Creation:</strong> Easily create and publish your own recipes with our 
                intuitive editor, including support for multiple images, detailed ingredients, and step-by-step instructions.
              </span>
            </li>
            <li>
              <span>
                <strong>Cookbook Organization:</strong> Create custom cookbooks to organize recipes 
                by theme, occasion, or any way you prefer. Keep them private or share with the community.
              </span>
            </li>
            <li>
              <span>
                <strong>Save Favorites:</strong> Build your personal collection by saving recipes you love 
                for quick access later.
              </span>
            </li>
            <li>
              <span>
                <strong>User Profiles:</strong> Customize your profile, follow other chefs, and build your culinary community.
              </span>
            </li>
          </ul>
          
          <p>
            <strong>How to Get Started:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span>
                <strong>Create an Account:</strong> Sign up to unlock all features including recipe creation, 
                cookbooks, and saving favorites.
              </span>
            </li>
            <li>
              <span>
                <strong>Explore Recipes:</strong> Browse by category or use our advanced filters to discover 
                recipes that match your preferences.
              </span>
            </li>
            <li>
              <span>
                <strong>Create a Recipe:</strong> Navigate to your dashboard and select "Add Recipe" to share your 
                culinary creations. Format your steps using new lines and use <code>**bold**</code> for 
                emphasis on important instructions.
              </span>
            </li>
            <li>
              <span>
                <strong>Organize with Cookbooks:</strong> Create themed collections of recipes through the 
                cookbooks feature in your dashboard.
              </span>
            </li>
            <li>
              <span>
                <strong>Connect:</strong> Follow other users, join our Discord community, or connect 
                with us on Twitter for updates and inspiration.
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
              ByteBrush Studios
            </a>{' '}
            using modern web technologies including Next.js 15, React 19, Drizzle ORM, and PostgreSQL. 
            We&apos;re passionate about creating tools that make cooking more accessible, organized, and 
            enjoyable for everyone.
          </p>
          
          <p>
            Have questions or suggestions? Visit our{' '}
            <a
              href="/faqs"
              className="underline hover:text-pink-accent font-semibold"
            >
              FAQs
            </a>{' '}
            or reach out through our{' '}
            <a 
              href="https://discord.gg/Vv2bdC44Ge" 
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-pink-accent font-semibold"
            >
              Discord community
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  )
}
