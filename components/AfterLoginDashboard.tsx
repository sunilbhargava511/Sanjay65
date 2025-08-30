'use client';

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Calculator as CalcIcon,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lesson {
  id: string;
  title: string;
  youtubeUrl: string;
  category: 'general' | 'young-adult' | 'older-adult';
  order: number;
  createdAt: string;
}

interface Calculator {
  id: string;
  name: string;
  description: string;
  type: 'file' | 'url';
  content: string;
  fileUrl?: string;
  externalUrl?: string;
  createdAt: string;
}

const nav = [
  { key: "welcome", label: "Welcome", icon: Home },
  { key: "lessons", label: "Lessons", icon: BookOpen },
  { key: "calculators", label: "Calculators", icon: CalcIcon },
  { key: "feedback", label: "Feedback", icon: MessageSquare },
];

export default function AfterLoginDashboard() {
  const [active, setActive] = useState("welcome");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [selectedCalculator, setSelectedCalculator] = useState<Calculator | null>(null);

  useEffect(() => {
    // Fetch lessons
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(console.error);

    // Fetch calculators
    fetch('/api/calculators')
      .then(res => res.json())
      .then(data => setCalculators(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top bar (mobile) */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-neutral-200 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">ZeroFinanx</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col md:min-h-screen border-r border-neutral-200 bg-white">
          <div className="flex items-center gap-2 px-5 py-5 border-b border-neutral-200">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">ZeroFinanx</span>
          </div>
          <nav className="p-3 space-y-1">
            {nav.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition hover:bg-neutral-100 ${
                  active === item.key ? "bg-neutral-100 font-medium" : ""
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 p-3"
            >
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">ZeroFinanx</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-2 space-y-1">
                {nav.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActive(item.key);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition hover:bg-neutral-100 ${
                      active === item.key ? "bg-neutral-100 font-medium" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="min-h-screen p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {active === "welcome" && <Welcome />}
              {active === "lessons" && <Lessons lessons={lessons} />}
              {active === "calculators" && <Calculators calculators={calculators} onSelect={setSelectedCalculator} />}
              {active === "feedback" && <Feedback />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Calculator Modal */}
      {selectedCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{selectedCalculator.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCalculator(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-auto" style={{ height: 'calc(90vh - 60px)' }}>
              {selectedCalculator.type === 'file' ? (
                <div dangerouslySetInnerHTML={{ __html: selectedCalculator.content }} />
              ) : (
                <iframe
                  src={selectedCalculator.externalUrl}
                  className="w-full h-full min-h-[600px]"
                  title={selectedCalculator.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
    </div>
  );
}

function Welcome() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Welcome" subtitle="Signed in" />
      <Card>
        <CardContent className="p-5 text-sm space-y-3">
          <p className="text-base font-medium">You have taken the first step towards Zero Financial Anxiety.</p>
          <p>We hope you will find these lessons and calculators useful. We have two asks from you:</p>
          <ol className="list-decimal pl-5 space-y-1 text-neutral-700">
            <li>
              <span className="font-medium">Act for yourself</span> — without action, education is useless. If you benefited, tell others so that they benefit as well.
            </li>
            <li>
              <span className="font-medium">Tell us what you want next</span> — which topics would you like lessons and/or calculators on? We will be adding a lesson or a calculator every 15 days.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function Lessons({ lessons, compact = false }: { lessons: Lesson[]; compact?: boolean }) {
  const [category, setCategory] = useState<'general' | 'young-adult' | 'older-adult'>('general');

  const titles = {
    'general': 'General',
    'young-adult': 'Young Adult',
    'older-adult': 'Older Adults',
  };

  const lessonsByCategory = useMemo(() => {
    const grouped = {
      'general': [] as Lesson[],
      'young-adult': [] as Lesson[],
      'older-adult': [] as Lesson[],
    };
    
    lessons.forEach(lesson => {
      if (lesson.category in grouped) {
        grouped[lesson.category].push(lesson);
      }
    });

    // Sort by order
    Object.keys(grouped).forEach(key => {
      grouped[key as keyof typeof grouped].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [lessons]);

  const currentLessons = lessonsByCategory[category];
  const groups = chunk(currentLessons, 3);

  function extractYouTubeId(url: string): string {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  }

  return (
    <div className="space-y-3">
      {!compact && <SectionHeader title="Lessons" subtitle="Three categories: General, Young Adult, Older Adults" />}
      <Tabs value={category} onValueChange={(value) => setCategory(value as typeof category)} className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="general">General ({lessonsByCategory['general'].length})</TabsTrigger>
          <TabsTrigger value="young-adult">Young Adult ({lessonsByCategory['young-adult'].length})</TabsTrigger>
          <TabsTrigger value="older-adult">Older Adults ({lessonsByCategory['older-adult'].length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {groups.map((group, gi) => (
        <div key={gi} className="space-y-2">
          <div className="text-xs text-neutral-500 font-medium">Group {gi + 1}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <p className="text-neutral-700">{titles[category]} lesson content</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Lesson</Badge>
                    <Button 
                      size="sm"
                      onClick={() => {
                        const videoId = extractYouTubeId(lesson.youtubeUrl);
                        if (videoId) {
                          window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                        }
                      }}
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {currentLessons.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-neutral-500">
            No {titles[category].toLowerCase()} lessons available yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Calculators({ calculators, onSelect, compact = false }: { 
  calculators: Calculator[]; 
  onSelect: (calc: Calculator) => void;
  compact?: boolean;
}) {
  const groups = chunk(calculators, 3);

  return (
    <div className="space-y-3 mt-4">
      {!compact && <SectionHeader title="Calculators" subtitle="Handy tools you can run anytime" />}
      {groups.map((group, gi) => (
        <div key={gi} className="space-y-2">
          <div className="text-xs text-neutral-500 font-medium">Group {gi + 1}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.map((calc) => (
              <Card key={calc.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{calc.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <p className="text-neutral-700">{calc.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge>Tool</Badge>
                    <Button size="sm" onClick={() => onSelect(calc)}>Open</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {calculators.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-neutral-500">
            No calculators available yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Feedback({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-3 mt-4">
      {!compact && <SectionHeader title="Feedback" subtitle="Help us decide what to build next" />}
      <Card>
        <CardContent className="p-5 text-sm space-y-3">
          <p>We love feedback. Tell us which topics you'd like lessons and/or calculators on, and how we can improve.</p>
          <p>
            Please email <a className="underline" href="mailto:sanjay@tiseed.com">sanjay@tiseed.com</a> — we read everything.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <a href="mailto:sanjay@tiseed.com?subject=ZeroFinanx%20Feedback">Send Feedback</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) {
    out.push(arr.slice(i, i + n));
  }
  return out;
}