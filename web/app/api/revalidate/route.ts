import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { getDataAsOf, invalidateDataCache } from "@/lib/data";

// 파이프라인이 데이터 갱신 후 호출 (contracts §2)
export async function POST(req: NextRequest) {
	const token = req.headers.get("x-revalidate-token");
	if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	invalidateDataCache();
	revalidatePath("/", "layout"); // 전체 트리 revalidate (안내·상세·sitemap 포함)

	return NextResponse.json({ revalidated: true, asOf: getDataAsOf() });
}
