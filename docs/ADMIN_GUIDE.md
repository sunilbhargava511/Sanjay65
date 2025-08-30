# 🔧 ZeroFinanx Admin Configuration & Operations Guide

## 📋 Table of Contents
1. [🎯 Overview](#overview)
2. [🚀 Initial Setup](#initial-setup)
3. [👨‍💼 Admin Panel Access](#admin-panel-access)
4. [🔐 Authentication Configuration](#authentication-configuration)
5. [💳 Payment Configuration](#payment-configuration)
6. [🚢 Deployment Management](#deployment-management)
7. [👥 User Management](#user-management)
8. [📊 Monitoring & Analytics](#monitoring--analytics)
9. [🔧 Troubleshooting](#troubleshooting)
10. [🛡️ Security Best Practices](#security-best-practices)

## 🎯 Overview

ZeroFinanx is a Next.js-based financial education platform with integrated authentication, payment processing, and content management. This guide covers all administrative tasks required to configure and operate the platform.

### 🔧 Key Components
- **🔐 NextAuth.js** - Authentication system (Google, Apple, Email)
- **💳 Stripe** - Payment processing and subscription management
- **🎛️ Admin Panel** - Web-based configuration interface
- **📚 Content Management** - Educational materials and calculators

## 🚀 Initial Setup

### ✅ Prerequisites
- 🎛️ Access to the ZeroFinanx admin panel
- 🔑 Administrative credentials for third-party services:
  - 🟦 Google Cloud Console (for OAuth)
  - 🍎 Apple Developer Account (for Sign in with Apple)
  - 💳 Stripe Account (for payments)
  - 📧 Email service provider (optional)

### 🎯 First-Time Configuration
1. **🎛️ Access Admin Panel**: Navigate to `/admin/login` on your deployed site
2. **🔐 Login**: Use your admin credentials
3. **⚙️ Complete Setup Wizard**: Follow the guided setup for each integration

## 👨‍💼 Admin Panel Access

### 🔐 Login
- **🌐 URL**: `https://your-domain.com/admin/login`
- **👤 Credentials**: Same as regular user login, with admin role assigned
- **⚡ Features**: Full administrative access to all configuration options

### 🗺️ Navigation
The admin panel provides access to:
- **🔐 OAuth Configuration** - Google, Apple, and NextAuth settings
- **💳 Stripe Configuration** - Payment processing setup
- **👥 User Management** - View and manage user accounts
- **📊 Analytics** - Usage statistics and metrics
- **📚 Setup Instructions** - Step-by-step configuration guides

## 🔐 Authentication Configuration

### 🟦 Google OAuth Setup

1. **🏗️ Google Cloud Console Setup**
   - 🌐 Go to [Google Cloud Console](https://console.cloud.google.com/)
   - 📁 Create a new project or select existing
   - ⚡ Enable Google+ API
   - 🔑 Create OAuth 2.0 credentials

2. **🔄 Configure Redirect URIs**
   ```
   Production: https://your-domain.com/api/auth/callback/google
   Development: http://localhost:3000/api/auth/callback/google
   ```

3. **⚙️ Add to Admin Panel**
   - 🗺️ Navigate to Admin Panel → OAuth Configuration
   - 🎯 Select "Google" provider
   - 📝 Enter Client ID and Client Secret
   - 💾 Save configuration

### 🍎 Apple Sign In Setup

1. **👨‍💻 Apple Developer Account Setup**
   - 💰 Join Apple Developer Program ($99/year)
   - 📱 Create App ID with "Sign in with Apple" capability
   - 🌐 Create Services ID for web authentication

2. **🔐 Generate Private Key**
   - 🔑 Create private key for "Sign in with Apple"
   - 📥 Download .p8 file
   - 📝 Note the Key ID

3. **⚙️ Configure in Admin Panel**
   - 🗺️ Navigate to Admin Panel → OAuth Configuration
   - 🎯 Select "Apple" provider
   - 📝 Enter:
     - 🆔 Client ID (Services ID)
     - 👥 Team ID
     - 🔐 Private Key (contents of .p8 file)
     - 🔑 Key ID
   - 💾 Save configuration

### NextAuth Configuration

1. **Generate Secret**
   ```bash
   openssl rand -base64 32
   ```

2. **Configure in Admin Panel**
   - Navigate to Admin Panel → OAuth Configuration
   - Select "NextAuth" provider
   - Enter generated secret
   - Set production URL
   - Save configuration

### Email Authentication (Optional)

1. **Choose Email Provider**
   - Gmail/Google Workspace
   - SendGrid
   - Other SMTP service

2. **Configure SMTP**
   - Get SMTP connection string
   - Example: `smtp://username:password@smtp.gmail.com:587`

3. **Add to Admin Panel**
   - Navigate to Admin Panel → OAuth Configuration
   - Enter email server configuration
   - Test email sending

## 💳 Payment Configuration

### 💎 Stripe Setup

1. **🏪 Create Stripe Account**
   - 📝 Sign up at [Stripe Dashboard](https://dashboard.stripe.com/register)
   - ✅ Complete business verification
   - 🚀 Switch to live mode for production

2. **🔑 Get API Keys**
   - 🗺️ Navigate to Developers → API Keys
   - 📋 Copy Publishable Key and Secret Key
   - ⚠️ **Note**: Use test keys for development

3. **🛍️ Create Products and Prices**
   - 🗺️ Go to Products → Add Product
   - 📚 Create "ZeroFinanx Education (Beta)" product
   - 💰 Add pricing: $100 one-time payment
   - 📋 Copy Price ID

4. **🔗 Set Up Webhooks**
   - 🗺️ Go to Developers → Webhooks
   - ➕ Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - ☑️ Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `checkout.session.completed`
   - 📋 Copy webhook secret

5. **⚙️ Configure in Admin Panel**
   - 🗺️ Navigate to Admin Panel → Stripe Configuration
   - 📝 Enter:
     - 🔐 Secret Key
     - 🔓 Publishable Key
     - 🔗 Webhook Secret
     - 💰 Price ID
   - 💾 Save configuration

### 🧪 Testing Payments

**Test card numbers for development:**
- ✅ **Success**: `4242 4242 4242 4242`
- ❌ **Decline**: `4000 0000 0000 0002`
- 🔒 **3D Secure**: `4000 0025 0000 3155`

## 🚢 Deployment Management

### 🌐 Vercel Deployment

1. **🌍 Environment Variables**
   - 🤖 The admin panel automatically manages `.env.local`
   - 🔧 For Vercel, manually add environment variables:
     - 🗺️ Go to Vercel Dashboard → Project → Settings → Environment Variables
     - 📋 Add all variables from `.env.local`
     - ☑️ Select Production, Preview, and Development

2. **📋 Required Environment Variables**
   ```
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://your-domain.com
   
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   APPLE_CLIENT_ID=com.yourcompany.yourapp.service
   APPLE_TEAM_ID=your-team-id
   APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
   APPLE_KEY_ID=your-key-id
   
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID=price_...
   
   EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
   EMAIL_FROM=ZeroFinanx <noreply@yourdomain.com>
   ```

3. **Deployment Process**
   - Push changes to main branch
   - Vercel automatically deploys
   - Monitor deployment in Vercel dashboard

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as shown

2. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update OAuth redirect URIs in provider consoles
   - Update Stripe webhook endpoint URL

## 👥 User Management

### 👀 Viewing Users
- **Access**: Admin Panel → Users
- **Information Available**:
  - User email and name
  - Authentication method used
  - Registration date
  - Subscription status
  - Last login

### 💳 Managing Subscriptions
- **Stripe Dashboard**: View detailed subscription information
- **Actions Available**:
  - Cancel subscriptions
  - Issue refunds (if policy allows)
  - Update billing information
  - View payment history

### 🆘 User Support
- **Common Issues**:
  - Login problems → Check OAuth configuration
  - Payment failures → Verify Stripe setup
  - Email delivery → Check email provider settings

## 📊 Monitoring & Analytics

### 💎 Stripe Analytics
- **Revenue Tracking**: Monitor subscription revenue
- **Payment Failures**: Track declined payments
- **Churn Analysis**: Monitor cancellation rates

### 📱 Application Monitoring
- **Error Tracking**: Monitor application errors
- **Performance**: Track page load times
- **User Engagement**: Monitor feature usage

### 📈 Key Metrics to Track
- **User Acquisition**: New signups per day/week/month
- **Conversion Rate**: Trial to paid conversion
- **Revenue**: Monthly recurring revenue (MRR)
- **Churn Rate**: User cancellation rate

## Troubleshooting

### 🔐 Authentication Issues

**Problem**: Users can't sign in with Google
- **Check**: Google OAuth configuration in admin panel
- **Verify**: Redirect URIs match exactly
- **Test**: Try authentication in incognito mode

**Problem**: Apple Sign In not working
- **Check**: Apple developer account status
- **Verify**: Private key format and Team ID
- **Test**: Certificate expiration dates

### 💳 Payment Issues

**Problem**: Payments failing
- **Check**: Stripe webhook configuration
- **Verify**: API keys are for correct environment (test vs live)
- **Monitor**: Stripe dashboard for error details

**Problem**: Webhooks not receiving events
- **Check**: Webhook URL is accessible
- **Verify**: Webhook secret matches configuration
- **Test**: Webhook endpoint manually

### ⚙️ General Issues

**Problem**: Configuration changes not taking effect
- **Solution**: Restart application after environment variable changes
- **Note**: Vercel automatically restarts on deployment

**Problem**: Admin panel not accessible
- **Check**: Admin user role assignment
- **Verify**: Authentication is working properly
- **Access**: Use backup admin account if available

## Security Best Practices

### 🔑 API Keys and Secrets
- **Never commit secrets** to version control
- **Use different keys** for development/production
- **Rotate secrets regularly** (every 3-6 months)
- **Limit API key permissions** to minimum required

### 🔒 Access Control
- **Limit admin access** to essential personnel only
- **Use strong passwords** and enable 2FA where possible
- **Monitor admin activities** through audit logs
- **Regular access reviews** to remove unused accounts

### 🛡️ Data Protection
- **Encrypt sensitive data** at rest and in transit
- **Regular backups** of critical data
- **GDPR compliance** for user data handling
- **Secure webhook endpoints** with proper validation

### 🔍 Monitoring
- **Set up alerts** for failed authentications
- **Monitor unusual** payment patterns
- **Track admin panel** access and changes
- **Regular security audits** of configurations

---

## ✅ Quick Start Checklist

### 🚀 Pre-Launch Setup
- [ ] Configure Google OAuth
- [ ] Configure Apple Sign In (if needed)
- [ ] Set up Stripe payments
- [ ] Configure email authentication (optional)
- [ ] Test all authentication flows
- [ ] Test payment processing
- [ ] Configure production environment variables
- [ ] Set up monitoring and alerts

### 🎉 Launch Day
- [ ] Deploy to production
- [ ] Verify all integrations working
- [ ] Test user registration flow
- [ ] Test payment processing
- [ ] Monitor for errors
- [ ] Have support team ready

### 🔄 Post-Launch
- [ ] Monitor user feedback
- [ ] Track key metrics
- [ ] Regular security updates
- [ ] Performance optimization
- [ ] Feature updates based on user needs

---

## 📞 Support Contacts

- **Technical Issues**: [Insert your support email]
- **Payment Issues**: [Insert your billing email]
- **Security Concerns**: [Insert your security email]

For urgent issues, check the troubleshooting section first, then contact the appropriate support channel.