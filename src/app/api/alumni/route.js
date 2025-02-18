import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Query dasar
    let sql = "SELECT * FROM user WHERE id_role = 2";
    let countSql = "SELECT COUNT(*) as total FROM user WHERE id_role = 2";
    const params = [];

    // Tambahkan filter pencarian jika ada input search
    if (search) {
      sql += " AND nama LIKE ?";
      countSql += " AND nama LIKE ?";
      params.push(`%${search}%`);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [alumni] = await db.execute(sql, params);
    const [countResult] = await db.execute(countSql, params.slice(0, -2)); // Query count tanpa LIMIT & OFFSET
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      data: alumni,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
