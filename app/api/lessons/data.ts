// Shared data store for lessons API routes
// In production, this would be replaced with a proper database

export interface Lesson {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  description: string;
  content: string;
  icon: string;
  color: string;
  completed: boolean;
}

// Shared lessons Map that all routes can access
export const lessons: Map<number, Lesson> = new Map();

// Initialize with default lessons
if (lessons.size === 0) {
  lessons.set(1, {
    id: 1,
    title: 'Understanding Your Save Number',
    category: 'basics',
    duration: '5 min read',
    difficulty: 'Beginner',
    icon: 'PiggyBank',
    color: 'bg-green-500',
    description: 'Learn how to calculate the minimum amount you need to save each month for financial security.',
    content: `Your "Save Number" is the minimum amount you should save each month to build financial security. Here's how to calculate it:

**Step 1: Calculate Monthly Expenses**
- Housing (rent/mortgage): $______
- Food and groceries: $______
- Transportation: $______
- Utilities: $______
- Insurance: $______
- Other fixed expenses: $______
**Total Monthly Expenses: $______**

**Step 2: Determine Your Save Number**
Your Save Number = Monthly Expenses × 0.20 (20%)

**Why 20%?**
- 10% for retirement savings
- 5% for emergency fund
- 5% for other financial goals

**Example:**
If your monthly expenses are $3,000:
Save Number = $3,000 × 0.20 = $600/month

**Next Steps:**
1. Set up automatic transfers for your Save Number
2. Use the Spend Number calculator to see how much you can spend guilt-free
3. Review and adjust every 3 months`,
    completed: false
  });

  lessons.set(2, {
    id: 2,
    title: 'Your Spend Number Formula',
    category: 'basics',
    duration: '4 min read',
    difficulty: 'Beginner',
    icon: 'CreditCard',
    color: 'bg-blue-500',
    description: 'Calculate how much you can spend guilt-free after covering savings and essentials.',
    content: `Your "Spend Number" is the amount you can spend on discretionary items without guilt. Here's the formula:

**Spend Number = Income - Fixed Expenses - Save Number**

**Step 1: Calculate Monthly After-Tax Income**
- Salary/wages: $______
- Side income: $______
- Other income: $______
**Total Monthly Income: $______**

**Step 2: List Fixed Expenses**
- Housing: $______
- Insurance: $______
- Utilities: $______
- Minimum debt payments: $______
- Groceries: $______
**Total Fixed Expenses: $______**

**Step 3: Calculate Your Spend Number**
Spend Number = Income - Fixed Expenses - Save Number

**Example:**
- Income: $5,000
- Fixed Expenses: $3,000  
- Save Number: $600
- **Spend Number = $5,000 - $3,000 - $600 = $1,400**

**What Counts as "Spending":**
✅ Dining out
✅ Entertainment
✅ Hobbies
✅ Shopping
✅ Subscriptions
✅ Travel

**Pro Tip:** Put your Spend Number in a separate account and use it guilt-free!`,
    completed: false
  });

  lessons.set(3, {
    id: 3,
    title: 'Emergency Fund Basics',
    category: 'savings',
    duration: '6 min read',
    difficulty: 'Beginner',
    icon: 'Home',
    color: 'bg-orange-500',
    description: 'Build a safety net that protects you from unexpected expenses and job loss.',
    content: `An emergency fund is your financial safety net. Here's everything you need to know:

**What is an Emergency Fund?**
Money set aside for unexpected expenses like:
- Job loss
- Medical emergencies
- Car repairs
- Home repairs
- Other unforeseen costs

**How Much Should You Save?**
- **Starter Emergency Fund:** $1,000 (build this first)
- **Full Emergency Fund:** 3-6 months of expenses
- **High-Risk Jobs:** 6-12 months of expenses

**Calculation Example:**
If your monthly expenses are $3,000:
- Minimum: $3,000 × 3 = $9,000
- Ideal: $3,000 × 6 = $18,000

**Where to Keep Your Emergency Fund:**
✅ High-yield savings account
✅ Money market account
✅ Short-term CDs
❌ Checking account (too easy to spend)
❌ Investments (too volatile)
❌ Retirement accounts (penalties)

**Building Your Emergency Fund:**
1. Start with $25-50 per week
2. Save tax refunds and bonuses
3. Use the "Pay Yourself First" method
4. Automate transfers to make it easier

**When to Use It:**
✅ True emergencies only
✅ Unexpected job loss
✅ Medical bills
❌ Vacation
❌ New car (unless current one is broken)
❌ Holiday gifts

**Replenish Immediately:**
If you use emergency fund money, make replenishing it your top priority.`,
    completed: false
  });

  lessons.set(4, {
    id: 4,
    title: 'Debt Avalanche vs Snowball',
    category: 'debt',
    duration: '7 min read',
    difficulty: 'Intermediate',
    icon: 'TrendingUp',
    color: 'bg-red-500',
    description: 'Two proven strategies to pay off debt faster and save money on interest.',
    content: `Choose the right debt payoff strategy for your situation:

**Debt Avalanche Method (Math-Optimal)**
Pay minimums on all debts, put extra money toward highest interest rate debt.

**Example:**
1. Credit Card A: $5,000 at 22% APR
2. Credit Card B: $3,000 at 18% APR  
3. Car Loan: $10,000 at 5% APR

**Avalanche Order:** Pay extra on Card A first, then B, then car loan.

**Benefits:**
✅ Saves most money on interest
✅ Fastest mathematically
✅ Higher credit utilization improvement

**Debt Snowball Method (Psychology-Optimal)**
Pay minimums on all debts, put extra money toward smallest balance.

**Example (same debts):**
**Snowball Order:** Pay extra on Card B first ($3,000), then Card A ($5,000), then car loan ($10,000).

**Benefits:**
✅ Quick wins build momentum
✅ Psychological satisfaction
✅ Fewer monthly payments sooner
✅ Better for people who struggle with motivation

**Which Should You Choose?**

**Choose Avalanche If:**
- You're disciplined with money
- You want to save the most on interest
- The interest rate differences are significant (>5%)

**Choose Snowball If:**
- You need motivation and quick wins
- The interest rates are similar
- You've struggled to stick with debt payoff before
- You have many small debts

**Hybrid Approach:**
Some people use snowball for small debts under $1,000, then switch to avalanche.

**Key Success Factors:**
1. List all debts with balances and rates
2. Choose your method and stick with it
3. Automate extra payments
4. Don't take on new debt while paying off existing debt
5. Celebrate milestones to stay motivated`,
    completed: false
  });
}

// ID generator for new lessons
export let nextId = 5; // Start from 5 since we have 4 initial lessons

export function generateId(): number {
  return nextId++;
}