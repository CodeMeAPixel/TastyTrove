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
  title: 'Terms of Service',
  description: 'Terms of Service for Tasty Trove - A modern recipe sharing platform',
}

export default function TermsPage() {
  return (
    <Shell>
      <div>
        <PageHeader>
          <PageHeaderHeading>Terms of Service</PageHeaderHeading>
          <PageHeaderDescription>
            Please read these terms carefully before using Tasty Trove
          </PageHeaderDescription>
        </PageHeader>
        <section className="mx-auto mt-8 space-y-6 text-base text-foreground/90">
          <p>
            <strong>Last Updated:</strong> May 12, 2025
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">1. Introduction</h2>
          <p>
            Welcome to Tasty Trove ("we," "our," or "us"). By accessing or using our website, mobile application, 
            or any other platform or service we provide (collectively, the "Service"), you agree to be bound by 
            these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">2. Eligibility</h2>
          <p>
            You must be at least 16 years old to use the Service. By using the Service, you represent and warrant 
            that you meet this requirement. If you are under 18, you represent that you have your parent or guardian's 
            permission to use the Service and that they have read and agree to these Terms on your behalf.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information at all 
            times. You are solely responsible for maintaining the confidentiality of your account and password and 
            for restricting access to your computer or device. You agree to accept responsibility for all activities 
            that occur under your account.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">4. User-Generated Content</h2>
          <p>
            Our Service allows you to post, share, and otherwise make available recipes, images, text, and other 
            materials ("Content"). You are responsible for the Content that you post, including its legality, 
            reliability, and appropriateness.
          </p>
          <p>
            By posting Content on or through the Service, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              The Content is yours (you own it) or you have the right to use it and grant us the rights and license 
              as provided in these Terms.
            </li>
            <li>
              The posting of your Content on or through the Service does not violate the privacy rights, publicity 
              rights, copyrights, contract rights, or any other rights of any person.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">5. Content License</h2>
          <p>
            By posting Content, you grant us a non-exclusive, worldwide, royalty-free, sublicensable, and transferable 
            license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, 
            and display your Content in connection with the Service and our business, including for promoting the Service.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">6. Prohibited Uses</h2>
          <p>
            You agree not to use the Service for any purpose that is unlawful or prohibited by these Terms. Prohibited 
            activities include but are not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Using the Service for any illegal purpose or to violate any laws.
            </li>
            <li>
              Posting unauthorized commercial communications or engaging in commercial activities without our prior 
              written consent.
            </li>
            <li>
              Impersonating another person or creating a false identity.
            </li>
            <li>
              Harassing, bullying, intimidating, or stalking any user.
            </li>
            <li>
              Posting content that is hateful, threatening, pornographic, or that incites violence.
            </li>
            <li>
              Attempting to gain unauthorized access to the Service or other users' accounts.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">7. Intellectual Property Rights</h2>
          <p>
            The Service and its original content (excluding user-generated Content), features, and functionality are 
            and will remain the exclusive property of Tasty Trove and its licensors. The Service is protected by copyright, 
            trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or 
            service without our prior written consent.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
            liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
            limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using 
            the Service or contact us to request account deletion.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">9. Limitation of Liability</h2>
          <p>
            In no event shall Tasty Trove, its directors, employees, partners, agents, suppliers, or affiliates be liable 
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss 
            of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Your access to or use of or inability to access or use the Service.
            </li>
            <li>
              Any conduct or content of any third party on the Service.
            </li>
            <li>
              Any content obtained from the Service.
            </li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or content.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">10. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. 
            The Service is provided without warranties of any kind, whether express or implied, including, but not limited 
            to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of 
            performance.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of Alberta, Canada, without regard to 
            its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
            considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable, 
            the remaining provisions will remain in effect.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
            provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
            will be determined at our sole discretion. By continuing to access or use our Service after any revisions 
            become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            <a href={`mailto:${siteConfig.emails.legal}`} className="underline hover:text-pink-accent font-semibold">
              {siteConfig.emails.legal}
            </a>
          </p>
        </section>
      </div>
    </Shell>
  )
}
