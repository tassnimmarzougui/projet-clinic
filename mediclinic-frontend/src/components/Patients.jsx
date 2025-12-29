import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, Search, Edit, Trash2, Phone, Mail, 
  Calendar, User, History, X, Info 
} from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 0
  });

  useEffect(() => { 
    fetchPatients(); 
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5268/api/Patients");
      setPatients(res.data);
    } catch (err) { 
      console.error("Erreur chargement patients", err); 
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone || !newPatient.dateOfBirth) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      await axios.post("http://localhost:5268/api/Patients", newPatient);
      setShowAddModal(false);
      setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', gender: 0 });
      fetchPatients();
    } catch (err) { 
      alert(err.response?.data?.message || "Erreur lors de l'ajout du patient"); 
    }
  };

  const viewDetails = async (id) => {
    try {
      const patientRes = await axios.get(`http://localhost:5268/api/Patients/${id}`);
      setSelectedPatient(patientRes.data);
      
      try {
        const historyRes = await axios.get(`http://localhost:5268/api/Appointments/patient/${id}`);
        setPatientHistory(historyRes.data);
      } catch (historyErr) {
        console.log("Pas d'historique disponible");
        setPatientHistory([]);
      }
      
      setShowDetailsModal(true);
    } catch (err) { 
      console.error("Erreur détails", err); 
      alert("Erreur lors de la récupération des détails");
    }
  };

  const deletePatient = async (id) => {
    if (window.confirm("Etes-vous sûr de vouloir supprimer ce patient ?")) {
      try {
        await axios.delete(`http://localhost:5268/api/Patients/${id}`);
        fetchPatients();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (gender) => {
    return gender === 1 ? "Féminin" : "Masculin";
  };

  const getGenderColor = (gender) => {
    return gender === 1 ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600";
  };

  const filteredPatients = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-800">Espace Patients</h2>
          <p className="text-gray-500 text-sm">Gérez vos dossiers patients et leur historique.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-bold"
        >
          <UserPlus size={20} /> Nouveau Patient
        </button>
      </div>

      {/* --- RECHERCHE --- */}
      <div className="relative mb-8 max-w-md">
        <input 
          type="text" 
          placeholder="Rechercher par nom, email ou téléphone..." 
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
      </div>

      {/* --- TABLEAU --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucun patient trouvé
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-5">Patient</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5 text-center">Date de Naissance</th>
                <th className="px-8 py-5 text-center">Genre</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getGenderColor(p.gender)}`}>
                        {p.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{p.name || 'Nom non spécifié'}</div>
                        <div className="text-xs text-gray-400">ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      {p.phone && (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <Phone size={14} />
                          {p.phone}
                        </div>
                      )}
                      {p.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Mail size={14} />
                          {p.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="font-bold text-gray-700">{formatDate(p.dateOfBirth)}</div>
                    {p.dateOfBirth && (
                      <div className="text-xs text-gray-400">{calculateAge(p.dateOfBirth)} ans</div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 rounded-lg text-xs font-black bg-gray-100 text-gray-600">{getGenderLabel(p.gender)}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => viewDetails(p.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl" title="Détails">
                        <Info size={18}/>
                      </button>
                      <button onClick={() => deletePatient(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl" title="Supprimer">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- MODAL AJOUT --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-10 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                <UserPlus className="text-blue-600" /> Inscrire un Patient
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Nom Complet *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: Ahmed Ben Ali" 
                  value={newPatient.name}
                  onChange={e => setNewPatient({...newPatient, name: e.target.value})} 
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Email</label>
                <input 
                  type="email" 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="patient@mail.com" 
                  value={newPatient.email}
                  onChange={e => setNewPatient({...newPatient, email: e.target.value})} 
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Téléphone *</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="+216 ..." 
                  value={newPatient.phone}
                  onChange={e => setNewPatient({...newPatient, phone: e.target.value})} 
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Date de Naissance *</label>
                <input 
                  type="date" 
                  required 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" 
                  value={newPatient.dateOfBirth}
                  onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} 
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Genre *</label>
                <select 
                  className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" 
                  value={newPatient.gender}
                  onChange={e => setNewPatient({...newPatient, gender: parseInt(e.target.value)})}
                >
                  <option value="0">Masculin</option>
                  <option value="1">Féminin</option>
                </select>
              </div>
              
              <div className="col-span-2 flex gap-4 mt-6">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Enregistrer
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAILS (HISTORIQUE) --- */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => {setShowDetailsModal(false); setSelectedPatient(null); setPatientHistory([]);}} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20}/>
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 ${getGenderColor(selectedPatient.gender)} rounded-2xl flex items-center justify-center text-2xl font-black uppercase`}>
                {selectedPatient.name?.charAt(0) || '?'}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800">{selectedPatient.name || 'Nom non spécifié'}</h3>
                <p className="text-blue-600 font-bold">{getGenderLabel(selectedPatient.gender)} • {selectedPatient.phone || 'N/A'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  {selectedPatient.email && (<div className="flex items-center gap-1"><Mail size={14}/>{selectedPatient.email}</div>)}
                  {selectedPatient.dateOfBirth && (<div className="flex items-center gap-1"><Calendar size={14}/>{formatDate(selectedPatient.dateOfBirth)} ({calculateAge(selectedPatient.dateOfBirth)} ans)</div>)}
                </div>
              </div>
            </div>

            <h4 className="flex items-center gap-2 font-black text-gray-700 mb-4 uppercase text-xs tracking-widest">
              <History size={16} /> Historique des Rendez-vous
            </h4>
            
            <div className="space-y-3">
              {patientHistory.length > 0 ? patientHistory.map(h => (
                <div key={h.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-800">{formatDate(h.appointmentDate || h.date)}</p>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">Médecin: <span className="text-gray-600">{h.doctorName || 'N/A'}</span></p>
                    {h.reason && (<p className="text-xs text-gray-500 mt-1">{h.reason}</p>)}
                  </div>
                  <div className="text-right">
                    {h.cost && (<p className="font-black text-blue-600">{h.cost} DT</p>)}
                    {h.status && (
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full italic ${
                        h.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        h.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        h.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {h.status}
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <History className="mx-auto text-gray-300 mb-2" size={48} />
                  <p className="text-gray-400 italic font-medium">Aucun rendez-vous enregistré.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
