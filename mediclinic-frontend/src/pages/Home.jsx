import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Shield, Users, ArrowRight, MapPin, Phone } from 'lucide-react';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-10 py-6 sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-black text-2xl">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Heart fill="currentColor" size={20}/>
          </div>
          MediSynth
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-gray-500">
          <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">Clinique</a>
          <button onClick={() => navigate('/login')} className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-all">
            Connexion
          </button>
          <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
            Créer un compte
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-20 px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest">
            Bienvenue chez MediSynth
          </span>
          <h1 className="text-7xl font-black text-gray-900 mt-6 leading-[1.1]">
            Votre santé, <br /> 
            <span className="text-blue-600 text-6xl">notre priorité absolue.</span>
          </h1>
          <p className="text-gray-400 mt-8 text-lg font-medium leading-relaxed">
            Une équipe de spécialistes à votre écoute au Kef. Réservez votre consultation en ligne et bénéficiez d'un suivi médical moderne.
          </p>
          
          <div className="mt-10 flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="bg-blue-600 text-white px-8 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
            >
              Prendre Rendez-vous <ArrowRight size={22}/>
            </button>
            <div className="flex items-center gap-4 px-6 py-4 border-2 border-gray-50 rounded-[24px]">
               <div className="bg-green-100 p-2 rounded-full text-green-600"><Phone size={20}/></div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Appelez-nous</p>
                  <p className="font-black text-gray-800">+216 71 000 000</p>
               </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Illustration */}
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <img 
            src="https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg" 
            alt="Doctor" 
            className="rounded-[60px] shadow-3xl relative z-10 border-[12px] border-white"
          />
          {/* Card Flottante */}
          <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-[32px] shadow-2xl z-20 flex items-center gap-4 animate-bounce-slow">
             <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><Activity /></div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Spécialistes</p>
                <p className="font-black text-gray-800 text-lg">15+ Docteurs</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES / SPÉCIALITÉS --- */}
      <section id="services" className="bg-gray-50 py-24 px-10 rounded-[80px]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-gray-800">Nos Spécialités</h2>
          <p className="text-gray-400 mt-4 font-medium">Une prise en charge complète pour toute la famille.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { title: "Cardiologie", icon: <Activity className="text-red-500"/>, desc: "Bilan complet du coeur et suivi hypertension." },
            { title: "Pédiatrie", icon: <Users className="text-blue-500"/>, desc: "Soins spécialisés pour les nourrissons et enfants." },
            { title: "Généraliste", icon: <Shield className="text-green-500"/>, desc: "Consultations quotidiennes et médecine préventive." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-white hover:border-blue-100 transition-all hover:shadow-2xl group">
               <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {item.icon}
               </div>
               <h3 className="text-xl font-black text-gray-800">{item.title}</h3>
               <p className="text-gray-400 mt-4 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;