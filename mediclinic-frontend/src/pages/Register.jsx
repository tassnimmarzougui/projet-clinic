import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Lock, ArrowLeft, Heart } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 0, // 0 for Male, 1 for Female
    password: '' // Note: Add this to your DB model if needed
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Ba3th el data lel API .NET mte3ek
      await axios.post("http://localhost:5268/api/Patients", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: parseInt(formData.gender)
      });
      
      // Success: Hezzou y-rezervi
      navigate('/patient/booking');
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 border border-gray-100 relative">
        
        <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-blue-600 flex items-center gap-2 mb-8 font-bold transition-colors">
          <ArrowLeft size={18} /> Retour au Login
        </button>

        <div className="text-center mb-10">
          <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white" fill="white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Créer un Compte</h2>
          <p className="text-gray-400 mt-2 font-medium">Rejoignez MediSynth pour un meilleur suivi médical</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom Complet</label>
            <div className="relative mt-2">
              <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" placeholder="Ahmed Ben Ali" 
                onChange={e => setFormData({...formData, name: e.target.value})} />
              <User className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          {/* Email */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
            <div className="relative mt-2">
              <input type="email" required className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" placeholder="ahmed@mail.com"
                onChange={e => setFormData({...formData, email: e.target.value})} />
              <Mail className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          {/* Téléphone */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
            <div className="relative mt-2">
              <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" placeholder="+216 ..."
                onChange={e => setFormData({...formData, phone: e.target.value})} />
              <Phone className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          {/* Date de Naissance */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Date de Naissance</label>
            <div className="relative mt-2">
              <input type="date" required className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
              <Calendar className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          {/* Genre */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Genre</label>
            <select className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="0">Masculin</option>
              <option value="1">Féminin</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Mot de passe</label>
            <div className="relative mt-2">
              <input type="password" required className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              <Lock className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          <button type="submit" className="col-span-2 bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all mt-4">
            Créer mon compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;