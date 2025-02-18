import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Content() {
  const { data: session } = useSession()
  
  const [statistic, setStatistic] = useState({});

  const getStatistic = async () => {
    try {
      const response = await fetch(`/api/statistic`);
      const result = await response.json();
      setStatistic(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  return (
    <div className="pt-6 px-4">
      <div className="w-full">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 2xl:col-span-2">
          <div className="flex-shrink-0">
            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
              Welcome Back, {session?.user?.nama} !
            </span>
            <h3 className="text-base font-normal text-gray-500">Sales this week</h3>
          </div>
        </div>
      </div>
      
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {renderStatistik('Data Pending', statistic.dataPendingAlumni + statistic.dataPendingPengumuman + statistic.dataPendingLoker || 0)}
        {renderStatistik('Jumlah Loker', statistic.totalLoker || 0)}
        {renderStatistik('Jumlah Alumni', statistic.totalAlumni || 0)}
        {renderStatistik('Jumlah Admin', statistic.totalAdmin || 0)}
      </div>

    <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
      <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900">Approval Alumni</h3>
        </div>

        <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden">
                <table className="table-fixed min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Position
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Country
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th scope="col" className="p-4">
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-100">
                            <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                                <img className="h-10 w-10 rounded-full" src="/images/user.png" />
                                <div className="text-sm font-normal text-gray-500">
                                    <div className="text-base font-semibold text-gray-900">ddk</div>
                                    <div className="text-sm font-normal text-gray-500">dd</div>
                                </div>
                            </td>
                            <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">ddd</td>
                            <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">www</td>
                            <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                <div className="flex items-center">
                                    {/* <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> {{ else }}  */}
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> Active
                                </div>
                            </td>
                            <td className="p-4 whitespace-nowrap space-x-2">
                                <button type="button" data-modal-toggle="user-modal" className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                                    Edit user
                                </button>
                                <button type="button" data-modal-toggle="delete-user-modal" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                    Delete user
                                </button>
                            </td>
                        </tr>
                    
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
</div>
  )
}