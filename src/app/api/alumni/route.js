import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const pending = searchParams.get("pending") || "";
    const offset = (page - 1) * limit;

    // Query dasar
    let sql = "SELECT * FROM user WHERE id_role = 2";
    let countSql = "SELECT COUNT(*) as total FROM user WHERE id_role = 2";
    
    // Inisialisasi params sebagai array kosong
    const params = [];

    // Tambahkan filter pencarian jika ada input search
    if (search) {
      sql += " AND nama LIKE ?";
      countSql += " AND nama LIKE ?";
      params.push(`%${search}%`);
    }

    if (pending) {
      sql += " AND status = 'not_approved'";
    }

    sql += " ORDER BY nama ASC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Eksekusi query
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

export async function POST(req) {
  try {
    const db = await createConnection();
    const body = await req.json();
    const { email, password, id_role, nama, angkatan, jurusan, status } = body;

    // if (!judul || !deskripsi || !perusahaan || !lokasi || !link) {
    //   return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    // }

    const sql = "INSERT INTO user ( email, password, id_role, nama, angkatan, jurusan, status ) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [email, password, id_role, nama, angkatan, jurusan, status];    

    const [result] = await db.execute(sql, values);

    return NextResponse.json({ message: "Job listing added successfully", id: result.insertId });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const db = await createConnection();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const sql = "DELETE FROM user WHERE user_id = ?";
    const [result] = await db.execute(sql, [userId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

