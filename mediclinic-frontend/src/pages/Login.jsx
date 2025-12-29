import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Heart, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // --- LOGIQUE DE SÉCURITÉ ET REDIRECTION ---
    
    // 1. Check ken hatha el Admin el wa7id (E-mail unique)
    if (email === 'admin@medisynth.com' && password === 'admin123') {
      console.log("Accès Admin Accordé");
      navigate('/admin/dashboard');
    } 
    // 2. Itha mridh (Patient) 3adi
    else if (email.length > 5 && password.length >= 4) {
      console.log("Accès Patient Accordé");
      navigate('/patient/booking');
    } 
    // 3. Itha famma ghalta
    else {
      setError("Identifiants invalides. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        
        {/* Design Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl"></div>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="text-gray-400 hover:text-blue-600 flex items-center gap-2 mb-8 font-bold transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Heart className="text-white" fill="white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Connexion</h2>
          <p className="text-gray-400 mt-2 font-medium">Accédez à votre espace santé</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Adresse Email</label>
            <div className="relative mt-2">
              <input 
                type="email" 
                required 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 font-medium placeholder:text-gray-300" 
                placeholder="exemple@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Mot de passe</label>
            </div>
            <div className="relative mt-2">
              <input 
                type="password" 
                required 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute right-4 top-4 text-gray-300" size={20} />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
            >
              Se Connecter
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-gray-50 pt-8">
          <p className="text-sm text-gray-500 font-medium">
            Vous n'avez pas de compte ? 
            <button 
              onClick={() => navigate('/register')} 
              className="text-blue-600 font-black ml-1 hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
    
  );
  
};

export default Login;