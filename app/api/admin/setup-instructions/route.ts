import { NextResponse } from 'next/server';

export async function GET() {
  const instructions = {
    oauth: {
      google: {
        title: "Google OAuth Setup",
        description: "Enable Google Sign-In for your users",
        steps: [
          {
            step: 1,
            title: "Go to Google Cloud Console",
            description: "Visit the Google Cloud Console and create a new project or select an existing one.",
            url: "https://console.cloud.google.com/"
          },
          {
            step: 2,
            title: "Enable Google+ API",
            description: "In the API Library, search for 'Google+ API' and enable it for your project."
          },
          {
            step: 3,
            title: "Create OAuth 2.0 Credentials",
            description: "Go to 'Credentials' → 'Create Credentials' → 'OAuth 2.0 Client IDs'"
          },
          {
            step: 4,
            title: "Configure OAuth Consent Screen",
            description: "Fill in your app name, user support email, and developer contact information."
          },
          {
            step: 5,
            title: "Set Authorized Redirect URIs",
            description: "Add your callback URL:",
            code: `${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/api/auth/callback/google`
          },
          {
            step: 6,
            title: "Copy Your Credentials",
            description: "Copy the Client ID and Client Secret from the credentials page."
          }
        ],
        requiredFields: [
          {
            name: "GOOGLE_CLIENT_ID",
            description: "Your Google OAuth Client ID",
            example: "123456789-abcdefghijklmnop.apps.googleusercontent.com"
          },
          {
            name: "GOOGLE_CLIENT_SECRET",
            description: "Your Google OAuth Client Secret",
            example: "GOCSPX-abcdefghijklmnopqrstuvwxyz"
          }
        ]
      },
      apple: {
        title: "Apple OAuth Setup",
        description: "Enable Sign in with Apple for your users",
        steps: [
          {
            step: 1,
            title: "Join Apple Developer Program",
            description: "You need an active Apple Developer account ($99/year).",
            url: "https://developer.apple.com/programs/"
          },
          {
            step: 2,
            title: "Register Your App ID",
            description: "In Apple Developer Console, go to 'Certificates, Identifiers & Profiles' → 'Identifiers' → '+' → 'App IDs'"
          },
          {
            step: 3,
            title: "Enable Sign in with Apple",
            description: "In your App ID configuration, check 'Sign In with Apple' capability."
          },
          {
            step: 4,
            title: "Create a Services ID",
            description: "Create a new identifier of type 'Services IDs' - this will be your Client ID."
          },
          {
            step: 5,
            title: "Configure Web Authentication",
            description: "In your Services ID, configure web authentication with your domain and return URL:",
            code: `${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/api/auth/callback/apple`
          },
          {
            step: 6,
            title: "Create a Private Key",
            description: "Go to 'Keys' → '+' → Check 'Sign in with Apple' → Configure with your App ID"
          },
          {
            step: 7,
            title: "Download and Convert Key",
            description: "Download the .p8 key file and copy its contents (it's already in the correct format)."
          }
        ],
        requiredFields: [
          {
            name: "APPLE_CLIENT_ID",
            description: "Your Services ID (Client ID)",
            example: "com.yourcompany.yourapp.service"
          },
          {
            name: "APPLE_TEAM_ID",
            description: "Your Apple Developer Team ID (found in top-right of developer console)",
            example: "ABCDEFGHIJ"
          },
          {
            name: "APPLE_PRIVATE_KEY",
            description: "Contents of your .p8 private key file (including headers)",
            example: "-----BEGIN PRIVATE KEY-----\\nMIGTAgEAMBMGByqGSM49AgE...\\n-----END PRIVATE KEY-----"
          },
          {
            name: "APPLE_KEY_ID",
            description: "The Key ID from your private key",
            example: "ABCDEFGHIJ"
          }
        ]
      },
      nextauth: {
        title: "NextAuth Configuration",
        description: "Required for authentication to work securely",
        steps: [
          {
            step: 1,
            title: "Generate a Secret",
            description: "Generate a random secret for encrypting tokens. You can use:",
            code: "openssl rand -base64 32"
          },
          {
            step: 2,
            title: "Set Your App URL",
            description: "Set your production URL for OAuth callbacks to work correctly."
          }
        ],
        requiredFields: [
          {
            name: "NEXTAUTH_SECRET",
            description: "Random string for encrypting tokens (32+ characters recommended)",
            example: "your-super-secret-nextauth-secret-here-32chars+"
          },
          {
            name: "NEXTAUTH_URL",
            description: "Your production domain URL",
            example: "https://your-domain.com"
          }
        ]
      }
    },
    stripe: {
      title: "Stripe Payment Setup",
      description: "Configure subscription payments with 30-day free trial",
      steps: [
        {
          step: 1,
          title: "Create Stripe Account",
          description: "Sign up for a Stripe account if you don't have one.",
          url: "https://dashboard.stripe.com/register"
        },
        {
          step: 2,
          title: "Get API Keys",
          description: "Go to Developers → API Keys in your Stripe dashboard."
        },
        {
          step: 3,
          title: "Create a Product",
          description: "Go to Products → Add Product. Create your subscription product."
        },
        {
          step: 4,
          title: "Create a Price",
          description: "Add a recurring price to your product (e.g., $29/month). Copy the Price ID."
        },
        {
          step: 5,
          title: "Set Up Webhooks",
          description: "Go to Developers → Webhooks → Add endpoint. Use this URL:",
          code: `${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/api/stripe/webhook`
        },
        {
          step: 6,
          title: "Configure Webhook Events",
          description: "Select these events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, checkout.session.completed"
        }
      ],
      requiredFields: [
        {
          name: "STRIPE_SECRET_KEY",
          description: "Your Stripe Secret Key (starts with sk_)",
          example: "sk_live_YOUR_STRIPE_SECRET_KEY_HERE"
        },
        {
          name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
          description: "Your Stripe Publishable Key (starts with pk_)",
          example: "pk_live_YOUR_STRIPE_PUBLISHABLE_KEY_HERE"
        },
        {
          name: "STRIPE_WEBHOOK_SECRET",
          description: "Your Webhook Endpoint Secret (from webhook details)",
          example: "whsec_YOUR_WEBHOOK_SECRET_HERE"
        },
        {
          name: "STRIPE_PRICE_ID",
          description: "Your subscription Price ID",
          example: "price_1A2B3C4D5E6F7G8H9I0J1K2L"
        }
      ],
      testMode: {
        title: "Testing with Stripe",
        description: "Use these test card numbers for testing payments:",
        testCards: [
          {
            number: "4242 4242 4242 4242",
            description: "Visa - Always succeeds"
          },
          {
            number: "4000 0000 0000 0002",
            description: "Visa - Always declined"
          },
          {
            number: "4000 0025 0000 3155",
            description: "Visa - Requires authentication (3D Secure)"
          }
        ]
      }
    },
    email: {
      title: "Email Provider Setup (Optional)",
      description: "Enable magic link authentication via email",
      note: "Email authentication is optional. Users can still sign in with Google/Apple without this.",
      providers: [
        {
          name: "Gmail/Google Workspace",
          steps: [
            {
              step: 1,
              title: "Enable 2FA",
              description: "Enable 2-factor authentication on your Google account."
            },
            {
              step: 2,
              title: "Generate App Password",
              description: "Go to Google Account settings → Security → App passwords → Generate"
            },
            {
              step: 3,
              title: "Configure SMTP",
              code: "smtp://username:app-password@smtp.gmail.com:587"
            }
          ]
        },
        {
          name: "SendGrid",
          steps: [
            {
              step: 1,
              title: "Create SendGrid Account",
              url: "https://sendgrid.com"
            },
            {
              step: 2,
              title: "Get API Key",
              description: "Go to Settings → API Keys → Create API Key"
            },
            {
              step: 3,
              title: "Configure SMTP",
              code: "smtp://apikey:your-api-key@smtp.sendgrid.net:587"
            }
          ]
        }
      ],
      requiredFields: [
        {
          name: "EMAIL_SERVER",
          description: "SMTP connection string",
          example: "smtp://username:password@smtp.gmail.com:587"
        },
        {
          name: "EMAIL_FROM",
          description: "From email address",
          example: "ZeroFinanx <noreply@yourdomain.com>"
        },
        {
          name: "NEXT_PUBLIC_EMAIL_ENABLED",
          description: "Enable email auth in UI",
          example: "true"
        }
      ]
    },
    deployment: {
      title: "Vercel Deployment Configuration",
      description: "How to add environment variables in Vercel",
      steps: [
        {
          step: 1,
          title: "Go to Vercel Dashboard",
          description: "Visit your project in Vercel dashboard.",
          url: "https://vercel.com/dashboard"
        },
        {
          step: 2,
          title: "Open Project Settings",
          description: "Click on your project → Settings → Environment Variables"
        },
        {
          step: 3,
          title: "Add Variables",
          description: "Click 'Add New' and enter each key-value pair from your .env.local file."
        },
        {
          step: 4,
          title: "Select Environment",
          description: "Choose 'Production', 'Preview', and 'Development' for all variables."
        },
        {
          step: 5,
          title: "Redeploy",
          description: "Go to Deployments tab → click ⋯ on latest deployment → Redeploy"
        }
      ],
      important: [
        "Never commit .env.local to git - it's already in .gitignore",
        "Use different keys for production vs development/testing",
        "Keep your private keys secure and never share them",
        "Regularly rotate your secrets for security"
      ]
    }
  };

  return NextResponse.json(instructions);
}