'use client';

import { Book, ArrowLeft, Clock, CheckCircle, PlayCircle, FileText, TrendingUp, PiggyBank, CreditCard, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EducationalContent() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const lessons = [
    {
      id: 1,
      title: 'Understanding Your Save Number',
      category: 'basics',
      duration: '5 min read',
      difficulty: 'Beginner',
      icon: PiggyBank,
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
    },
    {
      id: 2,
      title: 'Your Spend Number Formula',
      category: 'basics',
      duration: '4 min read',
      difficulty: 'Beginner',
      icon: CreditCard,
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
    },
    {
      id: 3,
      title: 'Emergency Fund Basics',
      category: 'savings',
      duration: '6 min read',
      difficulty: 'Beginner',
      icon: Home,
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
    },
    {
      id: 4,
      title: 'Debt Avalanche vs Snowball',
      category: 'debt',
      duration: '7 min read',
      difficulty: 'Intermediate',
      icon: TrendingUp,
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
    }
  ];

  const categories = [
    { id: 'all', name: 'All Lessons', count: lessons.length },
    { id: 'basics', name: 'Basics', count: lessons.filter(l => l.category === 'basics').length },
    { id: 'savings', name: 'Savings', count: lessons.filter(l => l.category === 'savings').length },
    { id: 'debt', name: 'Debt Management', count: lessons.filter(l => l.category === 'debt').length },
  ];

  const filteredLessons = selectedCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null);

  if (selectedLesson) {
    const LessonIcon = selectedLesson.icon;
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Lessons
              </button>
              <h1 className="text-lg font-semibold truncate">{selectedLesson.title}</h1>
              <div className="w-24" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-lg ${selectedLesson.color}`}>
                <LessonIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedLesson.duration}
                  </span>
                  <span>{selectedLesson.difficulty}</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none">
              {selectedLesson.content.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  {paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  ) : paragraph.includes('✅') || paragraph.includes('❌') ? (
                    <div className="bg-gray-50 rounded-lg p-4 my-4">
                      {paragraph.split('\n').map((line, lineIndex) => (
                        <div key={lineIndex} className="text-gray-700 py-1">
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedLesson(null)}
                className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-purple-700 transition"
              >
                Complete Lesson
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-xl font-semibold">Educational Content</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Book className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Learn Personal Finance</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Master the fundamentals with bite-sized lessons designed for busy people. Start with the basics and build your knowledge.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${lesson.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                      <span>{lesson.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-purple-600 text-sm font-medium">
                    <PlayCircle className="h-4 w-4" />
                    Start Lesson
                  </span>
                  {lesson.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Your Progress</h2>
          <p className="text-purple-800 mb-4">
            Complete these foundational lessons to build your financial knowledge step by step.
          </p>
          <div className="text-sm text-purple-700">
            {lessons.filter(l => l.completed).length} of {lessons.length} lessons completed
          </div>
        </div>
      </main>
    </div>
  );
}