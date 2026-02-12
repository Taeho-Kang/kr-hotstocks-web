import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function updateSettings(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  const userId = (session?.user as unknown as { id?: string } | undefined)?.id;
  if (!userId) redirect("/");

  const minMarketCapEokRaw = String(formData.get("minMarketCapEok") ?? "3000");
  const minMarketCapEok = Math.max(0, Number.parseInt(minMarketCapEokRaw, 10) || 0);

  const excludeEtfEtn = formData.get("excludeEtfEtn") === "on";
  const excludePreferred = formData.get("excludePreferred") === "on";
  const showRise = formData.get("showRise") === "on";
  const showFall = formData.get("showFall") === "on";

  await prisma.userSettings.upsert({
    where: { userId },
    update: {
      minMarketCapEok,
      excludeEtfEtn,
      excludePreferred,
      showRise,
      showFall,
    },
    create: {
      userId,
      minMarketCapEok,
      excludeEtfEtn,
      excludePreferred,
      showRise,
      showFall,
    },
  });

  redirect("/settings");
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as unknown as { id?: string } | undefined)?.id;

  if (!userId) {
    redirect("/");
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  const s = settings ?? {
    minMarketCapEok: 3000,
    excludeEtfEtn: true,
    excludePreferred: true,
    showRise: true,
    showFall: true,
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50 sm:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">설정</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            로그인 사용자에게만 적용되는 개인 필터입니다.
          </p>
        </header>

        <form action={updateSettings} className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="minMarketCapEok">
                최소 시가총액(억)
              </label>
              <input
                id="minMarketCapEok"
                name="minMarketCapEok"
                type="number"
                min={0}
                step={100}
                defaultValue={s.minMarketCapEok}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
              <p className="text-xs text-zinc-500">기본값 3000 (= 3,000억)</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="excludeEtfEtn"
                  defaultChecked={s.excludeEtfEtn}
                />
                ETF/ETN 제외
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="excludePreferred"
                  defaultChecked={s.excludePreferred}
                />
                우선주 제외
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="showRise" defaultChecked={s.showRise} />
                상승 섹션 표시
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="showFall" defaultChecked={s.showFall} />
                하락 섹션 표시
              </label>
            </div>
          </div>

          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 dark:bg-white dark:text-black">
            저장
          </button>
        </form>

        <div className="flex items-center justify-between">
          <Link className="text-sm underline underline-offset-4" href="/reports">
            ← 리포트
          </Link>
          <Link className="text-sm underline underline-offset-4" href="/">
            홈
          </Link>
        </div>
      </div>
    </div>
  );
}
