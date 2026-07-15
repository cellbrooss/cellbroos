import { NextResponse } from "next/server";
import { DbService } from "@/lib/db-service";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const products = await DbService.getProducts();
    return NextResponse.json(products);
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

    const products = await request.json();
    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of products." }, { status: 400 });
    }
    const saved = await DbService.saveProducts(products);
    return NextResponse.json(saved);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
