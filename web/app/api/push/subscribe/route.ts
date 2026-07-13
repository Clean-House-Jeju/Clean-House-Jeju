import { type NextRequest, NextResponse } from "next/server";
import { removeSub, upsertSub } from "@/lib/push-store";

export async function POST(req: NextRequest) {
	const body = (await req.json().catch(() => null)) as {
		endpoint?: string;
		keys?: { p256dh: string; auth: string };
	} | null;
	if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
		return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
	}
	upsertSub({ endpoint: body.endpoint, keys: body.keys });
	return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
	const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
	if (!body?.endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });
	removeSub(body.endpoint);
	return NextResponse.json({ ok: true });
}
