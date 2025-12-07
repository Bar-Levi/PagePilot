import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Bot,
  Sparkles,
  Zap,
  Palette,
  Code,
  ArrowLeft,
  Check,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl"
            prefetch={false}
          >
            <div className="relative">
              <Rocket className="h-6 w-6 text-primary" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              PagePilot
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/app/login"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              prefetch={false}
            >
              התחבר
            </Link>
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link href="/app/register">
                הרשם
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/editor">
                <Bot className="h-4 w-4" />
                עורך דמו
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-pink-500/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          
          <div className="container relative px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium w-fit">
                  <Sparkles className="h-4 w-4" />
                  <span>מונע על ידי AI</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                    בנה דפי נחיתה
                    <br />
                    <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      מדהימים בקלות
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                    PagePilot משתמש ב-AI מתקדם כדי ליצור, להתאים אישית ולהשיק דפי
                    נחיתה מקצועיים תוך דקות. בלי קוד, בלי מאמץ, רק תוצאות מדהימות.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2 text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25">
                    <Link href="/app/register">
                      התחל לבנות בחינם
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 h-auto">
                    <Link href="#features">
                      למד עוד
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-white dark:border-slate-900"
                          style={{ marginRight: i > 1 ? '-8px' : '0' }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">10,000+</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">משתמשים פעילים</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">4.9/5</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">דירוג ממוצע</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl shadow-primary/20 border border-slate-200 dark:border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20" />
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="PagePilot Editor Preview"
                    className="object-cover w-full h-full mix-blend-overlay opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 max-w-md">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500" />
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gradient-to-r from-primary to-purple-600 rounded w-3/4" />
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                        </div>
                        <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg border border-primary/30" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-40 animate-pulse delay-1000" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                כל מה שאתה צריך
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  במקום אחד
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                כלים חזקים לעיצוב דפי נחיתה מקצועיים ללא צורך בידע טכני
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Bot,
                  title: "AI חכם",
                  description: "יצירת תוכן אוטומטית עם AI מתקדם שמבין את העסק שלך",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Zap,
                  title: "מהיר וקל",
                  description: "בנה דף נחיתה מקצועי תוך דקות, ללא קוד או עיצוב מורכב",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  icon: Palette,
                  title: "עיצוב גמיש",
                  description: "אלפי אפשרויות עיצוב, צבעים, גופנים ואנימציות",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  icon: Code,
                  title: "ללא קוד",
                  description: "עורך ויזואלי אינטואיטיבי - פשוט גרור ושחרר",
                  color: "from-purple-500 to-indigo-500",
                },
                {
                  icon: Sparkles,
                  title: "תבניות מוכנות",
                  description: "מגוון תבניות מקצועיות מוכנות לשימוש מיידי",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: Rocket,
                  title: "פרסום מיידי",
                  description: "השיק את הדף שלך תוך שניות עם קישור ייחודי",
                  color: "from-red-500 to-pink-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="container relative px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                מוכן להתחיל?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                הצטרף לאלפי יזמים ועסקים שבונים דפי נחיתה מדהימים עם PagePilot
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6 h-auto">
                  <Link href="/app/register">
                    התחל בחינם עכשיו
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>ללא כרטיס אשראי</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>התחלה מיידית</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>ללא התחייבות</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-950">
        <div className="container flex flex-col gap-4 sm:flex-row py-8 px-4 md:px-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <span className="font-semibold text-slate-900 dark:text-white">PagePilot</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            &copy; 2024 PagePilot. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
