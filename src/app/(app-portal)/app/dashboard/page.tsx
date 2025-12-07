import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/core/services/authService";
import { listLandingPagesByTenant } from "@/core/services/landingPagesService";
import { getTenantById } from "@/core/services/tenantsService";
import { getLeadStats } from "@/core/services/leadsService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Plus,
  FileText,
  CheckCircle2,
  Eye,
  Clock,
  AlertCircle,
  Users,
  Sparkles,
  ExternalLink,
  MoreVertical,
  Pencil,
} from "lucide-react";

/**
 * Dashboard Page
 * 
 * Lists landing pages for the authenticated tenant
 */
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/app/login");
  }

  // Fetch tenant data
  const [tenant, landingPages, leadStats] = await Promise.all([
    getTenantById(session.tenantId),
    listLandingPagesByTenant(session.tenantId),
    getLeadStats(session.tenantId),
  ]);

  if (!tenant) {
    redirect("/app/login");
  }

  const publishedCount = landingPages.filter((p) => p.status === "published").length;
  const draftCount = landingPages.filter((p) => p.status === "draft").length;

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {tenant.name}
              </h1>
              <p className="text-xs text-muted-foreground">לוח בקרה</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/app/leads">
              <Button variant="ghost" className="gap-2">
                <Users className="w-4 h-4" />
                לידים
              </Button>
            </Link>
            <Link href="/app/create-page">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4" />
                צור דף חדש
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {landingPages.length}
                </p>
                <p className="text-sm text-blue-600/70">סה״כ דפים</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {publishedCount}
                </p>
                <p className="text-sm text-emerald-600/70">דפים פורסמו</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {draftCount}
                </p>
                <p className="text-sm text-amber-600/70">טיוטות</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {leadStats.total}
                </p>
                <p className="text-sm text-purple-600/70">לידים</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Landing Pages Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">דפי הנחיתה שלך</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page) => (
            <Card
              key={page._id.toString()}
              className="group hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link href={`/app/landing-editor/${page._id}`}>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Pencil className="w-3 h-3" />
                      ערוך
                    </Button>
                  </Link>
                  {page.status === "published" && (
                    <Link href={`/l/${tenant.slug}`} target="_blank">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <ExternalLink className="w-3 h-3" />
                        צפה
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      עודכן{" "}
                      {new Date(page.updatedAt).toLocaleDateString("he-IL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      page.status === "published"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }
                  >
                    {page.status === "published" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 ml-1" />
                        פורסם
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 ml-1" />
                        טיוטה
                      </>
                    )}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {landingPages.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                עדיין אין דפים
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                צור את דף הנחיתה הראשון שלך בעזרת AI
              </p>
              <Link href="/app/create-page">
                <Button className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  צור דף חדש
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
