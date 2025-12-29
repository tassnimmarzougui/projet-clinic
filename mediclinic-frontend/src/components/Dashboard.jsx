import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Calendar, DollarSign, Activity, 
  Trash2, Clock, CheckCircle, AlertCircle, RefreshCcw
} from 'lucide-react';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    uniquePatients: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Njibou el data mel API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Thabbet f-el URL hadhom (lezem ikounou s7a7 3la 7asb el Backend mte3ek)
      const statsRes = await axios.get("http://localhost:5268/api/Appointments/stats");
      const appRes = await axios.get("http://localhost:5268/api/Appointments");

      // N-thabtou ennou el data jete mrigla
      setAppointments(appRes.data || []);
      setStats({
        totalRevenue: statsRes.data.totalRevenueToday || 0, // Baddel el field name kenna mokhtelef f-el Backend
        totalAppointments: statsRes.data.totalAppointmentsToday || 0,
        uniquePatients: statsRes.data.totalPatients || 0,
        pendingAppointments: statsRes.data.pendingAppointments || 0
      });
      setError(null);
    } catch (error) {
      console.error("Erreur API:", error);
      setError("Impossible de se connecter au serveur. Vérifiez que le Backend est lancé.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Fonction el Delete
  const handleDelete = async (id) => {
    if (window.confirm("T7eb tfassakh el rendez-vous hatha?")) {
      try {
        await axios.delete(`http://localhost:5268/api/Appointments/${id}`);
        // Refresh auto mel list
        setAppointments(appointments.filter(app => app.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-gray-500 font-bold">Chargement du Dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black text-gray-800 mb-2">Oups ! Erreur de connexion</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <button onClick={fetchData} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all">
        <RefreshCcw size={18} /> Réessayer
      </button>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">MediClinic Dashboard</h1>
          <p className="text-gray-400 font-medium mt-1">Gestion centrale des rendez-vous et statistiques.</p>
        </div>
        <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          Le Kef, Tunisie
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Revenu" value={`${stats.totalRevenue} DT`} icon={<DollarSign />} color="bg-emerald-500" />
        <StatCard title="Rendez-vous" value={stats.totalAppointments} icon={<Calendar />} color="bg-blue-600" />
        <StatCard title="Patients" value={stats.uniquePatients} icon={<Users />} color="bg-indigo-600" />
        <StatCard title="En Attente" value={stats.pendingAppointments} icon={<Activity />} color="bg-orange-500" />
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800">Dernières Activités</h2>
          <button onClick={fetchData} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <RefreshCcw size={20} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 uppercase text-[11px] tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5 font-black">Date & Heure</th>
                <th className="px-8 py-5 font-black">Patient</th>
                <th className="px-8 py-5 font-black">Médecin</th>
                <th className="px-8 py-5 font-black text-right">Coût</th>
                <th className="px-8 py-5 font-black">Statut</th>
                <th className="px-8 py-5 text-center font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-8 py-5 text-sm text-gray-500 font-bold">
                      {new Date(app.appointmentDate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-8 py-5 font-black text-gray-800">{app.patientName}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium">Dr. {app.doctorName}</td>
                    <td className="px-8 py-5 font-black text-emerald-600 text-right">{app.cost} DT</td>
                    <td className="px-8 py-5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleDelete(app.id)} 
                        className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center text-gray-400 font-bold">
                    Aucun rendez-vous enregistré pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-6 border border-gray-50 hover:scale-[1.02] transition-transform duration-300">
    <div className={`${color} p-5 rounded-2xl text-white shadow-lg shadow-gray-200`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-800 tracking-tight">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    Completed: { style: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <CheckCircle size={14} /> },
    Confirmed: { style: "bg-blue-50 text-blue-600 border-blue-100", icon: <CheckCircle size={14} /> },
    Pending: { style: "bg-orange-50 text-orange-600 border-orange-100", icon: <Clock size={14} /> },
    Cancelled: { style: "bg-rose-50 text-rose-600 border-rose-100", icon: <AlertCircle size={14} /> }
  };
  
  const current = config[status] || { style: "bg-gray-100 text-gray-500", icon: null };

  return (
    <span className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${current.style}`}>
      {current.icon} {status}
    </span>
  );
};

export default Dashboard;