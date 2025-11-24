import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Rocket className="h-6 w-6 text-primary" />
          <span className="sr-only">PagePilot</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/editor"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Editor
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Launch Your Perfect Landing Page, Instantly
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    PagePilot uses AI to generate, customize, and deploy stunning landing pages in minutes. No code, no hassle.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/editor">
                      Start Building For Free
                      <Bot className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="w-full aspect-square lg:aspect-auto overflow-hidden rounded-xl">
                 <img
                    src="https://picsum.photos/seed/rocket/600/600"
                    alt="Hero"
                    data-ai-hint="abstract rocket"
                    className="object-cover w-full h-full"
                  />
               </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 PagePilot. All rights reserved.</p>
      </footer>
    </div>
  );
}
