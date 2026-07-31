import { NextResponse } from "next/server";
import { getAnalyticsDashboardData } from "@/lib/services/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAnalyticsDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
