import { useEffect, useState } from 'react';

import Modal from '../../component/modal';
import Popup from '@/app/component/popup';

export default function Loker() {
  const [listLoker, setLoker] = useState([]);
  const [search, setSearch] = useState('');
  const [detailAlumni, setDetailAlumni] = useState({});
  const [selectedId, setTargetId] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddUserOpen, setIsModalUserOpen] = useState(false);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    id_role: "2",
    nama: "",
    angkatan: "",
    jurusan: "",
    status: "not_approved",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (message, type) => {
    console.log('dhdgfu');
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 100000); // Hilang setelah 3 detik
  };
  
  const onOpenModal = (item) => {
    setIsModalOpen(true);
    setDetailAlumni(item);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification('Data berhasil disimpan!', 'success');
        setFormData({
          email: "",
          password: "",
          id_role: "2",
          nama: "",
          angkatan: "",
          jurusan: "",
          status: "not_approved",
        });
        getLoker();
        setIsModalUserOpen(false);
      } else {
        showNotification('Gagal menyimpan data!', 'error');
      }
    } catch (error) {
      showNotification('Terjadi kesalahan server!', 'error');
    }
  };

  const renderModalConfirmation = () => {
    return (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-4xl mx-auto bg-white flex items-center gap-6">
        <div className="w-32 h-32 flex-shrink-0">
            <img
            src={"images/user.png"}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-blue-500"
            />
        </div>
        
        {/* Detail User */}
          <div className="flex-1">
            <p className="text-gray-600">Apakah kamu yakin ingin meghapus data ini?</p>
            <div className="flex p-4 justify-end">
                      <button onClick={() => onOpenModal(item)} className="mr-2 text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-3 py-2">
                        Approve Perubahan Data
                      </button>
                      <button onClick={() => setIsModalOpen(false)} className="text-white bg-gray-600 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2">
                        Cancel
                      </button>
                    </div>
          </div>
        </div>
      </Modal>
    )
  }

  const onDeleteUser = async (id) => {
    setIsModalConfirmationOpen(true);
    setTargetId(id);
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/alumni?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        getLoker();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getLoker = async () => {
    try {
      const response = await fetch(`/api/loker?page=${page}&limit=${limit}&search=${search}`);
      const result = await response.json();
      setLoker(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLoker();
  }, [page, search]);

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="max-w-4xl mx-auto bg-white flex items-center gap-6">
        <div className="w-32 h-32 flex-shrink-0">
            <img
            src={"images/user.png"}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-blue-500"
            />
        </div>
        
        {/* Detail User */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{detailAlumni.nama}</h2>
            <p className="text-gray-600">{detailAlumni.email}</p>
            <p className="text-gray-600">{detailAlumni.phone}</p>
            <hr className="my-3" />
            <table>
            <tr>
                <td className="font-semibold">Angkatan</td>
                <td>:</td>
                <td>{detailAlumni.angkatan}</td>
              </tr>
              <tr>
                <td className="font-semibold">Jurusan</td>
                <td>:</td>
                <td>{detailAlumni.jurusan === 'RPL' ? 'Rekayasa Perangkat Lunak' : 'Teknik Komputer Jaringan'}</td>
              </tr>
              <tr>
                <td className="font-semibold">Pendidikan</td>
                <td>:</td>
                <td>{detailAlumni.pendidikan}</td>
              </tr>
              <tr>
                <td className="font-semibold">Pekerjaan</td>
                <td>:</td>
                <td>{detailAlumni.pekerjaan}</td>
              </tr>
            </table>
          </div>
        </div>
      </Modal>
    )
  }

  const renderModalAddUser = () => {
    return (
      <Modal isOpen={isModalAddUserOpen} onClose={() => setIsModalUserOpen(false)}>
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Add User</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input type="email" name="email" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Email" onChange={handleChange} required />
            </div>
            <div>
              <input type="password" name="password" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Password" onChange={handleChange} required />
            </div>
            <div>
              <input type="text" name="nama" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nama" onChange={handleChange} required />
            </div>
            <div>
              <input type="text" name="angkatan" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Angkatan" onChange={handleChange} required />
            </div>
            <div>
              <select name="jurusan" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleChange} required>
                <option value="">Pilih Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
                <option value="DKV">DKV</option>
              </select>
            </div>
            {/* <div>
              <input type="file" name="profileImage" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" onChange={handleChange} />
            </div> */}
            <button type="submit" className="w-full text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">
              Submit
            </button>
          </form>
      </Modal>
    )
  }

  const generateTable = () => {
    return (
      <div className="align-middle inline-block min-w-full mb-5">
        <div className="shadow overflow-hidden">
        <table className="table-fixed min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Judul</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Deskripsi</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Link</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listLoker && listLoker.length > 0 ? (
                listLoker.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{index + 1}</td>
                    <td className="text-center p-4 whitespace-nowrap text-base font-medium text-gray-900">{item.judul}</td>
                    <td className="p-4 whitespace-normal break-words w-1/4 text-base font-medium text-gray-900">
                        {item.deskripsi}
                    </td>
                    <td className="p-4 whitespace-normal break-words w-1/4 text-base font-medium text-gray-900">
                        {item.link}
                    </td>
                    <td className="text-center p-4 whitespace-nowrap text-base font-normal text-gray-900">
                      <span className={`px-2 py-1 rounded-lg text-white text-sm font-medium ${item.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {item.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap space-x-2">
                      <button onClick={() => onOpenModal(item)} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-3 py-2">
                        Detail
                      </button>
                      <button onClick={() => onDeleteUser(item.user_id)} className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">Tidak ada data alumni.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };  

  return (
    <div className="p-4">
      <div className="w-full">
        <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
          <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
            <div className="flex justify-between items-center my-3">
            <h3 className="text-2xl font-bold leading-none text-gray-900">Management Loker</h3>
              <button onClick={() => setIsModalUserOpen(true)} type="submit" className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none dark:focus:ring-orange-800">
                Tambah Loker
              </button>
            </div>
            {/* <input 
              type="text" 
              placeholder="Search..." 
              className="w-full text-gray-700 mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            /> */}
            {generateTable()}
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

        {renderModal()}
        {renderModalAddUser()}
        <Popup
          isOpen={isModalConfirmationOpen}
          onConfirm={handleDelete}
          onCancel={() => setIsModalConfirmationOpen(false)}
          message="Apakah Anda yakin ingin menghapus data ini?"
        />
      </div> 
    </div>
  )
}