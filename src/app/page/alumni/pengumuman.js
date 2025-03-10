import { useState } from "react";

const PengumumanModal = ({ pengumuman, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || pengumuman.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < pengumuman.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold">{pengumuman[currentIndex].judul}</h2>
        <p className="mt-2">{pengumuman[currentIndex].deskripsi}</p>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Close
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const PengumumanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pengumumanData = [
    { judul: "Pendaftaran Beasiswa", deskripsi: "Beasiswa 2025 telah dibuka." },
    { judul: "Lowongan Magang", deskripsi: "PT XYZ membuka lowongan magang." },
    { judul: "Perubahan Jadwal Wisuda", deskripsi: "Wisuda diundur ke 15 Agustus." },
  ];

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Buka Pengumuman
      </button>

      <PengumumanModal
        pengumuman={pengumumanData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PengumumanPage;
