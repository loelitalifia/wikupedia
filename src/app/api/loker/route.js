import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM loker";
    const [alumni] = await db.execute(sql);
      
    return NextResponse.json({ data: alumni });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await createConnection();
    const body = await req.json();
    const { judul, deskripsi, perusahaan, lokasi, link } = body;

    if (!judul || !deskripsi || !perusahaan || !lokasi || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = "INSERT INTO loker (judul, deskripsi, perusahaan, lokasi, link) VALUES (?, ?, ?, ?)";
    const values = [judul, deskripsi, perusahaan, lokasi, link];

    const [result] = await db.execute(sql, values);

    return NextResponse.json({ message: "Job listing added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}