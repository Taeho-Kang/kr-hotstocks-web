import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">kr-hotstocks</h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                국내주식 마감(월~금 16:10 KST 생성) 브리핑을 웹으로 제공합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {session ? <SignOutButton /> : <SignInButton />}
            </div>
          </div>

          {session && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              로그인됨: {session.user?.email ?? session.user?.name ?? "(unknown)"}
            </p>
          )}
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="font-medium">무엇을 볼 수 있나요?</h2>
          <ul className="list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
            <li>비로그인: 상승/하락 종목 리스트 전부 + 근거 제목 1줄(링크/내일 체크는 숨김)</li>
            <li>로그인(무료): 상세 전체 + 개인 필터(시총/ETF/우선주/상승·하락 표시) 적용</li>
          </ul>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 dark:bg-white dark:text-black"
            href="/reports"
          >
            리포트 보러가기
          </Link>

          {session && (
            <Link
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              href="/settings"
            >
              설정
            </Link>
          )}

          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {session ? "로그인 상태" : "로그인하면 전체 상세가 열립니다."}
          </span>
        </div>

        <footer className="pt-8 text-xs text-zinc-500">
          * 본 서비스는 투자자문이 아니며 정보 제공 목적입니다.
        </footer>
      </div>
    </div>
  );
}
