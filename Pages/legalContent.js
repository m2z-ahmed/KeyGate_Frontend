import { COMPANY } from './marketingContent';

export const POLICIES= {
  terms: {
    slug: 'terms-and-conditions',
    title: 'Terms and Conditions',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `Welcome to ${COMPANY.name}. These Terms and Conditions ("Terms") govern your access to and use of the ${COMPANY.name} website, console, API gateway, and related services (the "Service") operated from ${COMPANY.jurisdiction}. By creating an account or otherwise using the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not access or use the Service.`,
    sections: [
      {
        title: '1. Definitions',
        body: [
          `"Service" refers to the ${COMPANY.name} platform, including the web console, API gateway, subkey management, analytics dashboard, and any related features we make available.`,
          `"Customer", "you", and "your" refer to the individual or entity that creates or uses an account on the Service.`,
          '"Subkey" refers to a scoped credential derived by the Service to proxy requests to an upstream provider API on your behalf.',
          '"Master Key" refers to an upstream provider API key that you import into the Service to enable proxying.',
          '"Provider" refers to the operator of an upstream API service (for example OpenAI, Anthropic, or Google Vertex).',
          '"Razorpay" refers to Razorpay Software Private Limited, our third-party payment processor.',
          '"Fees" refers to the subscription charges for paid plans as displayed at checkout.',
        ],
      },
      {
        title: '2. Acceptance of Terms',
        body: [
          `By accessing or using the Service, you agree to these Terms and our Privacy Policy. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and references to "you" include that organization.`,
          `If you do not agree to these Terms, you must not access or use the Service. We may update these Terms from time to time; continued use of the Service after changes become effective constitutes acceptance of the revised Terms.`,
        ],
      },
      {
        title: '3. Service Description',
        body: [
          `${COMPANY.name} is an API access governance platform that converts your Master Keys for upstream providers into revocable Subkeys with configurable controls, including token ceilings, maximum request counts, rate limits, expiry windows, and model allowlists.`,
          'The Service proxies requests made with your Subkeys to the relevant upstream Provider, records request logs, token usage, latency, cost estimates, and provider errors for inspection in the web console, and applies the limits you configure.',
          'We do not guarantee that any specific upstream Provider will remain available, continue to accept your Master Key, or honor the same pricing. You remain solely responsible for your relationship with each upstream Provider, including compliance with that Provider\'s own terms of service.',
        ],
      },
      {
        title: '4. Account Registration and Eligibility',
        body: [
          'You must be at least 18 years old and legally capable of entering into binding contracts to create an account. You agree to provide accurate, current, and complete information during registration and to keep that information updated.',
          'You may not create an account on behalf of another person or entity without their authorization. Each account is tied to a single natural person or organization; sharing login credentials across distinct users is not supported and may result in suspension.',
          'We reserve the right to suspend or terminate accounts that provide false, inaccurate, or incomplete information, or that exhibit activity we reasonably believe to be unauthorized, fraudulent, or in violation of these Terms.',
        ],
      },
      {
        title: '5. Accounts and Security',
        body: [
          'You are responsible for maintaining the confidentiality of your login credentials, API Master Keys, generated Subkeys, workspace access tokens, and all activity that occurs under your account.',
          'Subkeys are credentials. Treat them as secrets — do not commit them to source control, embed them in client-side code, or share them in unencrypted channels. You are responsible for all use of a Subkey issued under your account until you revoke it.',
          'You agree to notify us immediately at support@lethem.app of any unauthorized use of your account, Master Key, or Subkey, or any other security breach. We are not liable for any loss or damage arising from your failure to comply with this section.',
        ],
      },
      {
        title: '6. Acceptable Use Policy',
        body: [
          'You agree that you will not, and will not permit any third party to, use the Service to:',
          '• Violate any applicable local, national, or international law or regulation, including sanctions, export control, or data protection laws;',
          '• Infringe on the intellectual property, privacy, or other rights of any person or entity;',
          '• Abuse, overload, attack, or interfere with any upstream Provider\'s service, including credential theft, scraping, or unauthorized resale of provider capacity;',
          '• Attempt to bypass, reverse engineer, or circumvent limits, rate caps, or technical controls enforced by the Service or any Provider;',
          '• Send spam, distribute malware, or conduct any form of cyberattack through the Service;',
          '• Resell, sublicense, or repackage access to the Service without written authorization from us.',
          `We reserve the right to suspend access immediately and without notice where we reasonably suspect a breach of this section.`,
        ],
      },
      {
        title: '7. Subscriptions, Fees, and Billing',
        body: [
          'Paid plans are billed in advance at the rates displayed on the pricing page and confirmed at checkout. All Fees are quoted in USD unless otherwise stated. Payment is processed by Razorpay, our authorized third-party payment processor.',
          'By subscribing to a paid plan, you authorize Razorpay to charge the stated Fees to your selected payment method on a recurring basis according to your billing cycle (monthly or annual). Subscription status and access limits are activated after successful payment confirmation.',
          'We may change Fees upon reasonable notice. Changes to Fees will take effect at the start of your next billing cycle following the notice. If you do not agree with a Fee change, you may cancel your subscription before the next billing cycle; otherwise the new Fees will apply.',
          'Taxes, where applicable, are added to Fees at the prevailing rate in your jurisdiction and are collected on behalf of the relevant authority. Payment is due in full at the time billed and is non-refundable except as described in our Refund and Cancellation Policy.',
        ],
      },
      {
        title: '8. Upstream Provider Costs',
        body: [
          `Your use of upstream Providers through the Service may incur separate charges billed directly by those Providers to your account with them. ${COMPANY.name} does not pay, mark up, or reconcile these Provider charges.`,
          'You are solely responsible for monitoring and paying your own Provider invoices. Token limit controls enforced by the Service are best-effort guardrails and are not a guarantee against upstream charges.',
        ],
      },
      {
        title: '9. Refunds and Cancellation',
        body: [
          'You may cancel a paid subscription at any time from the billing console or by contacting support@lethem.app. Cancellation prevents future renewals but does not automatically refund Fees for the current billing period except where required by law or as described in our Refund and Cancellation Policy.',
          'Refund eligibility, processing timelines, and applicable conditions are governed exclusively by our Refund and Cancellation Policy, which is incorporated into these Terms by reference.',
        ],
      },
      {
        title: '10. Free Trials and Promotional Access',
        body: [
          'From time to time, we may offer free trials, promotional credits, or discounted access. We may modify, suspend, or terminate such promotions at any time without prior notice. Promotional access has no cash value and is not refundable.',
          'Abuse of promotional offers — including creating multiple accounts to extend trials — may result in immediate suspension of access and forfeiture of any associated credits.',
        ],
      },
      {
        title: '11. Intellectual Property',
        body: [
          `The Service, including all software, design, logos, dashboards, documentation, and other content, is the property of ${COMPANY.name} or its licensors and is protected by applicable intellectual property laws. Nothing in these Terms grants you any right, title, or interest in the Service except the limited right to use it in accordance with these Terms.`,
          'Feedback, suggestions, or ideas you provide about the Service may be used by us without restriction or compensation.',
        ],
      },
      {
        title: '12. Customer Content',
        body: [
          'You retain ownership of all Master Keys, Subkeys, configuration data, prompt content, and request payloads you submit through the Service ("Customer Content").',
          'You grant us a limited, worldwide, non-exclusive license to process Customer Content solely as necessary to operate the Service, including proxying requests to Providers, computing usage analytics, displaying logs, and enforcing limits.',
          'We will not access, review, or share Customer Content except as needed to operate the Service, to prevent abuse, to respond to a verifiable legal request, or as described in our Privacy Policy.',
        ],
      },
      {
        title: '13. Disclaimers',
        body: [
          'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by law, we disclaim all warranties, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.',
          'We do not warrant that the Service will be uninterrupted, secure, error-free, or that any request will reach an upstream Provider successfully. We do not warrant the accuracy of cost estimates, log retention, or analytics.',
          'Any reliance on the Service is at your own risk. You are responsible for taking reasonable steps to back up your own data and configurations.',
        ],
      },
      {
        title: '14. Limitation of Liability',
        body: [
          `To the maximum extent permitted by applicable law, in no event shall ${COMPANY.name}, its officers, directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost data, business interruption, or cost of substitute services, arising out of or related to the Service.`,
          `Our total aggregate liability for any claim arising out of or related to the Service shall not exceed the amount paid by you to ${COMPANY.name} in the twelve (12) months preceding the claim, or one hundred US dollars (USD 100), whichever is greater.`,
          'This limitation applies whether the claim is based on contract, tort (including negligence), strict liability, or any other legal theory, and even if we have been advised of the possibility of such damages.',
        ],
      },
      {
        title: '15. Indemnification',
        body: [
          `You agree to indemnify, defend, and hold harmless ${COMPANY.name} and its affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) your use of the Service; (b) your violation of these Terms or any law; (c) your violation of any third-party rights, including upstream Provider terms; or (d) any Customer Content you submit.`,
        ],
      },
      {
        title: '16. Termination',
        body: [
          'You may terminate your account at any time by contacting support@lethem.app or using account controls in the console. We may suspend or terminate your account immediately and without notice if we reasonably believe you have violated these Terms.',
          `Upon termination, your right to use the Service ceases immediately. We may delete your Customer Content and any associated data after a reasonable retention window. Sections that by their nature should survive termination (including Fees owed, intellectual property, disclaimers, and limitation of liability) will remain in effect.`,
        ],
      },
      {
        title: '17. Governing Law and Dispute Resolution',
        body: [
          `These Terms are governed by the laws of India, without regard to conflict of law principles. The courts at ${COMPANY.jurisdiction} shall have exclusive jurisdiction over any disputes arising out of or related to these Terms or the Service.`,
          'Before initiating legal proceedings, you agree to contact us at support@lethem.app and attempt in good faith to resolve the dispute informally for a period of thirty (30) days.',
        ],
      },
      {
        title: '18. Changes to These Terms',
        body: [
          'We may revise these Terms from time to time. We will post the updated Terms on this page and update the "Last updated" date. Material changes will be communicated by email or an in-product notice where feasible.',
          `Your continued use of the Service after the effective date of any change constitutes your acceptance of the revised Terms. If you do not agree, you must stop using the Service and cancel your subscription.`,
        ],
      },
      {
        title: '19. Severability',
        body: [
          'If any provision of these Terms is held by a court of competent jurisdiction to be unenforceable, the remaining provisions will remain in full force and effect.',
        ],
      },
      {
        title: '20. Contact Us',
        body: [
          `If you have any questions about these Terms, please contact us at support@lethem.app or write to ${COMPANY.name}, ${COMPANY.address}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `${COMPANY.name} ("we", "our", or "us") respects your privacy. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices you have. By using the Service, you consent to the practices described in this policy.`,
    sections: [
      {
        title: '1. Information We Collect',
        body: [
          'Account information — name, email address, organization name, password (hash), and role.',
          'Authentication identifiers — session tokens and login timestamps used to keep you signed in securely.',
          'Workspace and project metadata — project names, slugs, and configuration you create in the console.',
          'Master Keys and Subkeys — upstream provider API keys you import and the subkey credentials you generate. These are stored encrypted at rest and treated as secrets.',
          'Request logs — time, upstream provider, model, token counts, latency, provider response status, and an estimated cost per request. Prompt content sent through the proxy may be handled transiently to fulfill the request; we minimize retention of prompt payloads.',
          'Usage metrics — aggregate tokens, request counts, error counts, and rate-limit events per subkey, project, and account.',
          'Billing identifiers — plan, subscription status, billing cycle, payment method type, and the last four digits of your card where applicable. Full card numbers and bank account credentials are never stored by us.',
          'Support communications — emails, chat messages, and attachments you send to our support team.',
          'Technical data — IP address, browser type, device fingerprint, and access times collected from server logs and telemetry.',
        ],
      },
      {
        title: '2. How We Use Your Information',
        body: [
          'To authenticate users and manage account access, sessions, and password recovery.',
          'To operate the API gateway — proxying requests, enforcing token limits, rate limits, expiry windows, and model allowlists.',
          'To compute and display analytics, logs, and cost estimates in the console.',
          'To process subscription payments, issue invoices, detect fraud, and prevent chargebacks.',
          'To send service-related communications such as security alerts, billing receipts, and policy updates.',
          'To investigate abuse, prevent unauthorized access, and comply with our legal obligations.',
          'To respond to your support requests and improve the Service over time.',
        ],
      },
      {
        title: '3. How We Share Your Information',
        body: [
          'We do not sell your personal information. We share information only as described below:',
          'Service providers — trusted vendors who host infrastructure, provide authentication, run analytics, or store backups. These providers are bound by agreements requiring them to protect your data and to use it only for the purpose we engage them for.',
          'Payment processing — Razorpay processes your payments. Razorpay receives payment information directly and processes it under its own privacy policy; we receive only confirmation, plan status, and the last four digits of your card.',
          'Upstream providers — when you send a request through the Service, the relevant upstream provider receives the request payload (including prompts) needed to fulfill it. Use of upstream providers is governed by that provider\'s own privacy policy.',
          'Legal compliance — we may disclose information when required by law, court order, or government request, or to protect the rights, property, or safety of our users or others.',
          'Business transfers — in connection with a merger, acquisition, or asset sale, information may be transferred; we will notify you before your information is transferred and becomes subject to a different privacy policy.',
        ],
      },
      {
        title: '4. Payment Data and Razorpay',
        body: [
          'Payments are processed by Razorpay, our payment processor. When you make a payment, you interact directly with Razorpay\'s secure payment form. Razorpay handles your card number, expiry, CVV, and bank credentials in compliance with the Payment Card Industry Data Security Standard (PCI-DSS).',
          'We do not intentionally collect, store, or transmit full card numbers, CVVs, or bank login credentials. We may receive a transaction reference, payment status, and a masked card identifier for reconciliation and support.',
          'International card payments are supported where Razorpay permits them in your region. Currency conversion, if any, is handled by your card issuer or Razorpay under their published rates.',
        ],
      },
      {
        title: '5. Cookies and Similar Technologies',
        body: [
          'We use cookies and local storage to keep you signed in, remember preferences, measure traffic, and detect abuse. We do not use cookies for cross-site advertising.',
          'You can control cookies through your browser settings; disabling them may affect some features of the Service.',
        ],
      },
      {
        title: '6. Data Retention',
        body: [
          'We retain your data only as long as needed to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements:',
          '• Account information — until you request deletion or 30 days after your last login, whichever comes first.',
          '• Request logs and usage metrics — according to your plan\'s retention window (7 days for Free, 90 days for Pro, 1 year for Scale and Enterprise).',
          '• Subkeys — until revoked or 30 days after revocation, whichever comes first.',
          '• Billing records — as required by applicable tax and accounting laws, usually 7 years.',
          'When data is no longer needed, we securely delete or anonymize it.',
        ],
      },
      {
        title: '7. Data Security',
        body: [
          'We use industry-standard safeguards to protect your information: encryption in transit (TLS 1.2+), encryption at rest, scoped access controls, and regular security reviews.',
          'Master Keys and Subkeys are encrypted at rest and never returned in plaintext after creation. Subkeys are shown once at creation and cannot be retrieved again.',
          'No method of transmission or storage is completely secure. While we strive to protect your data, we cannot guarantee absolute security.',
        ],
      },
      {
        title: '8. Your Privacy Choices',
        body: [
          'You may access, update, correct, or request deletion of your personal information by contacting us at support@lethem.app. We will respond within thirty (30) days of receiving a verifiable request.',
          'You may withdraw consent for marketing communications at any time using the unsubscribe link in our emails.',
          'You may cancel your subscription and request account deletion from the console or by contacting support.',
        ],
      },
      {
        title: '9. International Transfers',
        body: [
          'Your information may be processed in countries other than your own, including India and the United States, where our service providers operate. Where required, we will put appropriate safeguards in place to ensure your information is protected to a standard equivalent to your home jurisdiction.',
        ],
      },
      {
        title: '10. Children\'s Privacy',
        body: [
          'The Service is not directed to children under 18, and we do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us at support@lethem.app and we will delete it.',
        ],
      },
      {
        title: '11. Changes to This Privacy Policy',
        body: [
          'We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the "Last updated" date. Material changes will be communicated by email or in-product notice where feasible.',
          'Your continued use of the Service after the effective date of any change constitutes your acceptance of the revised policy.',
        ],
      },
      {
        title: '12. Contact Us',
        body: [
          `If you have any questions about this Privacy Policy or your personal data, contact us at support@lethem.app or write to ${COMPANY.name}, ${COMPANY.address}.`,
        ],
      },
    ],
  },

  refund: {
    slug: 'refund-and-cancellation-policy',
    title: 'Refund and Cancellation Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `This Refund and Cancellation Policy explains how cancellations, refunds, and chargebacks work for subscriptions to ${COMPANY.name}. Payments are processed by Razorpay, our third-party payment processor. By subscribing to a paid plan, you agree to this policy.`,
    sections: [
      {
        title: '1. Subscription Model',
        body: [
          `${COMPANY.name} is a subscription-based software-as-a-service (SaaS). Plans are billed in advance on a monthly or annual cycle depending on your selection at checkout. Fees are processed in USD unless otherwise stated at checkout.`,
          'Access to paid plan features is activated immediately after successful payment confirmation and subscription verification by Razorpay.',
        ],
      },
      {
        title: '2. Cancellation',
        body: [
          'You may cancel a paid subscription at any time by using the cancellation control available in the billing console or by contacting support@lethem.app with your account email and subscription details.',
          'Cancellation prevents the next renewal from being charged and stops future automatic payments through Razorpay where supported by the payment provider.',
          'You continue to have access to paid plan features until the end of the current billing period for which you have already paid. After that date, your account reverts to the Free plan (or another available tier) and any paid plan limits (projects, subkeys, token pools, log retention) may be reduced to the Free tier limits.',
          'Deleting your account does not automatically cancel an active subscription. Please cancel from the billing console or contact support@lethem.app before deleting your account to avoid being charged for the next cycle.',
        ],
      },
      {
        title: '3. Refund Eligibility',
        body: [
          `Refunds may be considered in the following cases when reported to support@lethem.app within seven (7) days of the relevant payment date:`,
          '• Duplicate charges for the same subscription period.',
          '• Accidental charges for a plan you did not intend to subscribe to, provided the paid features were not used during the period.',
          '• Failed provisioning where paid features were never activated despite a successful payment, and the issue was not resolved within a reasonable time after you notified us.',
          '• Other genuine billing errors confirmed by Razorpay or by our billing team.',
          'Refunds are evaluated on a case-by-case basis. We may request supporting information such as your account email, transaction ID from Razorpay, payment date, amount, and a brief description of the issue.',
        ],
      },
      {
        title: '4. Non-Refundable Circumstances',
        body: [
          'The following situations are generally not eligible for a refund:',
          '• Fees for billing periods where the Service was actively used, consumed, or provisioned, including any tokens proxied through the Service during that period.',
          '• Fees for periods beyond the seven (7) day reporting window described in Section 3, except where required by applicable law.',
          '• Refunds requested due to dissatisfaction with an upstream Provider\'s service, pricing, or availability — these matters are governed by the UPSTREAM PROVIDER\'s own terms and are outside our control.',
          '• Promotional, trial, or free credit usage — these have no cash value and are not refundable.',
          '• Charges caused by your failure to cancel before a renewal when the cancellation tool was available to you.',
          'Where a refund is required by applicable consumer protection law in your jurisdiction, this section does not limit those rights.',
        ],
      },
      {
        title: '5. Upstream Provider Costs',
        body: [
          'Your use of upstream Providers (OpenAI, Anthropic, Google Vertex, and others) may incur separate charges billed directly by those Providers to your accounts with them. These charges are outside our billing relationship and are not refundable by us under any circumstances.',
          'If you dispute a charge from an upstream Provider, please contact that Provider directly.',
        ],
      },
      {
        title: '6. Refund Processing',
        body: [
          'Approved refunds will be initiated to the original payment method used at checkout through Razorpay or the applicable payment provider. We are unable to issue refunds to a different account or payment method.',
          'After a refund is initiated, the time it takes to appear on your statement depends on your bank or card network and typically ranges from five (5) to ten (10) business days. International cards may take longer.',
          'We will send a confirmation email once a refund has been initiated from our side. If you have not received it within the expected timeline, please contact support@lethem.app for assistance.',
        ],
      },
      {
        title: '7. How to Request a Cancellation or Refund',
        body: [
          'To cancel a subscription, use the cancellation control in the billing console or email cancellations@lethem.app.',
          'To request a refund, email billing@lethem.app with the following information:',
          '• Your account email address',
          '• Transaction ID from Razorpay (found in your payment receipt or card statement)',
          '• Payment date and amount',
          '• A brief description of the reason for the refund request',
          'Verifiable requests are typically responded to within two (2) business days and resolved within seven (7) business days.',
        ],
      },
      {
        title: '8. Chargebacks',
        body: [
          'Please contact us at billing@lethem.app before initiating a chargeback with your bank or card network. Most issues can be resolved more quickly by working with our billing team directly.',
          'Initiating an unjustified chargeback may result in your account being suspended while we investigate. We reserve the right to recover the disputed amount through lawful means, including engaging Razorpay\'s dispute resolution process.',
        ],
      },
      {
        title: '9. Changes to This Policy',
        body: [
          'We may update this Refund and Cancellation Policy from time to time. We will post the updated policy on this page and update the "Last updated" date. Changes take effect from the posted effective date.',
        ],
      },
      {
        title: '10. Contact Us',
        body: [
          `For any questions about cancellations, refunds, or billing, contact us at billing@lethem.app or write to ${COMPANY.name}, ${COMPANY.address}.`,
        ],
      },
    ],
  },

  shipping: {
    slug: 'shipping-delivery-policy',
    title: 'Shipping / Delivery Policy',
    eyebrow: 'Legal',
    lastUpdated: COMPANY.lastUpdated,
    intro: `${COMPANY.name} is a digital software-as-a-service (SaaS) product. This Shipping / Delivery Policy describes how access to the Service is delivered, when paid features are activated, and what to do if you experience delivery issues. Because no physical goods are shipped, this policy explains the digital delivery model.`,
    sections: [
      {
        title: '1. Nature of Delivery',
        body: [
          `${COMPANY.name} is a software-as-a-service product delivered entirely online. No physical goods are shipped, and no shipping charges apply.`,
          'Service access is delivered through a secure web console and over the API. Your account, projects, and subkeys are accessible over the internet from any supported browser or via our API endpoints.',
        ],
      },
      {
        title: '2. Activation Timeline',
        body: [
          'Free tier access is available immediately after successful account sign-in, with no payment required.',
          'Paid plan features are activated immediately after successful payment confirmation and subscription verification by Razorpay. In most cases this is instant; in rare cases, activation may take up to a few minutes while the subscription is verified.',
          'If paid features are not visible within fifteen (15) minutes of a confirmed payment, please follow the steps in Section 5 below.',
        ],
      },
      {
        title: '3. Delivery Method',
        body: [
          'Account access — delivered online through the web console at https://lethem.app after authentication.',
          'API access — delivered through documented REST endpoints. Credentials (Subkeys) are generated by you in the console and shown once at creation.',
          'Updates and notifications — delivered by email to your registered address or as in-app notifications in the console.',
          'Invoices and receipts — delivered by email to your registered billing address and available for download in the billing console.',
        ],
      },
      {
        title: '4. Geographic Availability',
        body: [
          'The Service is delivered over the internet and is generally available worldwide, subject to the following considerations:',
          '• Hosting providers — the Service depends on cloud infrastructure providers whose own availability may vary by region.',
          '• Payment support — payments are processed by Razorpay, whose support for specific regions, currencies, and payment methods depends on your geography. International card payments are supported where Razorpay permits.',
          '• Sanctions and export restrictions — we do not provide the Service in regions subject to comprehensive sanctions or export restrictions.',
          '• Upstream Providers — availability of a specific upstream Provider may depend on that Provider\'s own regional availability and terms.',
        ],
      },
      {
        title: '5. Delivery Issues',
        body: [
          'If paid features are not enabled after a successful payment, please first verify that:',
          '• You are signed in to the account used to make the purchase.',
          '• Your payment status is confirmed in the billing console.',
          '• You have not exceeded any plan-level limits (such as active subkey count or token pools).',
          'If issues persist, contact us at billing@lethem.app with:',
          '  • Your account email address',
          '  • The payment ID from your Razorpay receipt or card statement',
          '  • The date and amount of the payment',
          'We will investigate promptly and, if a payment error is confirmed, take steps to restore access or process a refund in line with our Refund and Cancellation Policy.',
        ],
      },
      {
        title: '6. Updates to the Service',
        body: [
          'We regularly update the Service to add features, fix issues, and improve performance. Updates are delivered automatically through the web console and API without any action on your part.',
          'We may occasionally require scheduled maintenance windows during which the Service is briefly unavailable. We will notify you in advance where feasible.',
        ],
      },
      {
        title: '7. Changes to This Policy',
        body: [
          'We may update this Shipping / Delivery Policy from time to time. We will post the updated policy on this page and update the "Last updated" date. Changes take effect from the posted effective date.',
        ],
      },
      {
        title: '8. Contact Us',
        body: [
          `For any questions about delivery, activation, or access, contact us at support@lethem.app or billing@lethem.app, or write to ${COMPANY.name}, ${COMPANY.address}.`,
        ],
      },
    ],
  },
};

export function policyByPath(path) {
  for (const [key, doc] of Object.entries(POLICIES)) {
    if (path === `/${doc.slug}`) return { key, doc };
  }
  return null;
}
