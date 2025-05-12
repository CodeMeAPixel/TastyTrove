import type { Metadata } from 'next'

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import { Shell } from '@/components/shell'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? ''),
  title: 'Usage License',
  description: 'Usage License for Tasty Trove - Understanding how you can use our content',
}

export default function UsageLicensePage() {
  return (
    <Shell>
      <div>
        <PageHeader>
          <PageHeaderHeading>Usage License</PageHeaderHeading>
          <PageHeaderDescription>
            Guidelines for using and sharing content from Tasty Trove
          </PageHeaderDescription>
        </PageHeader>
        <section className="mx-auto mt-8 space-y-6 text-base text-foreground/90">
          <p>
            <strong>Last Updated:</strong> May 12, 2025
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">1. Introduction</h2>
          <p>
            This Usage License ("License") governs your rights to use content available on Tasty Trove ("we," "our," or "us"). 
            By accessing or using our website, mobile application, or any other platform or service we provide (collectively, the "Service"), 
            you agree to be bound by the terms of this License. If you do not agree to these terms, please do not use our Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">2. Types of Content</h2>
          <p>
            For the purposes of this License, we distinguish between two types of content:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Platform Content:</strong> Content created by Tasty Trove, including but not limited to the Service itself, 
              its design, features, functionality, text, logos, icons, and software.
            </li>
            <li>
              <strong>User Content:</strong> Content created and uploaded by users of the Service, including but not limited to recipes, 
              images, text, comments, and other materials posted to the Service.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">3. Platform Content License</h2>
          <p>
            Subject to your compliance with this License and our Terms of Service, we grant you a limited, non-exclusive, non-transferable, 
            non-sublicensable license to access and use the Platform Content solely for your personal, non-commercial use. You may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Reproduce, distribute, display, or perform the Platform Content except as permitted herein.</li>
            <li>Modify or create derivative works based upon the Platform Content.</li>
            <li>Use the Platform Content for commercial purposes.</li>
            <li>Decompile, reverse engineer, or disassemble any software component of the Platform Content.</li>
            <li>Remove any copyright, trademark, or other proprietary notices from the Platform Content.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">4. User Content License</h2>
          <p>
            When users post Content on or through the Service, they grant us and other users certain rights as described below:
          </p>
          <h3 className="text-xl font-bold mt-4 mb-2">4.1 License to Tasty Trove</h3>
          <p>
            By posting User Content on or through the Service, users grant us a worldwide, non-exclusive, royalty-free license 
            (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and 
            distribute such content in any and all media or distribution methods now known or later developed, and to use the 
            content for promotional purposes.
          </p>
          
          <h3 className="text-xl font-bold mt-4 mb-2">4.2 License to Other Users</h3>
          <p>
            By posting User Content on or through public areas of the Service, users also grant all other users of the Service a 
            non-exclusive license to access and use that User Content as permitted through the functionality of the Service and 
            under this License.
          </p>
          
          <h3 className="text-xl font-bold mt-4 mb-2">4.3 Personal Use of Recipes</h3>
          <p>
            Users may use recipes found on the Service for personal, non-commercial purposes. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Viewing, saving, and cooking recipes for personal enjoyment.</li>
            <li>Printing or saving recipes for personal reference.</li>
            <li>Sharing recipes with friends and family for personal use.</li>
            <li>Making modifications to recipes for personal use.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-4 mb-2">4.4 Commercial Use Restrictions</h3>
          <p>
            Unless explicitly permitted by the content creator or Tasty Trove, users may not use recipes or other User Content for commercial purposes, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publishing recipes in a cookbook or other publication for sale.</li>
            <li>Using recipes in a commercial food establishment.</li>
            <li>Teaching cooking classes using recipes from the Service without permission.</li>
            <li>Creating derivative products based on recipes from the Service for sale.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">5. Attribution Requirements</h2>
          <p>
            When sharing or using recipes or other User Content outside the Service in a manner permitted by this License, 
            proper attribution must be provided. Attribution should include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The name of the original creator, if available.</li>
            <li>Reference to Tasty Trove as the source platform.</li>
            <li>A link to the original content on Tasty Trove, when possible.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">6. Copyright Claims</h2>
          <p>
            If you believe that your copyrighted work has been used or displayed on our Service in a way that constitutes copyright 
            infringement, please notify us immediately. We respect the intellectual property rights of others and will respond to 
            notices of alleged copyright infringement in accordance with applicable law.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">7. Termination of License</h2>
          <p>
            This License is effective until terminated by either you or us. You may terminate this License at any time by discontinuing 
            use of our Service and destroying all materials obtained from the Service. We may terminate this License at any time without 
            notice if you fail to comply with any term of this License or our Terms of Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">8. Governing Law</h2>
          <p>
            This License shall be governed by and construed in accordance with the laws of Alberta, Canada, without regard to its 
            conflict of law provisions. Any legal action or proceeding relating to your access to, or use of, the Service or this License 
            shall be instituted in a court of competent jurisdiction in Alberta, Canada.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">9. Changes to this License</h2>
          <p>
            We reserve the right to modify this License at any time. We will notify users of any material changes by updating the "Last Updated" 
            date at the top of this License. Your continued use of the Service after any changes to this License will constitute your acceptance 
            of such changes.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about this License or desire to obtain permission for uses not granted by this License, please contact us at:
          </p>
          <p className="mt-2">
            <a href={`mailto:${siteConfig.emails.licensing}`} className="underline hover:text-pink-accent font-semibold">
              {siteConfig.emails.licensing}
            </a>
          </p>
        </section>
      </div>
    </Shell>
  )
}
