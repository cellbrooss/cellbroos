import { NextResponse } from "next/server";
import { DbService } from "@/lib/db-service";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const settings = await DbService.getSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("cellbroos_admin_session")?.value;
    if (session !== "true") {
      return NextResponse.json({ error: "Yetkisiz işlem!" }, { status: 401 });
    }

    const settings = await request.json();
    const saved = await DbService.saveSettings(settings);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
