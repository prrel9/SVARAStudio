import { NextRequest, NextResponse } from "next/server";
import { getAppSettings, saveAppSettings } from "@/lib/services/appSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await saveAppSettings(body);
    const updated = await getAppSettings();
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
