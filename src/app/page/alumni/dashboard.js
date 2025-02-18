import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";

import Modal from '../../component/modal';

export default function DashboardAlumni() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [listLoker, setLoker] = useState([]);
  const [listAlumni, setAlumni] = useState([]);
  const [statistic, setStatistic] = useState({});

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    expired_date: "",
    link: "",
    perusahaan: "",
    lokasi: "",
    user_id: session?.user?.user_id
  });

  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const getLoker = async () => {
    try {
      const response = await fetch('/api/loker');
      const data = await response.json();

      setLoker(data.data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlumni = async () => {
    try {
      const response = await fetch(`/api/alumni?page=${page}&limit=${limit}&search=${search}`);
      const result = await response.json();
      setAlumni(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatistic = async () => {
    try {
      const response = await fetch(`/api/statistic`);
      const result = await response.json();
      setStatistic(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLoker();
    getStatistic();
  }, []);
  
  useEffect(() => {
    getAlumni();
  }, [page, search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMessage("");

    const response = await fetch("/api/loker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      // setMessage("Job listing added successfully!");
      setFormData({
        judul: "",
        deskripsi: "",
        expired_date: "",
        link: "",
        perusahaan: "",
        lokasi: ""
      });
      getLoker();
      setIsModalOpen(false);
    } else {
      console.log(data.error || "Failed to add job listing.");
    }
  };

  // const renderStatistik = (title, value) => {
  // return (
  //   // <div className="flex flex-col items-center max-w-lg p-6 mx-auto text-center bg-gradient-to-br from-red-100 to-orange-200 text-gray-900 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
  //   <div className="flex flex-col items-center max-w-lg p-6 mx-auto text-center bg-gradient-to-br from-red-100 to-orange-200 text-gray-900 rounded-xl shadow-md">
  //     <p className="text-lg font-semibold text-orange-800">{title}</p>
  //     <div className="flex items-center justify-center my-4">
  //       <span className="text-5xl font-extrabold text-orange-600">{value}</span>
  //     </div>
  //     <div className="w-14 h-1 bg-orange-500 rounded-full mt-3"></div>
  //   </div>
  //   );
  // };  

  const renderStatistik = (title, value) => {   
    return (
      <div className="flex flex-col items-center max-w-lg p-6 mx-auto text-center bg-gradient-to-br from-orange-50 via-orange to-red-50 text-gray-900 rounded-xl shadow-md">
        <p className="text-lg font-semibold text-orange-600">{title}</p>
        <div className="flex items-center justify-center my-4">
          <span className="text-5xl font-extrabold text-orange-700">{value}</span>
        </div>
        <div className="w-14 h-1 bg-orange-300 rounded-full mt-3"></div>
      </div>
    );
  };
  

  const renderLoker = (item) => {
    return (
      <div
        key={item.id_loker}
        className="flex flex-col h-full max-w-lg p-6 text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
      >
         <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:text-xl font-semibold underline"
        >
           {item.judul}
        </a>
        <p className="font-light text-gray-500 sm:text-sm dark:text-gray-400 mb-3">
          {item.perusahaan} | {item.lokasi}
        </p>
        <p className="font-light text-gray-500 sm:text dark:text-gray-400 flex-grow">
          {item.deskripsi}
        </p>
      </div>
    );
  };  

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" name="judul" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Masukkan judul" onChange={handleChange} required />
          </div>
          <div>
            <textarea name="deskripsi" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Masukkan deskripsi" rows="3" onChange={handleChange} required></textarea>
          </div>
          <div>
            <input type="url" name="link" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="https://example.com" onChange={handleChange} required />
          </div>
          <div>
            <input type="text" name="perusahaan" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nama perusahaan" onChange={handleChange} required />
          </div>
          <div>
            <input type="text" name="lokasi" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lokasi pekerjaan" onChange={handleChange} required />
          </div>
          <div>
            <input type="date" name="expired_date" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">
            Tambah Loker
          </button>
        </form>
      </Modal>
    )
  }

  return (
      <div>
        <header className="fixed w-full">
          <nav className="bg-white border-gray-200 py-6 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-8 mx-auto">
              <a href="#" className="flex items-center">
                <img src="/images/logo_telkom.png" className="h-6 mr-3 sm:h-9" alt="Landwind Logo" />
              </a>
              {/* <div className="flex items-center lg:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800"
                >
                  Tambah Loker
                </button>
                <button 
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </div>   */}

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Tambah Loker
                </button>
                <div className="relative text-gray-700">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    // src={session?.user?.profileImage ? `data:image/png;base64,${session?.user?.profileImage}` : '/images/user.png'} // Sesuaikan tipe gambar (png, jpg, dll)
                    src={'/images/user.png'} 
                    alt="Profile"
                    className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white"
                  />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Edit Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
      </header>

      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-20 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28 bg-gray">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-600 md:text-5xl xl:text-6xl dark:text-gray-400">
              The Real Informatics School.
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Pelopor SMK bidang Teknologi dan Informatika di Indonesia</p>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/images/programmer.png" alt="hero image" />
          </div>                
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-8 lg:px-6">
          <div className="space-y-8 lg:grid lg:grid-cols-4 sm:gap-6 xl:gap-10 lg:space-y-0">
            {renderStatistik('Jumlah Alumni', statistic.totalAlumni || 0)}
            {renderStatistik('Alumni Bekerja', statistic.totalAlumniBekerja || 0)}
            {renderStatistik('Alumni Kuliah', statistic.totalAlumniKuliah || 0)}
            {renderStatistik('Loker Berjalan', statistic.totalLoker)}
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-8 lg:px-6">
          <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Lowongan Pekerjaan</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Berikut Lowongan Pekerjaan yang di share oleh Alumni dan Sekolah</p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 px-6">
            {listLoker && listLoker.map((item) => {
              return renderLoker(item)
            })}
          </div>
        </div>
      </section>
      
      <section className="bg-white dark:bg-gray-800">
        <div className="p-6 bg-gray-100 justify-center items-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-center text-gray-900 dark:text-white">Alumni</h2>
          <div className="w-full p-6 rounded-lg">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full text-gray-700 mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <table className="w-full text-sm text-left border border-gray-200 rounded-lg shadow-md dark:border-gray-700 border-separate border-spacing-0 overflow-hidden">
              <thead className="bg-gradient-to-br from-orange-50 via-orange to-red-50 text-gray-700 uppercase dark:bg-orange-100 dark:text-gray-200 rounded-t-lg">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg w-12">No</th>
                  <th className="px-6 py-3 rounded-tl-lg w-56">Nama</th>
                  <th className="px-6 py-3 text-center">Angkatan</th>
                  <th className="px-6 py-3 text-center">Jurusan</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 rounded-tr-lg">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {listAlumni && listAlumni.map((row, index) => (
                  <tr
                    key={index}
                    className={`text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 ${
                    index === listAlumni.length - 1 ? "last:border-none" : ""}`}
                  >
                    <td className={`px-6 py-4 ${index === listAlumni.length - 1 ? "rounded-bl-lg" : ""}`}>
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className={`px-6 py-4 ${index === listAlumni.length - 1 ? "rounded-bl-lg" : ""}`}>
                      {row.nama}
                    </td>
                    <td className="px-6 py-4 text-center">{row.angkatan}</td>
                    <td className="px-6 py-4 text-center">{row.jurusan}</td>
                    <td className="px-6 py-4">{row.email}</td>
                    <td className={`px-6 py-4 ${index === listAlumni.length - 1 ? "rounded-br-lg" : ""}`}>
                      Detail
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-lg disabled:bg-gray-500"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                « Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${page === i + 1 ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-700"}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-lg disabled:bg-gray-500"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-white dark:bg-gray-800">
          <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
              <div className="text-center">
                  <a href="#" className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white">
                      <img src="/images/logo_telkom.png" className="h-6 mr-3 sm:h-9" alt="Landwind Logo" />
                      <img src="/images/wikusama.jpg" className="h-15 mr-3 sm:h-15" alt="Landwind Logo" />   
                  </a>
                  <span className="block text-sm text-center text-gray-500 dark:text-gray-400">© 2021-2022 Landwind™. All Rights Reserved. Built with <a href="https://flowbite.com" className="text-orange-600 hover:underline dark:text-orange-500">Flowbite</a> and <a href="https://tailwindcss.com" className="text-orange-600 hover:underline dark:text-orange-500">Tailwind CSS</a>. Distributed by <a href="https://themewagon.com/" className="text-orange-600 hover:underline dark:text-orange-500">ThemeWagon</a>
                  </span>
                  <ul className="flex justify-center mt-5 space-x-5">
                      <li>
                          <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                          </a>
                      </li>
                      <li>
                          <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" /></svg>
                          </a>
                      </li>
                  </ul>
              </div>
          </div>
      </footer>

      {renderModal()}
    </div>
  );
}