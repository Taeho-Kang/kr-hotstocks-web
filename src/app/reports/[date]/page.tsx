import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  const report = await prisma.report.findUnique({
    where: { date },
    select: { date: true, publicHtml: true, fullHtml: true },
  });

  const html = isLoggedIn ? report?.fullHtml : report?.publicHtml;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">마감 리포트</h1>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{date}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isLoggedIn
                  ? "로그인: 전체 상세(링크/내일 체크) 포함"
                  : "비로그인: 리스트 전체 + 근거 제목 1줄만 공개 (링크/내일 체크는 숨김)"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn ? <SignOutButton /> : <SignInButton />}
            </div>
          </div>
        </header>

        {!report ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            해당 날짜의 리포트가 없습니다.
          </div>
        ) : !html ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            리포트는 있으나 렌더링 HTML이 비어있습니다.
          </div>
        ) : (
          <article
            className="rounded-xl border border-zinc-200 bg-white p-5 prose prose-zinc max-w-none dark:border-zinc-800 dark:bg-zinc-950 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {!isLoggedIn && report?.fullHtml && (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            로그인하면 상세(링크/내일 체크)가 열립니다.
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link className="text-sm underline underline-offset-4" href="/reports">
            ← 리포트 목록
          </Link>
          <Link className="text-sm underline underline-offset-4" href="/">
            홈
          </Link>
        </div>
      </div>
    </div>
  );
}
