import Modal from '@/app/component/modal';
import Popup from '@/app/component/popup';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Content() {
  const { data: session } = useSession()
  
  const [statistic, setStatistic] = useState({});
  const [listAlumni, setAlumni] = useState([]);
  const [listLoker, setLoker] = useState([]);
  const [detailAlumni, setDetailAlumni] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);

  const onOpenModal = (item) => {
    setIsModalOpen(true);
    setDetailAlumni(item);
  }

  const getStatistic = async () => {
    try {
      const response = await fetch(`/api/statistic`);
      const result = await response.json();
      setStatistic(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAlumni = async () => {
    try {
      const response = await fetch(`/api/alumni?pending=${true}`);
      const result = await response.json();
      setAlumni(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getLoker = async () => {
    try {
      const response = await fetch(`/api/loker?pending=${true}`);
      const data = await response.json();

      setLoker(data.data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMessage("");

    const response = await fetch("/api/alumni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
    //   // setMessage("Job listing added successfully!");
    //   setFormData({
    //     judul: "",
    //     deskripsi: "",
    //     expired_date: "",
    //     link: "",
    //     perusahaan: "",
    //     lokasi: ""
    //   });
      // getLoker();
      setIsModalConfirmationOpen(false);
    } else {
      console.log(data.error || "Failed to add job listing.");
    }
  };


  useEffect(() => {
    getAlumni();
    getLoker()
  }, []);

  useEffect (() => {
    getStatistic()
  }, []);

  const renderStatistik = (deskripsi, value) => {
    return (
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">{value}</span>
            <h3 className="text-base font-normal text-gray-500">{deskripsi}</h3>
          </div>
        </div>
      </div>
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
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                {/* <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Jurusan</th> */}
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Angkatan</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Jurusan</th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listAlumni && listAlumni.length > 0 ? (
                listAlumni.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{index + 1}</td>
                    <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                      <img className="h-10 w-10 rounded-full" src="/images/user.png" />
                      <div className="text-sm font-normal text-gray-500">
                        <div className="text-base font-semibold text-gray-900">{item.nama}</div>
                        <div className="text-sm font-normal text-gray-500">{item.email}</div>
                      </div>
                    </td>
                    {/* <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item.jurusan}</td> */}
                    <td className="text-center p-4 whitespace-nowrap text-base font-medium text-gray-900">{item.angkatan}</td>
                    <td className="text-center p-4 whitespace-nowrap text-base font-medium text-gray-900">{item.jurusan}</td>
                    <td className="text-center p-4 whitespace-nowrap text-base font-normal text-gray-900">
                      <span className={`px-2 py-1 rounded-lg text-white text-sm font-medium ${item.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {item.status === 'approved' ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap space-x-2 text-right align-middle">
                      <button onClick={() => setIsModalConfirmationOpen(true)} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-3 py-2">
                        Approve
                      </button>
                      <button className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2">
                        Reject
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

  const generateTableLoker = () => {
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
                      <button onClick={() => setIsModalConfirmationOpen(true)} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-3 py-2">
                        Approve
                      </button>
                      <button onClick={() => deleteUser(item.user_id)} className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-3 py-2">
                        Reject
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

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  const handleConfirmData = () => {

  }

  return (
    <div className="pt-6 px-4">
      <div className="w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 2xl:col-span-2">
          <div className="flex-shrink-0">
            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
              Welcome Back, Bu {session?.user?.nama} !
            </span>
            <h3 className="text-base font-normal text-gray-500">{formattedDate}</h3>
          </div>
        </div>
      </div>
      
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {renderStatistik('Data Pending', statistic.dataPendingAlumni + statistic.dataPendingLoker || 0)}
        {renderStatistik('Jumlah Loker', statistic.totalLoker || 0)}
        {renderStatistik('Jumlah Alumni', statistic.totalAlumni || 0)}
        {renderStatistik('Jumlah Admin', statistic.totalAdmin || 0)}
      </div>

    <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
      <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900">Data Pending</h3>
        </div>

        <div className="align-middle inline-block min-w-full">
          {generateTable()} 
          {generateTableLoker()}
          {renderModal()}
          <Popup
            isOpen={isModalConfirmationOpen}
            // onConfirm={handleConfirmData}
            onCancel={() => setIsModalConfirmationOpen(false)}
            message="Apakah Anda yakin ingin meng-approve data ini?"
          />
        </div>
      </div>
    </div>
</div>
  )
}