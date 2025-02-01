import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM alumni";
    const [alumni] = await db.execute(sql);
      
    return NextResponse.json(alumni);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}