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
  title: 'Privacy Policy',
  description: 'Privacy Policy for Tasty Trove - Learn how we handle your personal information',
}

export default function PrivacyPage() {
  return (
    <Shell>
      <div>
        <PageHeader>
          <PageHeaderHeading>Privacy Policy</PageHeaderHeading>
          <PageHeaderDescription>
            How we collect, use, and protect your personal information
          </PageHeaderDescription>
        </PageHeader>
        <section className="mx-auto mt-8 space-y-6 text-base text-foreground/90">
          <p>
            <strong>Last Updated:</strong> May 12, 2025
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">1. Introduction</h2>
          <p>
            Tasty Trove ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our website, mobile application, or any other platform or 
            service we provide (collectively, the "Service"). Please read this privacy policy carefully. If you disagree with its 
            terms, please discontinue use of our Service immediately.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and profile 
              picture that you provide when registering or using our Service.
            </li>
            <li>
              <strong>User Content:</strong> Recipes, images, comments, and other materials you post to the Service.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use the Service, such as pages visited, time spent on the 
              Service, and other statistical data.
            </li>
            <li>
              <strong>Device Information:</strong> Information about your device, including IP address, browser type, operating 
              system, and device identifiers.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to collect 
              information about your browsing activities and preferences.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">3. How We Use Your Information</h2>
          <p>
            We may use the information we collect from you for various purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our Service, including registering you as a user, managing your account, and customizing your experience.</li>
            <li>To process and respond to your inquiries, comments, feedback, or questions.</li>
            <li>To send administrative information, such as updates, security alerts, and support messages.</li>
            <li>To analyze usage patterns and trends to improve our Service and develop new features.</li>
            <li>To detect, prevent, and address technical issues, security breaches, or illegal activities.</li>
            <li>To comply with legal obligations and resolve any disputes.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">4. Sharing Your Information</h2>
          <p>
            We may share your personal information in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, and other 
              partners who perform services on our behalf, such as hosting, data analytics, email delivery, and marketing assistance.
            </li>
            <li>
              <strong>For Legal Reasons:</strong> We may disclose your information where required by law or if we believe that such action 
              is necessary to comply with legal obligations, protect our rights, or investigate potential violations of our Terms of Service.
            </li>
            <li>
              <strong>With Your Consent:</strong> We may share your information with third parties when you have explicitly consented to such sharing.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, user information 
              may be among the transferred assets.
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">5. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, 
            disclosure, alteration, or destruction. However, no internet or email transmission is ever fully secure or error-free, and we 
            cannot guarantee absolute security.
          </p>
          <p>
            Your personal information is stored on secure servers located primarily in Canada and the United States. When we transfer data 
            internationally, we take steps to ensure adequate safeguards are in place to protect your information.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">6. Data Retention</h2>
          <p>
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We 
            will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce 
            our legal agreements and policies.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access your personal information.</li>
            <li>The right to rectify inaccurate or incomplete information.</li>
            <li>The right to erase your personal information.</li>
            <li>The right to restrict the processing of your personal information.</li>
            <li>The right to data portability (receiving a copy of your personal information).</li>
            <li>The right to object to the processing of your personal information.</li>
            <li>The right to withdraw consent at any time, where we relied on your consent to process your personal information.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">8. GDPR Compliance</h2>
          <p>
            For users in the European Economic Area (EEA), we act as a data controller of your personal information. The legal bases we rely 
            on for processing your information include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Performance of a contract when we provide you with the Service.</li>
            <li>Consent you provide where required by law.</li>
            <li>Legitimate interests, which are not overridden by your data protection interests.</li>
            <li>Compliance with legal obligations.</li>
          </ul>
          <p>
            To exercise your rights under the General Data Protection Regulation (GDPR), please contact us using the information provided below.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">9. CCPA Compliance</h2>
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with specific rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to know what personal information we collect, use, disclose, and sell.</li>
            <li>The right to request the deletion of your personal information.</li>
            <li>The right to opt-out of the sale of your personal information.</li>
            <li>The right to non-discrimination for exercising your CCPA rights.</li>
          </ul>
          <p>
            In the preceding 12 months, we have collected the categories of personal information described in Section 2. We do not sell your 
            personal information. To exercise your rights under the CCPA, please contact us using the information provided below.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">10. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under 16 years of age. We do not knowingly collect personal information from children under 16. 
            If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that 
            we can take necessary actions.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">11. Third-Party Links and Services</h2>
          <p>
            Our Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and 
            assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to 
            review the privacy policies of any website you visit.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">12. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this 
            Privacy Policy are effective when they are posted on this page.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">13. Governing Law</h2>
          <p>
            This Privacy Policy shall be governed by and construed in accordance with the laws of Alberta, Canada, without regard to its conflict 
            of law provisions.
          </p>
          
          <h2 className="text-2xl font-bold mt-6 mb-3">14. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <a href={`mailto:${siteConfig.emails.legal}`} className="underline hover:text-pink-accent font-semibold">
              {siteConfig.emails.legal}
            </a>
          </p>
          <p>
            For data subject requests and concerns about your personal information, please email:
          </p>
          <p className="mt-2">
            <a href={`mailto:${siteConfig.emails.dpo}`} className="underline hover:text-pink-accent font-semibold">
              {siteConfig.emails.dpo}
            </a>
          </p>
        </section>
      </div>
    </Shell>
  )
}
