import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const db = await createConnection();
  
      // Query untuk menghitung total alumni
      const [totalAlumni] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2;");
      const [totalAlumniBekerja] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2 AND pekerjaan IS NOT NULL;");
      const [totalAlumniKuliah] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2 AND pendidikan IS NOT NULL;");
      const [totalLoker] = await db.execute("SELECT COUNT(*) as total FROM loker;");
  
      return NextResponse.json({
        data: {
          totalAlumni: totalAlumni[0].total,
          totalAlumniBekerja: totalAlumniBekerja[0].total,
          totalAlumniKuliah: totalAlumniKuliah[0].total,
          totalLoker: totalLoker[0].total,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }