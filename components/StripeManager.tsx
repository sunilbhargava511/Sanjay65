'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Pause, 
  Play, 
  X,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface StripeAnalytics {
  period: string;
  revenue: {
    total: number;
    currency: string;
    formatted: string;
  };
  payments: {
    successful: number;
    failed: number;
    total: number;
    success_rate: string;
  };
  subscriptions: {
    new: number;
    active: number;
    cancelled: number;
    mrr: {
      amount: number;
      formatted: string;
    };
  };
  payment_methods: Record<string, number>;
  stripe_fees_estimate: {
    amount: number;
    formatted: string;
  };
}

interface Customer {
  id: string;
  email: string;
  name?: string;
  created: number;
  subscriptions: Array<{
    id: string;
    status: string;
    current_period_end: number;
    current_period_start: number;
    plan: string;
    amount: number;
    currency: string;
    interval: string;
  }>;
}

export default function StripeManager() {
  const [activeView, setActiveView] = useState<'config' | 'analytics' | 'customers'>('config');
  const [analytics, setAnalytics] = useState<StripeAnalytics | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    secretKey: '',
    publishableKey: '',
    webhookSecret: ''
  });
  const [testingConnection, setTestingConnection] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/stripe/analytics?days=${selectedPeriod}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stripe/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data.customers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionAction = async (subscriptionId: string, action: 'pause' | 'resume' | 'cancel') => {
    try {
      const response = await fetch(`/api/admin/stripe/subscription/${subscriptionId}`, {
        method: action === 'cancel' ? 'DELETE' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: action !== 'cancel' ? JSON.stringify({ action }) : undefined,
      });

      if (!response.ok) throw new Error(`Failed to ${action} subscription`);
      
      // Reload customers to show updated status
      loadCustomers();
      alert(`Subscription ${action}ed successfully`);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : `Failed to ${action} subscription`}`);
    }
  };

  const loadStripeConfig = async () => {
    setConfigLoading(true);
    try {
      const response = await fetch('/api/admin/stripe/config');
      if (response.ok) {
        const data = await response.json();
        setStripeConfig(data);
        setStripeConfigured(data.configured || false);
      }
    } catch (err) {
      console.error('Failed to load Stripe config:', err);
    } finally {
      setConfigLoading(false);
    }
  };

  const saveStripeConfig = async () => {
    setConfigLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stripe/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeConfig),
      });

      if (!response.ok) throw new Error('Failed to save Stripe configuration');
      
      const data = await response.json();
      setStripeConfigured(data.configured);
      alert('Stripe configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setConfigLoading(false);
    }
  };

  const testStripeConnection = async () => {
    if (!stripeConfig.secretKey) {
      setError('Secret key is required to test connection');
      return;
    }

    setTestingConnection(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stripe/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey: stripeConfig.secretKey }),
      });

      if (!response.ok) throw new Error('Failed to test Stripe connection');
      
      const data = await response.json();
      if (data.success) {
        alert('Stripe connection test successful!');
      } else {
        throw new Error(data.error || 'Connection test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    if (activeView === 'config') {
      loadStripeConfig();
    } else if (activeView === 'analytics') {
      loadAnalytics();
    } else if (activeView === 'customers') {
      loadCustomers();
    }
  }, [activeView, selectedPeriod]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      case 'unpaid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && (!analytics && !customers.length)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Stripe data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Stripe Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">Manage payments, subscriptions, and customers</p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Stripe Dashboard
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setActiveView('config')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
              activeView === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
              activeView === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveView('customers')}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
              activeView === 'customers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Customers & Subscriptions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {activeView === 'config' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Stripe Configuration</h3>
              <p className="text-sm text-blue-800">
                Configure your Stripe API keys to enable payment processing. You can find these in your{' '}
                <a 
                  href="https://dashboard.stripe.com/apikeys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Stripe Dashboard
                </a>.
              </p>
            </div>

            {!stripeConfigured && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Setup Required</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Stripe is not configured. Payment processing is currently disabled.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key
                </label>
                <input
                  type="password"
                  value={stripeConfig.secretKey}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="sk_test_... or sk_live_..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for server-side API calls. Starts with sk_test_ or sk_live_
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={stripeConfig.publishableKey}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, publishableKey: e.target.value }))}
                  placeholder="pk_test_... or pk_live_..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for client-side checkout. Starts with pk_test_ or pk_live_
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={stripeConfig.webhookSecret}
                  onChange={(e) => setStripeConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                  placeholder="whsec_..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used to verify webhook signatures. Starts with whsec_
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveStripeConfig}
                  disabled={configLoading || !stripeConfig.secretKey || !stripeConfig.publishableKey}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {configLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Save Configuration
                </button>
                
                <button
                  onClick={testStripeConnection}
                  disabled={testingConnection || !stripeConfig.secretKey}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testingConnection ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Test Connection
                </button>
              </div>
            </div>

            {stripeConfigured && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Configuration Active</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Stripe is configured and ready for payments. You can now access Analytics and Customer Management.
                </p>
              </div>
            )}
          </div>
        )}

        {activeView === 'analytics' && analytics && (
          <div>
            {/* Period Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
            </div>

            {/* Analytics Grid */}
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-800">Total Revenue</p>
                    <p className="text-xl font-bold text-blue-900">{analytics.revenue.formatted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-800">Success Rate</p>
                    <p className="text-xl font-bold text-green-900">{analytics.payments.success_rate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-800">Active Subscriptions</p>
                    <p className="text-xl font-bold text-purple-900">{analytics.subscriptions.active}</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                  <div>
                    <p className="text-sm text-indigo-800">Monthly Recurring Revenue</p>
                    <p className="text-xl font-bold text-indigo-900">{analytics.subscriptions.mrr.formatted}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successful Payments:</span>
                    <span className="font-medium">{analytics.payments.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed Payments:</span>
                    <span className="font-medium text-red-600">{analytics.payments.failed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Subscriptions:</span>
                    <span className="font-medium text-green-600">{analytics.subscriptions.new}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled:</span>
                    <span className="font-medium text-red-600">{analytics.subscriptions.cancelled}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Methods</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(analytics.payment_methods).map(([method, count]) => (
                    <div key={method} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{method}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Est. Stripe Fees:</span>
                    <span className="font-medium">{analytics.stripe_fees_estimate.formatted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'customers' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customers & Subscriptions</h3>
              <button
                onClick={loadCustomers}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Customers Yet</h3>
                <p className="text-gray-600">Customers will appear here after their first payment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{customer.email}</h4>
                        {customer.name && <p className="text-sm text-gray-600">{customer.name}</p>}
                        <p className="text-xs text-gray-500">Customer since {formatDate(customer.created)}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{customer.id}</span>
                    </div>

                    {customer.subscriptions.length > 0 ? (
                      <div className="space-y-3">
                        {customer.subscriptions.map((subscription) => (
                          <div key={subscription.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                  {subscription.status}
                                </span>
                                <p className="text-sm font-medium mt-1">{subscription.plan}</p>
                                <p className="text-xs text-gray-600">
                                  ${(subscription.amount / 100).toFixed(2)}/{subscription.interval}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {subscription.status === 'active' && (
                                  <>
                                    <button
                                      onClick={() => handleSubscriptionAction(subscription.id, 'pause')}
                                      className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                                      title="Pause subscription"
                                    >
                                      <Pause className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                      title="Cancel subscription"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                {subscription.status === 'paused' && (
                                  <button
                                    onClick={() => handleSubscriptionAction(subscription.id, 'resume')}
                                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                                    title="Resume subscription"
                                  >
                                    <Play className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Current period: {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No active subscriptions</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}