import Link from "next/link";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { date: "desc" },
    take: 30,
    select: { date: true },
  });

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">리포트</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            DB에 저장된 리포트를 날짜별로 보여줍니다.
          </p>
        </header>

        {reports.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            아직 생성된 리포트가 없습니다. (다음 단계에서 generate API/배치로 채웁니다)
          </div>
        ) : (
          <ul className="space-y-2">
            {reports.map((r: { date: string }) => (
              <li key={r.date}>
                <Link
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  href={`/reports/${r.date}`}
                >
                  <span className="font-medium">국내주식 마감 리포트</span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{r.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div>
          <Link className="text-sm underline underline-offset-4" href="/">
            ← 홈
          </Link>
        </div>
      </div>
    </div>
  );
}
