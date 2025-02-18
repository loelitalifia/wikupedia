import { createConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const db = await createConnection();

      const [totalAlumni] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2;");
      const [totalAlumniBekerja] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2 AND pekerjaan IS NOT NULL;");
      const [totalAlumniKuliah] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2 AND pendidikan IS NOT NULL;");
      const [totalLoker] = await db.execute("SELECT COUNT(*) as total FROM loker;");
      const [totalAdmin] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 1;");
      const [dataPendingAlumni] = await db.execute("SELECT COUNT(*) as total FROM user WHERE id_role = 2 AND status = 'not_approved';");
      const [dataPendingPengumuman] = await db.execute("SELECT COUNT(*) as total FROM pengumuman WHERE status = 'not_approved';");
      const [dataPendingLoker] = await db.execute("SELECT COUNT(*) as total FROM loker WHERE status = 'not_approved';");
  
      return NextResponse.json({
        data: {
          totalAlumni: totalAlumni[0].total,
          totalAlumniBekerja: totalAlumniBekerja[0].total,
          totalAlumniKuliah: totalAlumniKuliah[0].total,
          totalLoker: totalLoker[0].total,
          dataPendingAlumni: dataPendingAlumni[0].total,
          dataPendingPengumuman: dataPendingPengumuman[0].total,
          dataPendingLoker: dataPendingLoker[0].total,
          totalAdmin: totalAdmin[0].total
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }