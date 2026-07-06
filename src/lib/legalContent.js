import { COMPANY } from './marketingContent';

export const POLICIES = {
  terms: {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `Welcome to ${COMPANY.name}. These Terms and Conditions ("Terms") govern your access to and use of the ${COMPANY.name} website, console, API gateway, and related services (the "Service") operated from ${COMPANY.jurisdiction}. By creating an account or otherwise using the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not access or use the Service.`,
    sections: [
      { title: '1. Definitions', body: [
        `"Service" refers to the ${COMPANY.name} platform, including the web console, API gateway, subkey management, analytics dashboard, and any related features we make available.`,
        `"Customer", "you", and "your" refer to the individual or entity that creates or uses an account on the Service.`,
        '"Subkey" refers to a scoped credential derived by the Service to proxy requests to an upstream provider API on your behalf.',
        '"Master Key" refers to an upstream provider API key that you import into the Service to enable proxying.',
        '"Provider" refers to the operator of an upstream API service (for example OpenAI, Anthropic, or Google Vertex).',
        '"Razorpay" refers to Razorpay Software Private Limited, our third-party payment processor.',
        '"Fees" refers to the subscription charges for paid plans as displayed at checkout.',
      ]},
      { title: '2. Acceptance of Terms', body: [
        `By accessing or using the Service, you agree to these Terms and our Privacy Policy. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and references to "you" include that organization.`,
        'If you do not agree to these Terms, you must not access or use the Service. We may update these Terms from time to time; continued use of the Service after changes become effective constitutes acceptance of the revised Terms.',
      ]},
      { title: '3. Service Description', body: [
        `${COMPANY.name} is an API access governance platform that converts your Master Keys for upstream providers into revocable Subkeys with configurable controls, including token ceilings, maximum request counts, rate limits, expiry windows, and model allowlists.`,
        'The Service proxies requests made with your Subkeys to the relevant upstream Provider, records request logs, token usage, latency, cost estimates, and provider errors for inspection in the web console, and applies the limits you configure.',
        'We do not guarantee that any specific upstream Provider will remain available, continue to accept your Master Key, or honor the same pricing. You remain solely responsible for your relationship with each upstream Provider, including compliance with that Provider\'s own terms of service.',
      ]},
      { title: '4. Account Registration and Eligibility', body: [
        'You must be at least 18 years old and legally capable of entering into binding contracts to create an account. You agree to provide accurate, current, and complete information during registration and to keep that information updated.',
        'You may not create an account on behalf of another person or entity without their authorization. Each account is tied to a single natural person or organization; sharing login credentials across distinct users is not supported and may result in suspension.',
        'We reserve the right to suspend or terminate accounts that provide false, inaccurate, or incomplete information, or that exhibit activity we reasonably believe to be unauthorized, fraudulent, or in violation of these Terms.',
      ]},
      { title: '5. Accounts and Security', body: [
        'You are responsible for maintaining the confidentiality of your login credentials, API Master Keys, generated Subkeys, workspace access tokens, and all activity that occurs under your account.',
        'Subkeys are credentials. Treat them as secrets — do not commit them to source control, embed them in client-side code, or share them in unencrypted channels. You are responsible for all use of a Subkey issued under your account until you revoke it.',
        `You agree to notify us immediately at ${COMPANY.supportEmail} of any unauthorized use of your account, Master Key, or Subkey, or any other security breach. We are not liable for any loss or damage arising from your failure to comply with this section.`,
      ]},
      { title: '6. Acceptable Use Policy', body: [
        'You agree that you will not, and will not permit any third party to, use the Service to:',
        '• Violate any applicable local, national, or international law or regulation, including sanctions, export control, or data protection laws;',
        '• Infringe on the intellectual property, privacy, or other rights of any person or entity;',
        '• Abuse, overload, attack, or interfere with any upstream Provider\'s service, including credential theft, scraping, or unauthorized resale of provider capacity;',
        '• Attempt to bypass, reverse engineer, or circumvent limits, rate caps, or technical controls enforced by the Service or any Provider;',
        '• Send spam, distribute malware, or conduct any form of cyberattack through the Service;',
        '• Resell, sublicense, or repackage access to the Service without written authorization from us.',
        'We reserve the right to suspend access immediately and without notice where we reasonably suspect a breach of this section.',
      ]},
      { title: '7. Subscriptions, Fees, and Billing', body: [
        'Paid plans are billed in advance at the rates displayed on the pricing page and confirmed at checkout. All Fees are quoted in USD unless otherwise stated. Payment is processed by Razorpay, our authorized third-party payment processor.',
        'By subscribing to a paid plan, you authorize Razorpay to charge the stated Fees to your selected payment method on a recurring basis according to your billing cycle (monthly or annual). Subscription status and access limits are activated after successful payment confirmation.',
        'We may change Fees upon reasonable notice. Changes to Fees will take effect at the start of your next billing cycle following the notice. If you do not agree with a Fee change, you may cancel your subscription before the next billing cycle; otherwise the new Fees will apply.',
        'Taxes, where applicable, are added to Fees at the prevailing rate in your jurisdiction and are collected on behalf of the relevant authority. Payment is due in full at the time billed and is non-refundable except as described in our Refund and Cancellation Policy.',
      ]},
      { title: '8. Upstream Provider Costs', body: [
        `Your use of upstream Providers through the Service may incur separate charges billed directly by those Providers to your account with them. ${COMPANY.name} does not pay, mark up, or reconcile these Provider charges.`,
        'You are solely responsible for monitoring and paying your own Provider invoices. Token limit controls enforced by the Service are best-effort guardrails and are not a guarantee against upstream charges.',
      ]},
      { title: '9. Refunds and Cancellation', body: [
        `You may cancel a paid subscription at any time from the billing console or by contacting ${COMPANY.supportEmail}. Cancellation prevents future renewals but does not automatically refund Fees for the current billing period except where required by law or as described in our Refund and Cancellation Policy.`,
        'Refund eligibility, processing timelines, and applicable conditions are governed exclusively by our Refund and Cancellation Policy, which is incorporated into these Terms by reference.',
      ]},
      { title: '10. Free Trials and Promotional Access', body: [
        'From time to time, we may offer free trials, promotional credits, or discounted access. We may modify, suspend, or terminate such promotions at any time without prior notice. Promotional access has no cash value and is not refundable.',
        'Abuse of promotional offers — including creating multiple accounts to extend trials — may result in immediate suspension of access and forfeiture of any associated credits.',
      ]},
      { title: '11. Intellectual Property', body: [
        `The Service, including all software, design, logos, dashboards, documentation, and other content, is the property of ${COMPANY.name} or its licensors and is protected by applicable intellectual property laws. Nothing in these Terms grants you any right, title, or interest in the Service except the limited right to use it in accordance with these Terms.`,
        'Feedback, suggestions, or ideas you provide about the Service may be used by us without restriction or compensation.',
      ]},
      { title: '12. Customer Content', body: [
        'You retain ownership of all Master Keys, Subkeys, configuration data, prompt content, and request payloads you submit through the Service ("Customer Content").',
        'You grant us a limited, worldwide, non-exclusive license to process Customer Content solely as necessary to operate the Service, including proxying requests to Providers, computing usage analytics, displaying logs, and enforcing limits.',
        'We will not access, review, or share Customer Content except as needed to operate the Service, to prevent abuse, to respond to a verifiable legal request, or as described in our Privacy Policy.',
      ]},
      { title: '13. Disclaimers', body: [
        'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, we disclaim all warranties, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.',
        'We do not warrant that the Service will be uninterrupted, secure, error-free, or that any request will reach an upstream Provider successfully. You use the Service at your own risk.',
      ]},
      { title: '14. Limitation of Liability', body: [
        'To the maximum extent permitted by law, in no event shall Lethem, its officers, directors, employees, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, use, or goodwill, arising out of or related to your use of the Service.',
        'Our total aggregate liability for any claim arising out of or related to the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the event giving rise to the claim.',
      ]},
      { title: '15. Governing Law and Disputes', body: [
        `These Terms are governed by the laws of India, without regard to conflict of law principles. Any dispute arising out of or related to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in ${COMPANY.jurisdiction}.`,
      ]},
      { title: '16. Changes to These Terms', body: [
        'We may revise these Terms from time to time. The most current version will always be available on this page with the "Last updated" date above. Material changes will be communicated via the Service or by email.',
      ]},
      { title: '17. Contact', body: [
        `If you have any questions about these Terms, please contact us at ${COMPANY.supportEmail}.`,
      ]},
    ],
  },
  privacy: {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `${COMPANY.name} ("we", "us", or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, console, API gateway, and related services (the "Service"). We process data in accordance with applicable data protection laws, including the Digital Personal Data Protection Act, 2023 (India) and the General Data Protection Regulation (GDPR) where applicable.`,
    sections: [
      { title: '1. Information We Collect', body: [
        'Account information: name, email address, and authentication metadata provided by your identity provider (Auth0) when you sign in.',
        'Project and key metadata: project names, provider identifiers, subkey names and usage counters, master key fingerprints (never the raw key), and configuration settings you create.',
        'Usage and log data: request logs, token counts, latency measurements, provider errors, and cost estimates generated as part of proxying requests on your behalf.',
        'Technical data: IP address, browser type, and access timestamps collected automatically when you interact with the Service.',
      ]},
      { title: '2. How We Use Your Information', body: [
        'To operate, maintain, and improve the Service, including authenticating you, proxying requests, enforcing limits, and displaying analytics.',
        'To process payments and manage subscriptions through our payment processor, Razorpay.',
        'To detect, prevent, and address fraud, abuse, and security issues.',
        'To communicate with you about your account, updates, and important notices.',
      ]},
      { title: '3. Master Keys and Subkeys', body: [
        'Master provider API keys you import are encrypted at rest using industry-standard encryption and are never returned in any API response or log. They are only decrypted server-side, in memory, at the moment a request is proxied.',
        'Subkeys are derived credentials. We store only hashed or masked representations for display; the full token is shown once at creation and is never stored in plaintext.',
      ]},
      { title: '4. Data Sharing and Sub-Processors', body: [
        'We do not sell your information. We share data only with service providers who act on our behalf under written agreements: Auth0 (authentication), Razorpay (payments), and cloud infrastructure providers (hosting and databases).',
        'We may disclose information when required by law or to protect our rights, property, or safety, or that of our users.',
      ]},
      { title: '5. Data Retention', body: [
        'Request logs are retained according to your plan (30, 90, or extended days). Account data is retained for the lifetime of your account and deleted within 30 days of account closure, except where retention is required by law.',
      ]},
      { title: '6. Your Rights', body: [
        'Depending on your jurisdiction, you may have the right to access, correct, export, or delete your personal data. To exercise these rights, contact us at support@lethem.app.',
      ]},
      { title: '7. Security', body: [
        'We implement appropriate technical and organizational measures to protect your data, including encryption in transit (TLS) and at rest, access controls, and regular security reviews. However, no method of transmission over the internet is completely secure.',
      ]},
      { title: '8. Contact', body: [
        `For privacy questions or requests, contact us at ${COMPANY.supportEmail}.`,
      ]},
    ],
  },
  refund: {
    slug: 'refund-and-cancellation-policy',
    title: 'Refund and Cancellation Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `This Refund and Cancellation Policy explains the terms under which you may cancel your ${COMPANY.name} subscription and request a refund. Payments are processed by Razorpay, and this policy applies to all paid plans.`,
    sections: [
      { title: '1. Cancellation', body: [
        'You may cancel your subscription at any time from the billing console or by contacting support@lethem.app. Cancellation takes effect at the end of your current billing cycle and prevents future renewals.',
        'Upon cancellation, you retain access to paid features until the end of the current billing period.',
      ]},
      { title: '2. Refund Eligibility', body: [
        'Subscription fees are generally non-refundable. However, refunds may be considered under the following circumstances:',
        '• A request is made within 7 days of the initial subscription purchase, and the usage during that period is minimal;',
        '• A duplicate or erroneous charge has occurred;',
        '• Required by applicable law in your jurisdiction.',
      ]},
      { title: '3. Refund Process', body: [
        `To request a refund, email ${COMPANY.supportEmail} with your account details and the reason for the request. Approved refunds are processed back to the original payment method within 7–10 business days, subject to Razorpay's processing timelines.`,
      ]},
      { title: '4. Upstream Provider Charges', body: [
        `${COMPANY.name} does not refund or reconcile charges billed by upstream providers (OpenAI, Anthropic, etc.). Those charges are governed by the respective provider's terms.`,
      ]},
      { title: '5. Contact', body: [
        `For refund questions, contact ${COMPANY.supportEmail}.`,
      ]},
    ],
  },
  shipping: {
    slug: 'shipping-delivery-policy',
    title: 'Shipping / Delivery Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `${COMPANY.name} is a fully digital software-as-a-service product. We do not ship physical goods, and no physical delivery is involved.`,
    sections: [
      { title: '1. Digital Delivery', body: [
        'All services are delivered digitally and made available immediately upon successful account creation and, where applicable, payment confirmation.',
        'You access the Service through your web browser at the console URL provided after sign-up.',
      ]},
      { title: '2. No Shipping Charges', body: [
        'There are no shipping, handling, or delivery charges associated with any plan or purchase on Lethem.',
      ]},
      { title: '3. Contact', body: [
        `For questions about access or delivery of the digital service, contact ${COMPANY.supportEmail}.`,
      ]},
    ],
  },
};