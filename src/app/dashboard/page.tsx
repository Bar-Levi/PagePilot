"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  BarChart3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import type { PageStatus } from "@/components/landing-page/types";

// ============================================================================
// Types
// ============================================================================

interface LandingPage {
  id: string;
  title: string;
  status: PageStatus;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  publishedUrl?: string;
  missingCount: number;
  views?: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockPages: LandingPage[] = [
  {
    id: "1",
    title: "דף נחיתה - קורס דיגיטל",
    status: "published",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-04T15:30:00Z",
    publishedUrl: "https://course.pagepilot.app/digital",
    missingCount: 0,
    views: 1250,
  },
  {
    id: "2",
    title: "דף מוצר - אפליקציה חדשה",
    status: "draft",
    createdAt: "2024-12-03T14:00:00Z",
    updatedAt: "2024-12-05T09:15:00Z",
    missingCount: 0,
    views: 0,
  },
  {
    id: "3",
    title: "דף שירותים - ייעוץ עסקי",
    status: "missing_info",
    createdAt: "2024-12-04T11:00:00Z",
    updatedAt: "2024-12-05T08:00:00Z",
    missingCount: 3,
    views: 0,
  },
];

// ============================================================================
// Helpers
// ============================================================================

function getStatusConfig(status: PageStatus) {
  switch (status) {
    case "published":
      return {
        label: "פורסם",
        icon: CheckCircle2,
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      };
    case "draft":
      return {
        label: "טיוטה",
        icon: Clock,
        className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
      };
    case "missing_info":
      return {
        label: "חסר מידע",
        icon: AlertCircle,
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      };
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// ============================================================================
// Dashboard Page Component
// ============================================================================

export default function DashboardPage() {
  const [pages, setPages] = useState<LandingPage[]>(mockPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (pageId: string) => {
    setPageToDelete(pageId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pageToDelete) {
      setPages((prev) => prev.filter((p) => p.id !== pageToDelete));
      setPageToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = (pageId: string) => {
    const pageToDuplicate = pages.find((p) => p.id === pageId);
    if (pageToDuplicate) {
      const newPage: LandingPage = {
        ...pageToDuplicate,
        id: Date.now().toString(),
        title: `${pageToDuplicate.title} (עותק)`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedUrl: undefined,
        views: 0,
      };
      setPages((prev) => [newPage, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PagePilot
              </h1>
              <p className="text-xs text-muted-foreground">לוח בקרה</p>
            </div>
          </div>

          <Link href="/editor">
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4" />
              צור דף חדש
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {pages.length}
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
                  {pages.filter((p) => p.status === "published").length}
                </p>
                <p className="text-sm text-emerald-600/70">דפים פורסמו</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {formatNumber(pages.reduce((sum, p) => sum + (p.views || 0), 0))}
                </p>
                <p className="text-sm text-purple-600/70">צפיות סה״כ</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="חפש דפים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 max-w-md"
          />
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => {
            const statusConfig = getStatusConfig(page.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={page.id}
                className="group hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link href={`/editor?pageId=${page.id}`}>
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Pencil className="w-3 h-3" />
                        ערוך
                      </Button>
                    </Link>
                    {page.publishedUrl && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1"
                        onClick={() => window.open(page.publishedUrl, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3" />
                        צפה
                      </Button>
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
                        עודכן {formatDate(page.updatedAt)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/editor?pageId=${page.id}`}>
                            <Pencil className="w-4 h-4 ml-2" />
                            ערוך
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                          <Copy className="w-4 h-4 ml-2" />
                          שכפל
                        </DropdownMenuItem>
                        {page.publishedUrl && (
                          <DropdownMenuItem
                            onClick={() => window.open(page.publishedUrl, "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 ml-2" />
                            פתח בחלון חדש
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(page.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          מחק
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge className={statusConfig.className}>
                      <StatusIcon className="w-3 h-3 ml-1" />
                      {statusConfig.label}
                      {page.status === "missing_info" && page.missingCount > 0 && (
                        <span className="mr-1">({page.missingCount})</span>
                      )}
                    </Badge>

                    {page.views !== undefined && page.views > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <BarChart3 className="w-3 h-3" />
                        {formatNumber(page.views)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Empty State */}
          {filteredPages.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                {searchQuery ? "לא נמצאו תוצאות" : "עדיין אין דפים"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "נסה לחפש משהו אחר"
                  : "צור את דף הנחיתה הראשון שלך בעזרת AI"}
              </p>
              {!searchQuery && (
                <Link href="/editor">
                  <Button className="mt-4 gap-2">
                    <Plus className="w-4 h-4" />
                    צור דף חדש
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              האם למחוק את הדף?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              פעולה זו אינה ניתנת לביטול. הדף יימחק לצמיתות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              מחק
            </AlertDialogAction>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
