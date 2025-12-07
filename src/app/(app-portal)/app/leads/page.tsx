import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/core/services/authService";
import { listLeadsByTenant, getLeadStats } from "@/core/services/leadsService";
import { getTenantById } from "@/core/services/tenantsService";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Rocket,
  ArrowRight,
  Users,
  UserCheck,
  UserX,
  Trophy,
  Clock,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

/**
 * Leads CRM Page
 * 
 * Displays and manages leads for the authenticated tenant
 */
export default async function LeadsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/app/login");
  }

  const [tenant, leads, stats] = await Promise.all([
    getTenantById(session.tenantId),
    listLeadsByTenant(session.tenantId),
    getLeadStats(session.tenantId),
  ]);

  if (!tenant) {
    redirect("/app/login");
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      new: {
        label: "חדש",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      contacted: {
        label: "נוצר קשר",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      },
      qualified: {
        label: "מתאים",
        className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      },
      won: {
        label: "נסגר",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      lost: {
        label: "אבוד",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    return config[status] || config.new;
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ניהול לידים</h1>
              <p className="text-xs text-muted-foreground">{tenant.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">סה״כ לידים</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.byStatus.new}</p>
              <p className="text-xs text-muted-foreground">חדשים</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.byStatus.qualified}</p>
              <p className="text-xs text-muted-foreground">מתאימים</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.byStatus.won}</p>
              <p className="text-xs text-muted-foreground">נסגרו</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserX className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.byStatus.lost}</p>
              <p className="text-xs text-muted-foreground">אבודים</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>כל הלידים</CardTitle>
            <CardDescription>
              לידים שהגיעו מדפי הנחיתה שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600">
                  עדיין אין לידים
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  לידים יופיעו כאן כשאנשים ישלחו טופס בדף הנחיתה שלך
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">שם</TableHead>
                    <TableHead className="text-right">אימייל</TableHead>
                    <TableHead className="text-right">טלפון</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">תאריך</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const statusBadge = getStatusBadge(lead.status);
                    return (
                      <TableRow key={lead._id.toString()}>
                        <TableCell className="font-medium">
                          {lead.contactInfo.name || "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {lead.contactInfo.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.contactInfo.phone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {lead.contactInfo.phone}
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.createdAt).toLocaleDateString(
                              "he-IL",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
