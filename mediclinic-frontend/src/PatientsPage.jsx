import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Users, UserPlus, Calendar, Activity,
  TrendingUp, Search, Bell, Zap, Settings, LogOut
} from 'lucide-react';

const API_BASE_URL = "http://localhost:5268/api";

// Couleurs pour les graphiques
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// --- Composants ---
const SidebarItem = ({ icon: Icon, label, active, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className={`nav-item ${isActive ? 'active' : ''}`}>
        <Icon size={20} />
        <span>{label}</span>
      </div>
    </Link>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon" style={{ backgroundColor: `${color}10`, color: color }}>
        <Icon size={20} />
      </div>
      {trend && <span className="trend-badge">+{trend}%</span>}
    </div>
    <div className="stat-body">
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{title}</p>
    </div>
    <div className="stat-progress" style={{ background: `linear-gradient(90deg, ${color} 40%, #eee 40%)` }}></div>
  </div>
);

// --- Page Dashboard ---
const Dashboard = () => {
  const [data, setData] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    revenueHistory: [
      { date: 'Lun', amount: 4200 },
      { date: 'Mar', amount: 6800 },
      { date: 'Mer', amount: 5200 },
      { date: 'Jeu', amount: 8100 },
      { date: 'Ven', amount: 7200 },
      { date: 'Sam', amount: 3800 },
      { date: 'Dim', amount: 2800 }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connecting');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Dashboard/stats`);
        
        // Normalisation des données (gère camelCase et PascalCase)
        const apiData = {
          totalPatients: res.data.totalPatients || res.data.TotalPatients || 0,
          totalDoctors: res.data.totalDoctors || res.data.TotalDoctors || 0,
          totalAppointments: res.data.totalAppointments || res.data.TotalAppointments || 0,
          totalRevenue: res.data.totalRevenue || res.data.TotalRevenue || 0,
          revenueHistory: res.data.revenueHistory || res.data.RevenueHistory || data.revenueHistory
        };
        
        setData(apiData);
        setApiStatus('connected');
      } catch (error) {
        console.error('Erreur API, utilisation des données de démo:', error);
        setApiStatus('disconnected');
        // Utilise les données de démonstration déjà définies
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête Dashboard */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord MediSynth</h1>
          <p className="api-status">
            <span className={`status-indicator ${apiStatus}`}>
              {apiStatus === 'connected' ? '✓ Connecté à l\'API .NET' : '⚠ Mode démonstration'}
            </span>
          </p>
        </div>
        <button 
          className="refresh-btn"
          onClick={() => window.location.reload()}
        >
          <Zap size={16} />
          Actualiser
        </button>
      </div>

      {/* Grille de statistiques */}
      <div className="stats-grid">
        <StatCard 
          title="Patients" 
          value={data.totalPatients.toLocaleString()} 
          icon={Users} 
          color="#6366f1" 
          trend="5.2" 
        />
        <StatCard 
          title="Médecins" 
          value={data.totalDoctors} 
          icon={UserPlus} 
          color="#10b981" 
          trend="3.8" 
        />
        <StatCard 
          title="Rendez-vous" 
          value={data.totalAppointments} 
          icon={Calendar} 
          color="#f59e0b" 
          trend="8.7" 
        />
        <StatCard 
          title="Revenu Mensuel" 
          value={`${(data.totalRevenue / 1000).toFixed(1)}K $`} 
          icon={Activity} 
          color="#8b5cf6" 
          trend="12.4" 
        />
      </div>

      {/* Grille de graphiques */}
      <div className="charts-main-grid">
        {/* Graphique principal (courbe) */}
        <div className="chart-container large-chart">
          <div className="chart-header">
            <h3>Analytique des Revenus</h3>
            <div className="chart-tabs">
              <span>Jour</span>
              <span className="active">Semaine</span>
              <span>Mois</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={data.revenueHistory}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    background: 'white'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorArea)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique circulaire (spécialisations) */}
        <div className="chart-container small-chart">
          <h3>Spécialisations</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Cardiologie', value: 400 },
                    { name: 'Neurologie', value: 300 },
                    { name: 'Dentaire', value: 200 },
                    { name: 'Pédiatrie', value: 150 },
                    { name: 'Dermatologie', value: 100 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => 
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="system-health">
            <p>Santé du Système</p>
            <div className="health-item">
              <span>API .NET</span> 
              <span className={`status-indicator ${apiStatus}`}>
                {apiStatus === 'connected' ? 'Connecté' : 'Hors ligne'}
              </span>
            </div>
            <div className="health-item">
              <span>Réseau</span> 
              <span className="status-ok">Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Patients
const PatientsPage = () => (
  <div className="page-content">
    <h1>Gestion des Patients</h1>
    <p>Module en développement - Connexion à l'API /Patients</p>
  </div>
);

// Page Médecins
const DoctorsPage = () => (
  <div className="page-content">
    <h1>Gestion des Médecins</h1>
    <p>Module en développement - Connexion à l'API /Doctors</p>
  </div>
);

// Page Rendez-vous
const AppointmentsPage = () => (
  <div className="page-content">
    <h1>Gestion des Rendez-vous</h1>
    <p>Module en développement - Connexion à l'API /Appointments</p>
  </div>
);

// --- Layout Principal ---
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar-modern ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-header">
            <div className="logo-section">
              <div className="logo-box"><Activity color="white" size={24} /></div>
              {sidebarOpen && <h2>MediSynth</h2>}
            </div>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
          
          <nav className="nav-menu">
            <SidebarItem icon={LayoutDashboard} label="Tableau de Bord" to="/" />
            <SidebarItem icon={Users} label="Patients" to="/patients" />
            <SidebarItem icon={UserPlus} label="Médecins" to="/medecins" />
            <SidebarItem icon={Calendar} label="Rendez-vous" to="/rendez-vous" />
          </nav>

          <div className="sidebar-footer">
            <SidebarItem icon={Settings} label="Paramètres" to="/parametres" />
            <SidebarItem icon={LogOut} label="Déconnexion" to="/deconnexion" />
          </div>
        </aside>

        {/* Zone de contenu */}
        <main className="content-area">
          <div className="top-navbar">
            <div className="search-wrapper">
              <Search size={18} color="#94a3b8" />
              <input type="text" placeholder="Rechercher patients, médecins..." />
            </div>
            <div className="user-profile">
              <div className="notif-badge">
                <Bell size={20} />
                <span>3</span>
              </div>
              <div className="user-info">
                <p>Dr. Admin</p>
                <span>Administrateur</span>
              </div>
              <div className="avatar-circle">AD</div>
            </div>
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/medecins" element={<DoctorsPage />} />
            <Route path="/rendez-vous" element={<AppointmentsPage />} />
          </Routes>
        </main>
      </div>

      {/* Styles CSS */}
      <style>{`
        :root {
          --primary: #6366f1;
          --bg-light: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
          background: var(--bg-light);
          color: var(--text-primary);
        }

        .main-layout { 
          display: flex; 
          height: 100vh; 
          background: var(--bg-light);
        }

        .sidebar-modern { 
          width: 280px; 
          background: white; 
          border-right: 1px solid var(--border-color); 
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }

        .sidebar-modern.collapsed {
          width: 80px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .logo-section { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .logo-box { 
          background: var(--primary); 
          padding: 10px; 
          border-radius: 10px; 
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
        }

        .nav-menu {
          flex: 1;
          padding: 20px;
        }

        .nav-item { 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          padding: 12px 15px; 
          border-radius: 12px; 
          color: var(--text-secondary); 
          transition: all 0.3s; 
          cursor: pointer; 
          margin-bottom: 8px;
          text-decoration: none;
        }
        .nav-item:hover {
          background: #f8fafc;
        }
        .nav-item.active { 
          background: #6366f110; 
          color: var(--primary); 
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--border-color);
        }

        .content-area { 
          flex: 1; 
          padding: 30px; 
          overflow-y: auto; 
        }

        .top-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 10px 15px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          width: 300px;
        }

        .search-wrapper input {
          border: none;
          outline: none;
          font-size: 14px;
          color: var(--text-primary);
          background: transparent;
          flex: 1;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notif-badge {
          position: relative;
          cursor: pointer;
        }

        .notif-badge span {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--danger);
          color: white;
          font-size: 11px;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .user-info {
          text-align: right;
        }

        .user-info p {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .user-info span {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary), #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .api-status {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .status-indicator {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-indicator.connected {
          background: #ecfdf5;
          color: var(--success);
        }

        .status-indicator.disconnected {
          background: #fef3c7;
          color: var(--warning);
        }

        .status-indicator.connecting {
          background: #dbeafe;
          color: var(--primary);
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
        }

        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 20px; 
          margin-top: 20px;
          margin-bottom: 30px;
        }

        .stat-card { 
          background: white; 
          padding: 20px; 
          border-radius: 16px; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trend-badge {
          background: #ecfdf5;
          color: var(--success);
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .stat-body {
          margin-bottom: 15px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-progress {
          height: 4px;
          border-radius: 2px;
          background: #f1f5f9;
        }

        .charts-main-grid { 
          display: grid; 
          grid-template-columns: 2fr 1fr; 
          gap: 25px; 
          margin-top: 30px;
        }

        @media (max-width: 1024px) {
          .charts-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-container { 
          background: white; 
          padding: 25px; 
          border-radius: 16px; 
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          border: 1px solid var(--border-color);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .chart-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chart-tabs {
          display: flex;
          gap: 10px;
          background: #f8fafc;
          padding: 4px;
          border-radius: 12px;
        }

        .chart-tabs span {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chart-tabs span:hover {
          color: var(--text-primary);
        }

        .chart-tabs span.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .system-health {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .system-health p {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .health-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 13px;
        }

        .health-item span:first-child {
          color: var(--text-secondary);
        }

        .status-ok {
          color: var(--success);
          font-weight: 600;
          background: #ecfdf5;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
        }

        .page-content {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          text-align: center;
        }

        .page-content h1 {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .page-content p {
          color: var(--text-secondary);
          font-size: 16px;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .top-navbar {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          
          .search-wrapper {
            width: 100%;
          }
          
          .user-profile {
            justify-content: flex-end;
          }
          
          .sidebar-modern:not(.collapsed) {
            position: fixed;
            z-index: 1000;
            height: 100vh;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .content-area {
            padding: 15px;
          }
        }
      `}</style>
    </Router>
  );
}