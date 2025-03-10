import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    const pending = searchParams.get("pending") || "";
    const user = searchParams.get("user") || "";
    
    let sql = "SELECT * FROM loker";
    if (pending) {
      sql += " WHERE status = 'not_approved'";
    } else if (user) {
      sql += " WHERE status = 'approved'";
    }

    const [loker] = await db.execute(sql);
      
    return NextResponse.json({ data: loker });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await createConnection();
    const body = await req.json();
    const { user_id, judul, deskripsi, perusahaan, lokasi, link, expired_date } = body;

    if (!judul || !deskripsi || !perusahaan || !lokasi || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = "INSERT INTO loker (user_id, judul, deskripsi, perusahaan, lokasi, link, status, expired_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [user_id, judul, deskripsi, perusahaan, lokasi, link, 'not_approved', expired_date];

    const [result] = await db.execute(sql, values);

    return NextResponse.json({ message: "Job listing added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}