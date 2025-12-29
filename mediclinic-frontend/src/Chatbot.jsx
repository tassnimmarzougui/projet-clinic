import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Stethoscope,
  Calendar,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  Heart,
  Shield,
  Building
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "👋 Bonjour ! Je suis MediBot, votre assistant virtuel de la clinique MediSynth. Je peux vous aider pour:\n\n• Prendre un rendez-vous\n• Informations sur les médecins\n• Horaires d'ouverture\n• Contact et adresse\n• Tarifs des consultations\n• Questions médicales générales", 
      sender: 'bot',
      timestamp: new Date(),
      type: 'greeting'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Comment prendre un rendez-vous ?",
    "Quels sont les horaires d'ouverture ?",
    "Quelles spécialités proposez-vous ?",
    "Comment contacter la clinique ?",
    "Quels sont les tarifs ?",
    "Quels documents apporter ?"
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Base de connaissances médicale
  const medicalResponses = {
    greetings: [
      "Bonjour ! 😊 Comment puis-je vous aider aujourd'hui ? Je suis spécialisé dans les questions sur notre clinique.",
      "Salut ! Je suis MediBot, votre assistant médical virtuel. Que souhaitez-vous savoir ?",
      "Bienvenue ! Je peux vous aider avec la prise de rendez-vous, les horaires, les médecins, et plus encore."
    ],
    appointments: [
      "Pour prendre un rendez-vous:\n1. Connectez-vous à votre espace patient\n2. Cliquez sur 'Prendre un rendez-vous'\n3. Choisissez un médecin\n4. Sélectionnez une date et heure\n5. Confirmez votre rendez-vous\n\n💡 Vous pouvez aussi nous appeler au +216 71 123 456",
      "La prise de rendez-vous en ligne est simple et rapide. Accédez à votre espace patient, sélectionnez un médecin et choisissez un créneau disponible.",
      "Les rendez-vous sont disponibles du lundi au vendredi de 8h à 18h, et le samedi de 9h à 13h. Les urgences sont traitées 24h/24."
    ],
    doctors: [
      "🏥 **Notre équipe médicale:**\n\n• Dr. Sami Ben Ali - Cardiologie\n• Dr. Leila Fessi - Pédiatrie\n• Dr. Karim Mourad - Dermatologie\n• Dr. Sarah Chen - Neurologie\n• Dr. Michael Rodriguez - Orthopédie\n\nTous nos médecins sont certifiés et expérimentés.",
      "Nous avons des spécialistes dans plusieurs domaines : cardiologie, pédiatrie, dermatologie, neurologie, orthopédie, et médecine générale.",
      "Chaque médecin a un profil détaillé avec ses spécialités, expérience et disponibilités dans votre espace patient."
    ],
    hours: [
      "🕒 **Horaires de la clinique:**\n\n📅 **Consultations:**\n• Lundi à Vendredi: 8h00 - 18h00\n• Samedi: 9h00 - 13h00\n• Dimanche: Fermé\n\n🚨 **Urgences:**\n• 24h/24, 7j/7\n• Téléphone: 190 (SAMU)\n• Urgences médicales: Composez le 190",
      "La clinique est ouverte du lundi au vendredi de 8h à 18h, le samedi de 9h à 13h. Pour les urgences, contactez le 190.",
      "Nos horaires sont adaptés pour vous servir au mieux. Pensez à prendre rendez-vous pour éviter l'attente."
    ],
    contact: [
      "📞 **Contactez-nous:**\n\n📍 **Adresse:**\n123 Rue de la Santé\nTunis 1002\nTunisie\n\n📱 **Téléphone:**\n+216 71 123 456\n\n✉️ **Email:**\ncontact@medisynth.tn\n\n🌐 **Site web:**\nwww.medisynth.tn",
      "Vous pouvez nous joindre au +216 71 123 456 ou par email à contact@medisynth.tn. Notre adresse est 123 Rue de la Santé, Tunis.",
      "Pour toute question administrative, appelez-nous entre 8h et 18h. Pour les urgences médicales, composez le 190."
    ],
    emergency: [
      "🚨 **URGENCE MÉDICALE**\n\nSi vous avez besoin d'une aide médicale urgente:\n\n1. Composez immédiatement le **190** (SAMU)\n2. Rendez-vous aux **urgences** les plus proches\n3. Ne prenez pas de risques inutiles\n\n⚠️ **Symptômes nécessitant une urgence:**\n• Douleur thoracique intense\n• Difficulté à respirer\n• Perte de connaissance\n• Saignement important\n• Trauma grave",
      "En cas d'urgence vitale, ne perdez pas de temps et appelez le 190. Notre service d'urgences est disponible 24h/24.",
      "Pour les urgences non vitales, vous pouvez nous appeler au +216 71 123 456 pour conseil médical."
    ],
    prices: [
      "💰 **Tarifs des consultations (TND):**\n\n• Consultation générale: 50 DT\n• Spécialiste (cardio, neuro): 80 DT\n• Pédiatrie: 60 DT\n• Dermatologie: 70 DT\n• Suivi médical: 30 DT\n• Urgence: 100 DT\n\n📋 **Assurances acceptées:**\n• CNSS\n• CNAM\n• Assurances privées\n• Mutuelles internationales",
      "Les tarifs varient selon la spécialité du médecin et le type de consultation. La consultation générale est à 50 DT.",
      "Nous acceptons la plupart des assurances santé. Pensez à apporter votre carte d'assurance lors de votre visite."
    ],
    preparation: [
      "📋 **Préparation de votre visite:**\n\n**Documents à apporter:**\n✅ Carte d'identité\n✅ Carte d'assurance/mutuelle\n✅ Ordonnances précédentes\n✅ Résultats d'analyses\n✅ Carnet de vaccination\n✅ Liste des médicaments\n\n**Conseils:**\n• Arrivez 15 minutes avant\n• Notez vos symptômes\n• Préparez vos questions",
      "Pour votre premier rendez-vous, apportez vos documents médicaux, carte d'identité et carte d'assurance.",
      "N'oubliez pas de noter tous vos symptômes et questions pour en discuter avec le médecin."
    ],
    insurance: [
      "🏥 **Couverture d'assurance:**\n\nNous travaillons avec:\n• CNSS (Caisse Nationale de Sécurité Sociale)\n• CNAM (Caisse Nationale d'Assurance Maladie)\n• Assurances privées tunisiennes\n• Assurances internationales\n• Mutuelles d'entreprise\n\n💳 Paiements acceptés: Espèces, carte bancaire, chèque",
      "La plupart des assurances sont acceptées. Vérifiez votre contrat pour connaître votre niveau de couverture.",
      "Notre service administratif peut vous aider à vérifier votre couverture d'assurance avant votre rendez-vous."
    ],
    specialties: [
      "🎯 **Nos spécialités médicales:**\n\n1. Cardiologie - Maladies du cœur\n2. Neurologie - Système nerveux\n3. Pédiatrie - Enfants\n4. Orthopédie - Os et articulations\n5. Dermatologie - Peau\n6. Gynécologie - Santé féminine\n7. Médecine générale\n8. Radiologie - Imagerie médicale\n9. Chirurgie générale",
      "Nous couvrons toutes les spécialités médicales principales avec des équipements modernes et des médecins expérimentés.",
      "Si vous ne savez pas quel spécialiste consulter, prenez rendez-vous en médecine générale pour une orientation."
    ],
    covid: [
      "🦠 **Protocole COVID-19:**\n\n**Mesures en place:**\n• Port du masque obligatoire\n• Distanciation physique\n• Désinfection régulière\n• Prise de température\n• Consultation téléphonique disponible\n\n**Symptômes à surveiller:**\n• Fièvre\n• Toux\n• Perte de goût/odorat\n• Difficultés respiratoires",
      "Nous suivons strictement les protocoles sanitaires pour votre sécurité. Le port du masque est obligatoire.",
      "En cas de symptômes COVID-19, restez chez vous et contactez-nous par téléphone pour une consultation à distance."
    ],
    default: [
      "Je ne suis pas sûr de comprendre votre question. Pourriez-vous la reformuler ?\n\nJe peux vous aider avec:\n• Prise de rendez-vous\n• Informations sur les médecins\n• Horaires et contact\n• Tarifs et assurances\n• Questions médicales générales",
      "Je suis spécialisé dans les questions concernant notre clinique. Posez-moi une question sur nos services !",
      "Pour des conseils médicaux personnalisés, consultez l'un de nos médecins. Je peux vous aider à prendre rendez-vous."
    ]
  };

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  // Analyse la question de l'utilisateur
  const analyzeQuestion = (question) => {
    const q = question.toLowerCase();
    
    // Dictionnaire de mots-clés
    const keywords = {
      'greetings': ['bonjour', 'salut', 'hello', 'coucou', 'bonsoir'],
      'appointments': ['rendez-vous', 'rdv', 'consultation', 'prendre', 'réserver', 'disponible', 'horaire'],
      'doctors': ['médecin', 'docteur', 'dr', 'cardiologue', 'pédiatre', 'dermatologue', 'neurologue'],
      'hours': ['horaire', 'heure', 'ouvert', 'fermé', 'jour', 'week-end', 'samedi', 'dimanche'],
      'contact': ['contact', 'téléphone', 'tel', 'email', 'adresse', 'localisation', 'appeler'],
      'emergency': ['urgence', 'urgent', 'grave', 'sérieux', 'sauvetage', 'ambulance'],
      'prices': ['prix', 'tarif', 'coût', 'payer', 'combien', 'frais', 'argent'],
      'preparation': ['préparer', 'apporter', 'document', 'carte', 'papier', 'dossier'],
      'insurance': ['assurance', 'mutuelle', 'remboursement', 'sécurité sociale', 'cnss', 'cnam'],
      'specialties': ['spécialité', 'service', 'département', 'cardiologie', 'neurologie'],
      'covid': ['covid', 'coronavirus', 'pandémie', 'masque', 'vaccin', 'test']
    };

    // Recherche des mots-clés
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => q.includes(word))) {
        return category;
      }
    }
    
    return 'default';
  };

  // Obtient une réponse aléatoire selon la catégorie
  const getRandomResponse = (category) => {
    const responses = medicalResponses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Gère l'envoi de message
  const handleSend = () => {
    if (input.trim() === '') return;

    // Message utilisateur
    const userMessage = { 
      id: messages.length + 1, 
      text: input, 
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simuler le temps de réponse
    setTimeout(() => {
      const category = analyzeQuestion(input);
      const botResponse = getRandomResponse(category);
      
      const botMessage = { 
        id: messages.length + 2, 
        text: botResponse, 
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  // Gère les questions rapides
  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 300);
  };

  // Gère la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Formatage de l'heure
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Bouton flottant du chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-50 group animate-bounce hover:scale-110"
          aria-label="Ouvrir le chat assistant"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            <Heart size={12} />
          </div>
          <span className="absolute -bottom-10 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Assistant Médical
          </span>
        </button>
      )}

      {/* Fenêtre du chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200 animate-fadeIn">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  MediBot Assistant
                  <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">En ligne</span>
                </h3>
                <p className="text-sm text-white/80">Assistant médical intelligent • 24/7</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition hover:rotate-90 duration-300"
              aria-label="Fermer le chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Corps du chat */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
          >
            {/* Message de bienvenue */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-sm px-4 py-2 rounded-full">
                <Shield size={14} />
                <span>Confidentialité médicale garantée • HIPAA compliant</span>
              </div>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className="flex max-w-[85%]">
                  {message.sender === 'bot' && (
                    <div className="mr-2 mt-1 flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                        <Bot size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <div
                      className={`rounded-2xl p-4 shadow-sm ${message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                      <div className={`text-xs mt-2 flex items-center gap-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        <Clock size={10} />
                        {formatTime(new Date(message.timestamp))}
                      </div>
                    </div>
                    {message.sender === 'bot' && (
                      <div className="text-xs text-gray-400 mt-1 ml-1 flex items-center gap-1">
                        <Building size={10} />
                        MediSynth • Assistant certifié
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="ml-2 mt-1 flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                        <User size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="flex">
                  <div className="mr-2 mt-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">MediBot réfléchit</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions rapides */}
            {!isTyping && (
              <div className="mt-6 animate-fadeIn">
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <Stethoscope size={14} />
                  Questions fréquentes :
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 px-3 py-2 rounded-full transition-all hover:scale-105 active:scale-95 border border-blue-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Widgets d'information */}
            <div className="mt-8 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Horaires urgences</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold">24h/24 • 7j/7</p>
                  <p className="text-xs text-green-500 mt-1">SAMU: 190</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Contact rapide</span>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold">+216 71 123 456</p>
                  <p className="text-xs text-blue-500 mt-1">8h-18h • Lun-Sam</p>
                </div>
              </div>
              
              {/* Message de confidentialité */}
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-purple-700">
                    <strong>Note importante:</strong> Ce chatbot fournit des informations générales. Pour un diagnostic médical, consultez un professionnel de santé.
                  </p>
                </div>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question médicale ou administrative..."
                  rows="1"
                  className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400 flex items-center gap-1">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">↵</span>
                  <span>Envoyer</span>
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={input.trim() === ''}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${input.trim() === '' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95'
                }`}
                aria-label="Envoyer le message"
              >
                {input.trim() === '' ? (
                  <Send size={20} className="opacity-50" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            {/* Pied de page */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Assistant en ligne
                </span>
                <span className="hidden md:inline">Réponse sous 2s</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span>Messages sécurisés</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS intégrés */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
          }
          50% { 
            opacity: 0.5; 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-150 {
          animation-delay: 0.15s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        /* Scrollbar personnalisée */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default Chatbot;