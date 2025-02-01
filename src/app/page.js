"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/alumni');
        const data = await response.json();

        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 pt-6">
      {loading ? (
        <p>Loading...</p>
      ) : alumni.length > 0 ? (
        alumni.map((item) => (
          <div key={item.id_alumni} className="grid">
            <label>Nama: {item.nama_alumni}</label>
            <label>Nama: {item.angkatan}</label>
            <label>Nama: {item.jenis_kelamin}</label>
          </div>
        ))
      ) : (
        <p>Tidak ada data alumni</p>
      )}
    </div>
  );
}
