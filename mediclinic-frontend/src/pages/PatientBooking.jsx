import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, LogOut, CalendarDays, CheckCircle, ArrowLeft } from 'lucide-react';

const API_BASE_URL = "http://localhost:5268/api";

const PatientBooking = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const patientId = userData.id || 1; // ID 1 par défaut (Ahmed Ammar)

  // Vérifier la connexion
  useEffect(() => {
    if (!userData || !userData.id) {
      alert("Vous devez être connecté pour prendre un rendez-vous.");
      navigate('/login');
      return;
    }
    
    console.log("Patient ID dans PatientBooking:", patientId);
  }, [navigate, userData, patientId]);

  // Charger les médecins
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Doctors?t=${Date.now()}`);
        setDoctors(response.data);
      } catch (err) {
        console.error("Erreur API:", err);
        setDoctors([
          { id: 1, name: "Dr. Sami Ben Ali", specialization: "Cardiologie" },
          { id: 2, name: "Dr. Leila Fessi", specialization: "Pédiatrie" },
          { id: 3, name: "Dr. Karim Mourad", specialization: "Dermatologie" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleNextStep = () => {
    setError('');
    
    if (step === 1 && !selectedDoctor) {
      setError('Veuillez sélectionner un médecin');
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      setError('Veuillez sélectionner une date et une heure');
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmitBooking = async () => {
    if (!reason.trim()) {
      setError('Veuillez décrire le motif de votre consultation');
      return;
    }

    // Format CORRECT pour l'API .NET
    const appointmentData = {
      patientId: patientId, // ID 1 (Ahmed Ammar)
      doctorId: selectedDoctor.id,
      appointmentDate: `${selectedDate}T${selectedTime}:00`,
      cost: 50.00,
      notes: reason || "Consultation générale"
    };

    console.log("Données envoyées à l'API:", appointmentData);
    console.log("URL de l'API:", `${API_BASE_URL}/Appointments`);

    try {
      setSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/Appointments`, appointmentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réponse de l'API:", response.data);
      setSuccess(true);
      
      // Stocker dans localStorage
      const appointment = {
        id: response.data.id || Date.now(),
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        patientEmail: localStorage.getItem('userEmail'),
        status: 'Prévu'
      };
      
      const appointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      appointments.push(appointment);
      localStorage.setItem('patientAppointments', JSON.stringify(appointments));
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Réponse d'erreur:", err.response?.data);
      console.error("Statut d'erreur:", err.response?.status);
      
      let errorMsg = "Erreur lors de la prise de rendez-vous";
      
      if (err.response?.status === 404) {
        errorMsg = "Patient introuvable (404). Vérifiez que le patient avec ID " + patientId + " existe dans la base de données.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data) {
        errorMsg = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des médecins...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Rendez-vous confirmé !</h2>
          <p className="text-gray-600 mb-6">Votre rendez-vous a été pris avec succès.</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="font-medium">{selectedDoctor?.name}</p>
            <p className="text-sm text-gray-500">{selectedDoctor?.specialization}</p>
            <p className="text-sm text-gray-500 mt-2">{selectedDate} à {selectedTime}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">Redirection vers votre espace patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Prendre un Rendez-vous</h1>
              <p className="text-gray-600">Suivez les étapes pour réserver votre consultation</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Erreur</p>
                <p className="text-red-600 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-1">Patient ID utilisé: {patientId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Étapes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                <span className={`text-sm ${step >= stepNum ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Médecin' : stepNum === 2 ? 'Date & Heure' : 'Confirmation'}
                </span>
              </div>
            ))}
          </div>

          {/* Étape 1: Sélection du médecin */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Sélectionnez un médecin</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setError('');
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                    <p className="text-blue-600 text-sm mt-1">{doctor.specialization || doctor.specialty}</p>
                    <div className="text-xs text-gray-500 mt-2">ID: {doctor.id}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDoctor}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    selectedDoctor
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 2: Date et heure */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Sélectionnez la date et l'heure</h3>
              
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setError('');
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-3">Heures disponibles</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setError('');
                      }}
                      className={`p-3 rounded-lg border-2 ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate || !selectedTime}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    selectedDate && selectedTime
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Confirmez votre rendez-vous</h3>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="font-medium text-gray-700 mb-4">Récapitulatif</h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Médecin</p>
                    <p className="font-medium">{selectedDoctor?.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor?.specialization}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date et Heure</p>
                    <p className="font-medium">{selectedDate} à {selectedTime}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Motif de consultation</p>
                    <textarea
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setError('');
                      }}
                      placeholder="Décrivez vos symptômes ou le motif de votre consultation..."
                      rows="4"
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Informations techniques</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Patient ID: {patientId} | Doctor ID: {selectedDoctor?.id}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Retour
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting || !reason.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                    submitting || !reason.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="spinner border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
                      En cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirmer le rendez-vous
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;