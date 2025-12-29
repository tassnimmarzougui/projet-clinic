import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, Users, UserPlus, Calendar, DollarSign,
  Search, Bell, Zap, Eye, Edit, Settings, LogOut, Plus,
  Clock, Star, Heart, Shield, Target, Brain,
  ChevronRight, Download, Menu, CheckCircle, AlertCircle,
  Database, Cpu, Wifi, FileText, PieChart as PieIcon, X, Trash2, Home as HomeIcon,
  MapPin, Phone, Mail, Clock as ClockIcon, Stethoscope, CalendarDays,
  Bot, Send, MessageCircle, User, ArrowLeft, Check, XCircle, AlertTriangle,
  FileText as FileTextIcon, Calendar as CalendarIcon
} from 'lucide-react';

// ==================== CONFIGURATION ====================
const API_BASE_URL = "http://localhost:5268/api";
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

// Données de démonstration pour fallback
const DEMO_DATA = {
  totalPatients: 1248,
  totalDoctors: 42,
  totalAppointments: 186,
  totalRevenue: 45280,
  
  revenueHistory: [
    { date: 'Lun', amount: 4200, patients: 24 },
    { date: 'Mar', amount: 6800, patients: 38 },
    { date: 'Mer', amount: 5200, patients: 29 },
    { date: 'Jeu', amount: 8100, patients: 45 },
    { date: 'Ven', amount: 7200, patients: 41 },
    { date: 'Sam', amount: 3800, patients: 22 },
    { date: 'Dim', amount: 2800, patients: 16 }
  ],
  
  specializations: [
    { name: 'Cardiologie', value: 35 },
    { name: 'Neurologie', value: 25 },
    { name: 'Pédiatrie', value: 20 },
    { name: 'Orthopédie', value: 15 },
    { name: 'Dermatologie', value: 5 }
  ]
};

// ==================== STYLES CSS PREMIUM ====================
const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #10b981;
  --accent: #8b5cf6;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --success: #10b981;
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border: #e2e8f0;
  --border-hover: #cbd5e1;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --radius-sm: 0.375rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: var(--text-primary);
}

/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.app {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Sidebar - Design Luxe */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  box-shadow: var(--shadow-xl);
  z-index: 50;
}

.sidebar.collapsed {
  width: 90px;
}

.sidebar-header {
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}

.logo h2 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: var(--transition);
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
}

.nav-item {
  padding: 16px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: var(--transition);
  color: #94a3b8;
  position: relative;
  overflow: hidden;
}

.nav-item:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #6366f1, #8b5cf6);
  transform: translateX(-100%);
  transition: var(--transition);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.nav-item:hover:before {
  transform: translateX(0);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.nav-item.active:before {
  transform: translateX(0);
}

.nav-item.collapsed {
  justify-content: center;
  padding: 16px;
}

.nav-icon {
  display: flex;
  align-items: center;
  min-width: 24px;
}

.nav-label {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
}

.nav-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

.sidebar-footer {
  padding: 24px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Topbar - Design Premium */
.topbar {
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: var(--shadow);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 40;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 15px;
}

.breadcrumb .active {
  color: var(--primary);
  font-weight: 600;
  position: relative;
}

.breadcrumb .active:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 2px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar input {
  padding: 12px 20px 12px 48px;
  border: 2px solid var(--border);
  border-radius: 16px;
  font-size: 15px;
  width: 320px;
  background: white;
  transition: var(--transition);
  font-weight: 500;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  width: 360px;
}

.search-bar svg {
  position: absolute;
  left: 20px;
  color: var(--text-tertiary);
  transition: var(--transition);
}

.search-bar input:focus + svg {
  color: var(--primary);
}

.search-shortcut {
  position: absolute;
  right: 12px;
  background: var(--bg-tertiary);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: var(--transition);
  font-weight: 600;
}

.icon-btn:hover {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 24px;
  border-left: 2px solid var(--border);
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  transition: var(--transition);
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
}

.user-role {
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

/* Dashboard Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.dashboard-header:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.dashboard-header h1 {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.api-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: white;
  box-shadow: var(--shadow);
}

.api-status.connected {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.api-status.disconnected {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.btn-refresh {
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  transition: var(--transition);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stats Grid Premium */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.stat-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.trend-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-body {
  margin-bottom: 16px;
}

.stat-value {
  font-size: 40px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-progress {
  height: 6px;
  border-radius: 3px;
  background: var(--bg-tertiary);
  overflow: hidden;
  position: relative;
}

.stat-progress:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  border-radius: 3px;
  animation: progress 2s ease-in-out;
}

@keyframes progress {
  from { width: 0; }
  to { width: 70%; }
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

.main-chart, .side-panel {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.main-chart:before, .side-panel:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.chart-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-tabs {
  display: flex;
  gap: 8px;
  background: var(--bg-tertiary);
  padding: 6px;
  border-radius: 16px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn.active {
  background: white;
  color: var(--primary);
  box-shadow: var(--shadow);
}

.chart-container {
  height: 320px;
}

/* Panels */
.panel-card {
  margin-bottom: 32px;
}

.panel-card:last-child {
  margin-bottom: 0;
}

.panel-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.health-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--bg-tertiary);
  border-radius: 16px;
  border: 2px solid transparent;
  transition: var(--transition);
}

.health-item:hover {
  border-color: var(--primary);
  transform: translateX(4px);
}

.health-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.health-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
}

.health-status.good {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.health-status.warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.doctors-section, .quick-stats {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.doctors-section:before, .quick-stats:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 12px;
  transition: var(--transition);
}

.btn-view-all:hover {
  background: var(--bg-tertiary);
  transform: translateX(4px);
}

/* Doctors List */
.doctors-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doctor-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: white;
  border-radius: 20px;
  border: 2px solid var(--border);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.doctor-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.doctor-card:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--primary), var(--accent));
  transform: translateX(-100%);
  transition: var(--transition);
}

.doctor-card:hover:before {
  transform: translateX(0);
}

.doctor-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.doctor-info {
  flex: 1;
  min-width: 0;
}

.doctor-name {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-size: 16px;
}

.doctor-specialty {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.doctor-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f59e0b;
  font-weight: 600;
}

.doctor-patients {
  color: var(--text-secondary);
  font-weight: 500;
}

.doctor-status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 16px;
  flex-shrink: 0;
}

.doctor-status.online {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.doctor-status.offline {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
}

/* Quick Stats */
.quick-stats {
  display: flex;
  align-items: center;
}

.stats-grid-small {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 20px;
  border: 2px solid var(--border);
  transition: var(--transition);
}

.quick-stat:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.quick-stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.quick-stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.quick-stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Buttons */
.btn-primary {
  padding: 14px 32px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  transition: var(--transition);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: 20px;
  border: 2px solid var(--border);
  box-shadow: var(--shadow);
  background: white;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px;
}

.data-table thead {
  background: linear-gradient(135deg, var(--primary), var(--accent));
}

.data-table th {
  padding: 24px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border);
}

.data-table th:first-child {
  border-top-left-radius: 18px;
}

.data-table th:last-child {
  border-top-right-radius: 18px;
}

.data-table td {
  padding: 24px;
  border-bottom: 1px solid var(--border);
  font-size: 15px;
  font-weight: 500;
}

.data-table tbody tr {
  transition: var(--transition);
}

.data-table tbody tr:hover {
  background: var(--bg-tertiary);
  transform: scale(1.01);
}

/* Patient Info */
.patient-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.patient-name {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 16px;
}

.patient-id {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* Status Badges */
.status-badge {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-sm);
}

.status-badge.actif,
.status-badge.confirmed {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.status-badge.stable,
.status-badge.completed {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.status-badge.surveillance,
.status-badge.pending {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.action-btn.edit:hover {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border-color: transparent;
}

.action-btn.delete:hover {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  border-color: transparent;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 24px;
  border-bottom: 2px solid var(--border);
}

.modal-header h3 {
  font-size: 24px;
  color: var(--text-primary);
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: white;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.modal-close:hover {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  border-color: transparent;
  transform: rotate(90deg);
}

/* Form */
.form-group {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid var(--border);
  border-radius: 14px;
  font-size: 15px;
  color: var(--text-primary);
  background: white;
  transition: var(--transition);
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid var(--border);
}

.btn-secondary {
  padding: 14px 28px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  transition: var(--transition);
}

.btn-secondary:hover {
  background: var(--border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* AI Assistant */
.ai-assistant {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.4);
  z-index: 100;
  transition: var(--transition);
  border: 4px solid white;
}

.ai-assistant:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 25px 50px rgba(99, 102, 241, 0.6);
}

.ai-pulse {
  position: absolute;
  width: 70px;
  height: 70px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: var(--text-secondary);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spinner 1s linear infinite;
  margin-bottom: 24px;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

/* Public Pages */
.public-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* Patient Pages */
.patient-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
}

/* Patient Header Premium */
.patient-header-premium {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.patient-header-premium:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

/* Patient Booking */
.booking-container-premium {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255,255,255,0.2);
}

.booking-steps-premium {
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;
  position: relative;
}

.booking-steps-premium:before {
  content: '';
  position: absolute;
  top: 28px;
  left: 50px;
  right: 50px;
  height: 2px;
  background: var(--border);
  z-index: 1;
}

.step-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-number-premium {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 16px;
  font-size: 20px;
  transition: var(--transition);
}

.step-premium.active .step-number-premium {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-color: transparent;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.step-premium.completed .step-number-premium {
  background: linear-gradient(135deg, #10b981, #34d399);
  border-color: transparent;
  color: white;
}

.step-label-premium {
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
}

.step-premium.active .step-label-premium {
  color: var(--primary);
  font-weight: 600;
}

/* Doctors Selection Premium */
.doctors-grid-premium {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin: 32px 0;
}

.doctor-select-card-premium {
  background: white;
  border: 2px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.doctor-select-card-premium:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.doctor-select-card-premium.selected {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
}

.doctor-select-card-premium h4 {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
}

.doctor-select-card-premium p {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 16px;
}

.doctor-select-card-premium .doctor-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f59e0b;
  font-weight: 600;
  font-size: 15px;
}

/* Time Slots Premium */
.time-slots-premium {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin: 32px 0;
}

.time-slot-premium {
  padding: 16px;
  background: white;
  border: 2px solid var(--border);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  font-size: 15px;
}

.time-slot-premium:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.time-slot-premium.selected {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-color: transparent;
  color: white;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.time-slot-premium.unavailable {
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .charts-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transition: left 0.3s ease;
  }
  
  .sidebar.active {
    left: 0;
  }
  
  .topbar-actions .search-bar {
    display: none;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .booking-steps-premium {
    flex-direction: column;
    gap: 32px;
  }
  
  .booking-steps-premium:before {
    display: none;
  }
  
  .step-premium {
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }
  
  .step-number-premium {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 20px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
  
  .patient-header-premium {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
  }
}
`;

// ==================== UTILITAIRES ====================
const normalizeApiData = (apiData) => {
  if (!apiData) return DEMO_DATA;
  
  return {
    totalPatients: apiData.totalPatients || apiData.TotalPatients || DEMO_DATA.totalPatients,
    totalDoctors: apiData.totalDoctors || apiData.TotalDoctors || DEMO_DATA.totalDoctors,
    totalAppointments: apiData.totalAppointments || apiData.TotalAppointments || DEMO_DATA.totalAppointments,
    totalRevenue: apiData.totalRevenue || apiData.TotalRevenue || DEMO_DATA.totalRevenue,
    revenueHistory: apiData.revenueHistory || apiData.RevenueHistory || DEMO_DATA.revenueHistory,
    specializations: apiData.specializations || apiData.Specializations || DEMO_DATA.specializations,
    recentDoctors: apiData.recentDoctors || apiData.RecentDoctors || []
  };
};

// ==================== COMPOSANTS AMÉLIORÉS ====================
const NavItem = ({ icon, label, badge, to, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="nav-link">
      <div className={`nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="nav-icon">
          {React.cloneElement(icon, { size: 22 })}
        </div>
        {!collapsed && (
          <>
            <span className="nav-label">{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </>
        )}
      </div>
    </Link>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend, percentage, gradient }) => {
  const gradientColors = gradient || `linear-gradient(135deg, ${color}, ${color}DD)`;
  
  return (
    <div className="stat-card" style={{
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'var(--transition)'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '120px',
        height: '120px',
        background: gradientColors,
        opacity: '0.1',
        borderRadius: '0 0 0 100%',
        transition: 'var(--transition)'
      }}></div>
      
      <div className="stat-header">
        <div className="stat-icon" style={{ background: gradientColors }}>
          <Icon size={28} />
        </div>
        
        {trend && (
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            padding: '8px 16px',
            borderRadius: '20px',
            background: trend.startsWith('+') ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #ef4444, #f87171)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {trend.startsWith('+') ? '↗' : '↘'} {trend}
          </div>
        )}
      </div>
      
      <div className="stat-body">
        <h3 className="stat-value" style={{
          background: gradientColors,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {value}
        </h3>
        <p className="stat-label">{title}</p>
        {percentage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div style={{
              flex: 1,
              height: '6px',
              background: '#e2e8f0',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${percentage}%`,
                background: gradientColors,
                borderRadius: '3px',
                transition: 'width 1.5s ease-in-out'
              }}></div>
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: color
            }}>
              {percentage}%
            </span>
          </div>
        )}
      </div>
      
      <style>{`
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }
      `}</style>
    </div>
  );
};

const HealthItem = ({ icon: Icon, label, status, statusType }) => (
  <div className="health-item">
    <div className="health-label">
      <Icon size={18} />
      <span>{label}</span>
    </div>
    <div className={`health-status ${statusType}`}>
      {statusType === 'good' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{status}</span>
    </div>
  </div>
);

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card">
    <div className="doctor-avatar">
      {doctor.name.split(' ').map(n => n[0]).join('')}
    </div>
    <div className="doctor-info">
      <h4 className="doctor-name">{doctor.name}</h4>
      <p className="doctor-specialty">{doctor.specialty}</p>
      <div className="doctor-stats">
        <span className="doctor-rating">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          {doctor.rating || 4.8}
        </span>
        <span className="doctor-patients">
          {doctor.patients || 0} patients
        </span>
      </div>
    </div>
    <div className={`doctor-status ${doctor.status || 'online'}`}>
      <div className="status-indicator"></div>
      {doctor.status === 'online' ? 'En ligne' : 'Hors ligne'}
    </div>
  </div>
);

// ==================== MODALS ====================
const AddPatientModal = ({ isOpen, onClose, onSubmit }) => {
  const [newPatient, setNewPatient] = useState({ 
    name: '', 
    age: '', 
    phone: '', 
    email: '',
    address: '',
    status: 'Actif'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPatient);
    setNewPatient({ name: '', age: '', phone: '', email: '', address: '', status: 'Actif' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Ajouter un Nouveau Patient</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom Complet *</label>
            <input
              type="text"
              placeholder="Jean Dupont"
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Âge *</label>
              <input
                type="number"
                placeholder="35"
                value={newPatient.age}
                onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="jean.dupont@email.com"
              value={newPatient.email}
              onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              placeholder="123 Rue de Paris"
              value={newPatient.address}
              onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Statut</label>
            <select
              value={newPatient.status}
              onChange={(e) => setNewPatient({...newPatient, status: e.target.value})}
            >
              <option value="Actif">Actif</option>
              <option value="Stable">Stable</option>
              <option value="Surveillance">Surveillance</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              Ajouter Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDoctorModal = ({ isOpen, onClose, onSubmit }) => {
  const [newDoctor, setNewDoctor] = useState({ 
    name: '', 
    specialization: '', 
    email: '', 
    phone: '',
    status: 'Actif'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newDoctor);
    setNewDoctor({ name: '', specialization: '', email: '', phone: '', status: 'Actif' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Ajouter un Nouveau Médecin</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom Complet *</label>
            <input
              type="text"
              placeholder="Dr. Sarah Chen"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Spécialisation *</label>
            <select
              value={newDoctor.specialization}
              onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
              required
            >
              <option value="">Sélectionner une spécialité</option>
              <option value="Cardiologie">Cardiologie</option>
              <option value="Neurologie">Neurologie</option>
              <option value="Pédiatrie">Pédiatrie</option>
              <option value="Orthopédie">Orthopédie</option>
              <option value="Dermatologie">Dermatologie</option>
              <option value="Généraliste">Généraliste</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="sarah.chen@medisynth.com"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Statut</label>
            <select
              value={newDoctor.status}
              onChange={(e) => setNewDoctor({...newDoctor, status: e.target.value})}
            >
              <option value="Actif">Actif</option>
              <option value="En congé">En congé</option>
              <option value="Hors ligne">Hors ligne</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <UserPlus size={16} />
              Ajouter Médecin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddAppointmentModal = ({ isOpen, onClose, onRefresh, patients, doctors }) => {
  const [newAppointment, setNewAppointment] = useState({ 
    PatientId: '', 
    DoctorId: '', 
    AppointmentDate: '', 
    Cost: '', 
    Status: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      patientId: parseInt(newAppointment.PatientId),
      doctorId: parseInt(newAppointment.DoctorId),
      appointmentDate: new Date(newAppointment.AppointmentDate).toISOString(),
      cost: parseFloat(newAppointment.Cost),
      notes: "Ajouté par l'administrateur"
    };

    console.log("Données envoyées à l'API:", dataToSend);

    try {
      const response = await axios.post(`${API_BASE_URL}/Appointments`, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert("Rendez-vous enregistré avec succès !");
      setNewAppointment({ PatientId: '', DoctorId: '', AppointmentDate: '', Cost: '', Status: 0 });
      onClose();
      onRefresh();
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Détails de l'erreur:", err.response?.data);
      
      let errorMsg = "Erreur lors de la communication avec le serveur";
      
      if (err.response?.data?.errors) {
        errorMsg = Object.entries(err.response.data.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      } else if (err.response?.data) {
        errorMsg = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      alert(`Erreur Validation:\n${errorMsg}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Nouveau Rendez-vous</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient *</label>
            <select 
              value={newAppointment.PatientId} 
              onChange={(e) => setNewAppointment({...newAppointment, PatientId: e.target.value})} 
              required
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(p => (
                <option key={p.id || p.Id} value={p.id || p.Id}>
                  {p.name || p.Name} (ID: {p.id || p.Id})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Médecin *</label>
            <select 
              value={newAppointment.DoctorId} 
              onChange={(e) => setNewAppointment({...newAppointment, DoctorId: e.target.value})} 
              required
            >
              <option value="">Sélectionner un médecin</option>
              {doctors.map(d => (
                <option key={d.id || d.Id} value={d.id || d.Id}>
                  {d.name || d.Name} - {d.specialization || d.Specialization} (ID: {d.id || d.Id})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date et Heure *</label>
              <input 
                type="datetime-local" 
                value={newAppointment.AppointmentDate} 
                onChange={(e) => setNewAppointment({...newAppointment, AppointmentDate: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Coût (DT) *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                placeholder="100.00"
                value={newAppointment.Cost} 
                onChange={(e) => setNewAppointment({...newAppointment, Cost: e.target.value})} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Statut</label>
            <select 
              value={newAppointment.Status} 
              onChange={(e) => setNewAppointment({...newAppointment, Status: e.target.value})}
            >
              <option value="0">Prévu (Pending)</option>
              <option value="1">Confirmé (Confirmed)</option>
              <option value="2">Terminé (Completed)</option>
              <option value="3">Annulé (Cancelled)</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Créer Rendez-vous
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== PAGES ====================
const Home = () => (
  <div className="public-container">
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 40px', 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '32px', 
      boxShadow: '0 40px 80px rgba(0,0,0,0.15)', 
      maxWidth: '800px', 
      margin: '20px',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '6px',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
      }}></div>
      
      <div style={{ 
        width: '120px', 
        height: '120px', 
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 32px',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
      }}>
        <Brain size={60} color="white" />
      </div>
      
      <h1 style={{ 
        fontSize: '3.5rem', 
        marginBottom: '20px', 
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '800'
      }}>
        🏥 Clinique MediSynth
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '40px', 
        color: '#64748b',
        lineHeight: '1.6',
        fontWeight: '500'
      }}>
        Plateforme médicale intelligente pour une gestion optimale de votre santé
      </p>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginTop: '40px', 
        flexWrap: 'wrap' 
      }}>
        <Link to="/login" style={{ 
          padding: '18px 36px', 
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
          color: 'white', 
          borderRadius: '16px', 
          textDecoration: 'none', 
          fontWeight: '600', 
          fontSize: '16px',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <User size={20} />
          Connexion Administrateur
        </Link>
        <Link to="/register" style={{ 
          padding: '18px 36px', 
          background: 'linear-gradient(135deg, #10b981, #34d399)', 
          color: 'white', 
          borderRadius: '16px', 
          textDecoration: 'none', 
          fontWeight: '600', 
          fontSize: '16px',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <UserPlus size={20} />
          Inscription Patient
        </Link>
        <Link to="/login" style={{ 
          padding: '18px 36px', 
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', 
          color: 'white', 
          borderRadius: '16px', 
          textDecoration: 'none', 
          fontWeight: '600', 
          fontSize: '16px',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 24px rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <LogOut size={20} />
          Connexion Patient
        </Link>
      </div>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (email === 'admin@medisynth.com' && password === 'admin123') {
      console.log("Redirecting to Admin...");
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin/dashboard');
    } 
    else if (email && password) {
      console.log("Redirecting to Patient Dashboard...");
      const userData = {
        id: 1,
        email: email,
        firstName: email.split('@')[0],
        name: "Patient Test"
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('token', 'patient-token');
      localStorage.setItem('userRole', 'patient');
      localStorage.setItem('userEmail', email);
      navigate('/patient/dashboard');
    } else {
      alert('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="public-container">
      <div style={{ 
        maxWidth: '400px', 
        padding: '48px 40px', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        margin: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
        }}></div>
        
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)'
        }}>
          <User size={40} color="white" />
        </div>
        
        <h2 style={{ 
          marginBottom: '30px', 
          color: '#1e293b', 
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Connexion
        </h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#374151', 
              fontSize: '14px',
              fontWeight: '600' 
            }}>
              Email
            </label>
            <input 
              type="email" 
              placeholder="votre@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }} 
              required
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#374151', 
              fontSize: '14px',
              fontWeight: '600' 
            }}>
              Mot de passe
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }} 
              required
            />
          </div>
          <button type="submit" style={{ 
            width: '100%', 
            padding: '18px', 
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '16px', 
            fontSize: '16px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)'
          }}>
            Se connecter
          </button>
        </form>
        <p style={{ 
          marginTop: '24px', 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '15px'
        }}>
          Pas de compte? <Link to="/register" style={{ 
            color: '#6366f1', 
            textDecoration: 'none',
            fontWeight: '600' 
          }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    const userData = {
      id: 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      name: `${formData.firstName} ${formData.lastName}`
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', 'patient-token');
    localStorage.setItem('userRole', 'patient');
    localStorage.setItem('userEmail', formData.email);
    
    alert('Inscription réussie ! Redirection vers votre espace...');
    navigate('/patient/dashboard');
  };

  return (
    <div className="public-container">
      <div style={{ 
        maxWidth: '500px', 
        padding: '48px 40px', 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
        margin: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #10b981, #34d399)'
        }}></div>
        
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'linear-gradient(135deg, #10b981, #34d399)', 
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)'
        }}>
          <UserPlus size={40} color="white" />
        </div>
        
        <h2 style={{ 
          marginBottom: '30px', 
          color: '#1e293b', 
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          Inscription Patient
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#374151', 
                fontSize: '14px',
                fontWeight: '600' 
              }}>
                Prénom *
              </label>
              <input 
                type="text" 
                name="firstName"
                placeholder="Jean"
                value={formData.firstName}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '14px', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#374151', 
                fontSize: '14px',
                fontWeight: '600' 
              }}>
                Nom *
              </label>
              <input 
                type="text" 
                name="lastName"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '14px', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#374151', 
              fontSize: '14px',
              fontWeight: '600' 
            }}>
              Téléphone *
            </label>
            <input 
              type="tel" 
              name="phone"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#374151', 
              fontSize: '14px',
              fontWeight: '600' 
            }}>
              Email *
            </label>
            <input 
              type="email" 
              name="email"
              placeholder="jean.dupont@email.com"
              value={formData.email}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '14px', 
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#374151', 
                fontSize: '14px',
                fontWeight: '600' 
              }}>
                Mot de passe *
              </label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '14px', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#374151', 
                fontSize: '14px',
                fontWeight: '600' 
              }}>
                Confirmation *
              </label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '14px', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                required
              />
            </div>
          </div>
          
          <button type="submit" style={{ 
            width: '100%', 
            padding: '18px', 
            background: 'linear-gradient(135deg, #10b981, #34d399)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '16px', 
            fontSize: '16px', 
            fontWeight: '600', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)'
          }}>
            S'inscrire
          </button>
        </form>
        <p style={{ 
          marginTop: '24px', 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '15px'
        }}>
          Déjà un compte? <Link to="/login" style={{ 
            color: '#6366f1', 
            textDecoration: 'none',
            fontWeight: '600' 
          }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

// ==================== CHATBOT PREMIUM ====================
const PatientChatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "👋 Bonjour ! Je suis votre assistant médical virtuel. Comment puis-je vous aider aujourd'hui ?", 
      sender: 'bot', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    },
    { 
      id: 2, 
      text: "Je peux vous aider à: 📅 Prendre rendez-vous, 💊 Expliquer des symptômes, 🏥 Trouver des spécialistes, ⏰ Vérifier vos rendez-vous", 
      sender: 'bot', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickQuestions = [
    "📅 Prendre un rendez-vous",
    "👨‍⚕️ Trouver un médecin",
    "💰 Tarifs consultation",
    "📍 Où sommes-nous ?",
    "⏰ Horaires d'ouverture",
    "🔄 Annuler un RDV"
  ];

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let response = "";
    
    if (message.includes('rendez-vous') || message.includes('rdv')) {
      response = "Pour prendre un rendez-vous, cliquez sur le bouton 'Prendre un Rendez-vous' en haut de la page ou dites-moi 'Je veux prendre RDV'. Je peux vous guider étape par étape !";
    } else if (message.includes('médecin') || message.includes('doctor')) {
      response = "Nous avons une équipe médicale exceptionnelle : Cardiologues, Pédiatres, Dermatologues, Neurologues. Quel type de spécialiste cherchez-vous ? Je peux vous orienter vers le meilleur professionnel !";
    } else if (message.includes('symptôme') || message.includes('malade')) {
      response = "⚠️ Je ne peux pas remplacer un diagnostic médical. Pour des symptômes graves, appelez immédiatement le 190 ou rendez-vous aux urgences. Pour une consultation, je peux vous aider à prendre rendez-vous avec un spécialiste.";
    } else if (message.includes('heure') || message.includes('ouverture')) {
      response = "📅 **Horaires de consultation** :\n• Lundi-Vendredi: 8h-18h\n• Samedi: 9h-13h\n• Urgences: 24h/24\n\nPour plus de détails, consultez notre section 'Horaires'.";
    } else if (message.includes('prix') || message.includes('coût')) {
      response = "💶 **Nos tarifs** :\n• Consultation standard: 50 DT\n• Spécialistes: 70 DT\n• Certaines assurances remboursent partiellement\n\nContactez votre assurance pour plus d'informations !";
    } else if (message.includes('localisation') || message.includes('adresse')) {
      response = "📍 **Notre clinique** :\n123 Rue de la Santé, Tunis 1002\n📞 +216 71 123 456\n📧 contact@medisynth.tn\n\nVous pouvez cliquer ici pour voir sur Google Maps !";
    } else if (message.includes('annuler')) {
      response = "Pour annuler un rendez-vous, contactez le secrétariat au +216 71 123 456 ou envoyez un email à contact@medisynth.tn au moins 24h à l'avance pour éviter des frais.";
    } else if (message.includes('merci') || message.includes('thanks')) {
      response = "Je vous en prie ! 😊 N'hésitez pas si vous avez d'autres questions. Prenez soin de vous et à bientôt !";
    } else if (message.includes('bonjour') || message.includes('salut')) {
      response = "Bonjour ! 👋 Ravie de vous aider aujourd'hui ! Je suis votre assistant médical virtuel, prêt à répondre à toutes vos questions concernant notre clinique.";
    } else if (message.includes('urgence')) {
      response = "🚨 **URGENCE MÉDICALE** :\n• Appelez immédiatement le 190\n• Rendez-vous aux urgences les plus proches\n• Ne prenez pas de rendez-vous en ligne pour les urgences\n\n**Votre santé est notre priorité !**";
    } else {
      response = "Je ne suis pas sûr de comprendre. Je peux vous aider avec :\n• Rendez-vous médicaux\n• Informations sur les médecins\n• Horaires et tarifs\n• Localisation de la clinique\n• Questions générales\n\nPosez-moi une question spécifique !";
    }
    
    return {
      id: messages.length + 2,
      text: response,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      <button 
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: '4px solid white',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
          zIndex: 100,
          transition: 'all 0.3s ease',
          transform: chatOpen ? 'rotate(45deg)' : 'none'
        }}
      >
        {chatOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!chatOpen && (
          <div style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            boxShadow: '0 4px 8px rgba(239, 68, 68, 0.3)'
          }}>
            1
          </div>
        )}
      </button>

      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '130px',
          right: '40px',
          width: '400px',
          height: '600px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 99,
          border: '1px solid #e2e8f0',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <Bot size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                  Assistant MediSynth
                </h3>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>
                  En ligne • Prêt à vous aider
                </div>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  maxWidth: '85%',
                  padding: '16px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  background: message.sender === 'bot' ? 'white' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: message.sender === 'bot' ? '#1e293b' : 'white',
                  alignSelf: message.sender === 'bot' ? 'flex-start' : 'flex-end',
                  border: message.sender === 'bot' ? '1px solid #e2e8f0' : 'none',
                  boxShadow: message.sender === 'bot' ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 12px rgba(99, 102, 241, 0.2)',
                  whiteSpace: 'pre-line'
                }}
              >
                <div>{message.text}</div>
                <div style={{
                  fontSize: '11px',
                  marginTop: '8px',
                  opacity: 0.7,
                  textAlign: message.sender === 'user' ? 'right' : 'left'
                }}>
                  {message.time}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'white',
                padding: '16px 20px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    animation: 'bounce 1.4s infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    animation: 'bounce 1.4s infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    animation: 'bounce 1.4s infinite 0.4s'
                  }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '20px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                style={{
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                  border: '2px solid transparent',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                {question}
              </button>
            ))}
          </div>

          <div style={{
            padding: '20px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1,
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              style={{
                width: '56px',
                background: inputMessage.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
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
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
        
        .patient-chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 25px 50px rgba(99, 102, 241, 0.6);
        }
        
        .patient-chatbot-toggle.open:hover {
          transform: scale(1.1) rotate(45deg);
        }
      `}</style>
    </>
  );
};

// ==================== PATIENT DASHBOARD PREMIUM ====================
const PatientDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
    setAppointments(storedAppointments);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('patientAppointments');
    navigate('/');
  };

  const handleBookAppointment = () => {
    navigate('/patient/booking');
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) {
      const updatedAppointments = appointments.filter(app => app.id !== appointmentId);
      setAppointments(updatedAppointments);
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
    }
  };

  return (
    <div className="patient-container">
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 20%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header Premium */}
      <div className="patient-header-premium">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)'
              }}>
                <User size={36} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#1e293b',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Espace Patient
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  Bonjour, <span style={{
                    color: '#6366f1',
                    fontWeight: '700'
                  }}>{userData.firstName || 'Patient'}</span> ! 👋
                </p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                padding: '12px 20px',
                borderRadius: '14px',
                fontSize: '15px',
                color: '#475569',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Mail size={16} />
                {userEmail || 'patient@email.com'}
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                padding: '12px 20px',
                borderRadius: '14px',
                fontSize: '15px',
                color: '#475569',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Shield size={16} />
                Patient ID: #{userData.id || '1'}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleBookAppointment}
              style={{
                padding: '18px 36px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)'
              }}
            >
              <CalendarDays size={22} />
              Prendre RDV
            </button>
            <button 
              onClick={handleLogout}
              style={{
                padding: '18px 36px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)'
              }}
            >
              <LogOut size={22} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Clinic Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
          }}></div>
          
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#6366f1',
            marginBottom: '28px',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            <Stethoscope size={24} />
            Informations de la Clinique
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Adresse</div>
                <div style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>123 Rue de la Santé, Tunis 1002</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Téléphone</div>
                <div style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>+216 71 123 456</div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 0'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Email</div>
                <div style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>contact@medisynth.tn</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            background: 'linear-gradient(90deg, #10b981, #34d399)'
          }}></div>
          
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#10b981',
            marginBottom: '28px',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            <ClockIcon size={24} />
            Horaires d'Ouverture
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ width: '140px', fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Lundi - Vendredi</div>
              <div style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>08:00 - 18:00</div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ width: '140px', fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Samedi</div>
              <div style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>09:00 - 13:00</div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ width: '140px', fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Dimanche</div>
              <div style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>Fermé</div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0'
            }}>
              <div style={{ width: '140px', fontWeight: '600', color: '#1e293b', fontSize: '16px' }}>Urgences</div>
              <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '16px' }}>24h/24</div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
        }}></div>
        
        <h3 style={{
          marginBottom: '28px',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '20px',
          fontWeight: '700'
        }}>
          <CalendarIcon size={24} />
          Mes Rendez-vous
        </h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '500' }}>Chargement des rendez-vous...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#94a3b8'
            }}>
              <Calendar size={40} />
            </div>
            <h4 style={{ marginBottom: '12px', color: '#475569', fontSize: '20px', fontWeight: '700' }}>Aucun rendez-vous</h4>
            <p style={{ marginBottom: '32px', fontSize: '15px' }}>Vous n'avez pas encore de rendez-vous programmé.</p>
            <button 
              onClick={handleBookAppointment}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)'
              }}
            >
              Prendre un premier rendez-vous
            </button>
          </div>
        ) : (
          <div>
            {appointments.map((appointment, index) => (
              <div key={index} style={{
                background: '#f8fafc',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '20px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {appointment.doctor?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '700', marginBottom: '8px', color: '#1e293b', fontSize: '18px' }}>
                        {appointment.doctor?.name || 'Médecin'}
                      </h4>
                      <div style={{ color: '#6366f1', fontSize: '15px', fontWeight: '600' }}>
                        {appointment.doctor?.specialization || 'Spécialité'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#64748b',
                    fontSize: '15px',
                    fontWeight: '500'
                  }}>
                    <Clock size={20} />
                    <span>{appointment.date} à {appointment.time}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '15px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>
                      Motif: {appointment.reason || 'Consultation générale'}
                    </div>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '8px 16px',
                      background: appointment.status === 'Annulé' ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                      color: appointment.status === 'Annulé' ? '#dc2626' : '#0369a1',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {appointment.status === 'Annulé' ? <XCircle size={16} /> : <Check size={16} />}
                      {appointment.status || 'Prévu'}
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleCancelAppointment(appointment.id)}
                      style={{ 
                        padding: '12px 24px', 
                        background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', 
                        color: '#dc2626', 
                        border: '2px solid #fecaca', 
                        borderRadius: '12px', 
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <X size={18} />
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialties Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
        }}></div>
        
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#8b5cf6',
          marginBottom: '28px',
          fontSize: '20px',
          fontWeight: '700'
        }}>
          <Stethoscope size={24} />
          Spécialités Médicales
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {['Cardiologie', 'Neurologie', 'Pédiatrie', 'Orthopédie', 'Dermatologie', 'Gynécologie', 'Ophtalmologie', 'Médecine Générale'].map((specialty, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#475569',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}>
              {specialty}
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)', 
        border: '2px solid #f59e0b',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '16px' 
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0
          }}>
            <AlertTriangle size={24} />
          </div>
          <h4 style={{ color: '#92400e', margin: 0, fontSize: '20px', fontWeight: '700' }}>Information Importante</h4>
        </div>
        <p style={{ 
          color: '#92400e', 
          fontSize: '16px', 
          margin: 0,
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          En cas d'urgence médicale, appelez immédiatement le <strong style={{ fontSize: '18px' }}>190</strong> ou rendez-vous aux urgences les plus proches.
          Ne prenez pas de rendez-vous en ligne pour les urgences.
        </p>
      </div>

      {/* Chatbot Component */}
      <PatientChatbot />
    </div>
  );
};

// ==================== PATIENT BOOKING PREMIUM ====================
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
  
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const patientId = userData.id || 1;

  useEffect(() => {
    if (!userData || !userData.id) {
      alert("Vous devez être connecté pour prendre un rendez-vous.");
      navigate('/login');
      return;
    }
  }, [navigate, userData]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Doctors?t=${Date.now()}`);
        console.log("LISTE DES MÉDECINS REÇUE:", response.data);
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

    const appointmentData = {
      patientId: patientId,
      doctorId: selectedDoctor.id || selectedDoctor.Id,
      appointmentDate: `${selectedDate}T${selectedTime}:00`,
      cost: 50.00,
      notes: reason || "Consultation générale"
    };

    console.log("Données envoyées à l'API:", appointmentData);
    console.log("Patient ID utilisé:", patientId);

    try {
      setSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/Appointments`, appointmentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      alert('🎉 Rendez-vous pris avec succès !');
      
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
      
      navigate('/patient/dashboard');
    } catch (err) {
      console.error("Erreur complète:", err);
      console.error("Détails de l'erreur:", err.response?.data);
      
      let errorMsg = "Erreur lors de la prise de rendez-vous";
      
      if (err.response?.status === 404) {
        errorMsg = "Patient introuvable. Vérifiez votre identifiant.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
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
      <div className="patient-container">
        <div className="patient-header-premium">
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Prendre un Rendez-vous
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Chargement des médecins...
            </p>
          </div>
        </div>
        <div className="loading-container" style={{ padding: '100px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px', fontWeight: '500' }}>Connexion à l'API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-container">
      <div className="patient-header-premium">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          width: '100%'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Prendre un Rendez-vous
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              Suivez les étapes pour réserver votre consultation
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 12px 24px rgba(239, 68, 68, 0.3)'
            }}
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="booking-container-premium">
        {error && (
          <div style={{
            backgroundColor: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            color: '#dc2626',
            padding: '20px',
            borderRadius: '16px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '2px solid #fecaca'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <strong style={{ fontSize: '16px' }}>Erreur :</strong> {error}
              <div style={{ fontSize: '14px', marginTop: '8px', color: '#9ca3af' }}>
                Patient ID utilisé: {patientId}
              </div>
            </div>
          </div>
        )}

        <div className="booking-steps-premium">
          <div className={`step-premium ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number-premium">1</div>
            <div className="step-label-premium">Choisir un médecin</div>
          </div>
          <div className={`step-premium ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number-premium">2</div>
            <div className="step-label-premium">Date et heure</div>
          </div>
          <div className={`step-premium ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number-premium">3</div>
            <div className="step-label-premium">Confirmation</div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ 
              marginBottom: '32px', 
              color: '#1e293b',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Sélectionnez un médecin
            </h3>
            <div className="doctors-grid-premium">
              {doctors.length > 0 ? doctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className={`doctor-select-card-premium ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setError('');
                  }}
                >
                  <h4>{doctor.name}</h4>
                  <p>{doctor.specialization || doctor.specialty}</p>
                  <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                    ID: {doctor.id}
                  </div>
                </div>
              )) : (
                <div style={{ 
                  gridColumn: '1/-1', 
                  textAlign: 'center', 
                  padding: '60px', 
                  color: '#64748b',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  Aucun médecin disponible. Veuillez réessayer plus tard.
                </div>
              )}
            </div>
            <div style={{ marginTop: '40px', textAlign: 'right' }}>
              <button 
                onClick={handleNextStep}
                disabled={!selectedDoctor}
                style={{ 
                  padding: '16px 32px', 
                  background: !selectedDoctor ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                  color: !selectedDoctor ? '#94a3b8' : 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  cursor: selectedDoctor ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedDoctor ? '0 12px 24px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ 
              marginBottom: '32px', 
              color: '#1e293b',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Sélectionnez la date et l'heure
            </h3>
            
            <div style={{ marginBottom: '40px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                color: '#374151', 
                fontSize: '16px',
                fontWeight: '600' 
              }}>
                Date
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError('');
                }}
                min={new Date().toISOString().split('T')[0]}
                style={{ 
                  width: '100%', 
                  padding: '18px 20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '16px', 
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <h4 style={{ 
              marginBottom: '24px', 
              color: '#475569',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Heures disponibles
            </h4>
            <div className="time-slots-premium">
              {timeSlots.map(time => (
                <div 
                  key={time}
                  className={`time-slot-premium ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedTime(time);
                    setError('');
                  }}
                >
                  {time}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={handlePrevStep}
                style={{ 
                  padding: '16px 32px', 
                  background: '#f1f5f9', 
                  color: '#475569', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Retour
              </button>
              <button 
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTime}
                style={{ 
                  padding: '16px 32px', 
                  background: (!selectedDate || !selectedTime) ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                  color: (!selectedDate || !selectedTime) ? '#94a3b8' : 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  cursor: (selectedDate && selectedTime) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: (selectedDate && selectedTime) ? '0 12px 24px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ 
              marginBottom: '32px', 
              color: '#1e293b',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Confirmez votre rendez-vous
            </h3>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '32px', 
              borderRadius: '20px', 
              marginBottom: '40px',
              border: '2px solid #e2e8f0'
            }}>
              <h4 style={{ 
                marginBottom: '24px', 
                color: '#475569',
                fontSize: '20px',
                fontWeight: '700'
              }}>
                Récapitulatif
              </h4>
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Médecin</div>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>{selectedDoctor?.name}</div>
                <div style={{ color: '#64748b', fontSize: '16px', marginTop: '4px' }}>{selectedDoctor?.specialization || selectedDoctor?.specialty}</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Date et Heure</div>
                <div style={{ fontWeight: '700', fontSize: '18px' }}>{selectedDate} à {selectedTime}</div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>Motif de consultation</div>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setError('');
                  }}
                  placeholder="Décrivez vos symptômes ou le motif de votre consultation..."
                  rows="4"
                  style={{ 
                    width: '100%', 
                    padding: '18px 20px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '16px', 
                    fontSize: '16px',
                    marginTop: '8px',
                    resize: 'vertical',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ 
                marginTop: '24px', 
                padding: '20px', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '16px', 
                fontSize: '15px',
                border: '2px solid #e0f2fe'
              }}>
                <div style={{ color: '#0369a1', fontWeight: '700', marginBottom: '8px' }}>Informations techniques :</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                  Patient ID: {patientId} | Doctor ID: {selectedDoctor?.id}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={handlePrevStep}
                style={{ 
                  padding: '16px 32px', 
                  background: '#f1f5f9', 
                  color: '#475569', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Retour
              </button>
              <button 
                onClick={handleSubmitBooking}
                disabled={submitting}
                style={{ 
                  padding: '16px 32px', 
                  background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981, #34d399)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: submitting ? 'none' : '0 12px 24px rgba(16, 185, 129, 0.3)'
                }}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div>
                    En cours...
                  </>
                ) : (
                  'Confirmer le Rendez-vous'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== PAGES ADMIN ====================
const Dashboard = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [timeRange, setTimeRange] = useState('week');

  const fetchApiData = async () => {
    setApiStatus('connecting');
    try {
      const response = await axios.get(`${API_BASE_URL}/Dashboard/stats`);
      setApiData(response.data);
      setApiStatus('connected');
    } catch (error) {
      console.warn('API .NET non disponible, utilisation des données de démonstration');
      setApiStatus('disconnected');
      setApiData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiData();
    const interval = setInterval(fetchApiData, 30000);
    return () => clearInterval(interval);
  }, []);

  const data = normalizeApiData(apiData);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ fontWeight: '500' }}>Connexion à l'API .NET...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Tableau de Bord MediSynth</h1>
          <div className={`api-status ${apiStatus}`}>
            {apiStatus === 'connected' ? '✓ Connecté à l\'API .NET' : 
             apiStatus === 'disconnected' ? '⚠ Mode démonstration' : 'Connexion...'}
          </div>
        </div>
        <button className="btn-refresh" onClick={fetchApiData} disabled={loading}>
          <Zap size={18} className={loading ? 'spinning' : ''} />
          {loading ? 'Actualisation...' : 'Actualiser API'}
        </button>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Patients Totaux" 
          value={data.totalPatients.toLocaleString()} 
          icon={Users} 
          color="#6366f1"
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
          trend="+5.2%"
          percentage={85}
        />
        <StatCard 
          title="Médecins Actifs" 
          value={data.totalDoctors} 
          icon={UserPlus} 
          color="#10b981"
          gradient="linear-gradient(135deg, #10b981, #34d399)"
          trend="En ligne"
          percentage={92}
        />
        <StatCard 
          title="Rendez-vous" 
          value={data.totalAppointments} 
          icon={Calendar} 
          color="#f59e0b"
          gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          trend="+8.7%"
          percentage={78}
        />
        <StatCard 
          title="Revenu Mensuel" 
          value={`${(data.totalRevenue / 1000).toFixed(1)}K $`} 
          icon={DollarSign} 
          color="#8b5cf6"
          gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          trend="+12.4%"
          percentage={65}
        />
      </div>

      <div className="charts-grid">
        <div className="main-chart">
          <div className="chart-header">
            <h3>Analytique des Revenus</h3>
            <div className="chart-tabs">
              {['Jour', 'Semaine', 'Mois'].map(period => (
                <button
                  key={period}
                  className={`tab-btn ${timeRange === period.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setTimeRange(period.toLowerCase())}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.revenueHistory}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenu']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="side-panel">
          <div className="panel-card">
            <h4>Répartition des Spécialités</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.specializations}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.specializations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel-card">
            <h4>Santé du Système</h4>
            <div className="health-list">
              <HealthItem 
                icon={Database} 
                label="API .NET" 
                status={apiStatus === 'connected' ? 'Connecté' : 'Hors ligne'} 
                statusType={apiStatus === 'connected' ? 'good' : 'warning'} 
              />
              <HealthItem 
                icon={Cpu} 
                label="Performance" 
                status="Optimale" 
                statusType="good" 
              />
              <HealthItem 
                icon={Wifi} 
                label="Réseau" 
                status="Stable" 
                statusType="good" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="doctors-section">
          <div className="section-header">
            <h3>Équipe Médicale</h3>
            <button className="btn-view-all">
              Voir tout <ChevronRight size={18} />
            </button>
          </div>
          <div className="doctors-list">
            {[
              { name: 'Dr. Sarah Chen', specialty: 'Cardiologie', rating: 4.9, patients: 156, status: 'online' },
              { name: 'Dr. Michael Rodriguez', specialty: 'Neurologie', rating: 4.8, patients: 142, status: 'online' },
              { name: 'Dr. James Wilson', specialty: 'Orthopédie', rating: 4.7, patients: 128, status: 'offline' }
            ].map((doctor, index) => (
              <DoctorCard key={index} doctor={doctor} />
            ))}
          </div>
        </div>

        <div className="quick-stats">
          <div className="stats-grid-small">
            <div className="quick-stat">
              <div className="quick-stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                <Heart size={24} />
              </div>
              <div>
                <div className="quick-stat-value">96%</div>
                <div className="quick-stat-label">Satisfaction Patients</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <Clock size={24} />
              </div>
              <div>
                <div className="quick-stat-value">8 min</div>
                <div className="quick-stat-label">Temps d'attente</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #047857)' }}>
                <Target size={24} />
              </div>
              <div>
                <div className="quick-stat-value">94%</div>
                <div className="quick-stat-label">Succès Traitement</div>
              </div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                <Shield size={24} />
              </div>
              <div>
                <div className="quick-stat-value">99.8%</div>
                <div className="quick-stat-label">Score Sécurité</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Patients`);
      setPatients(response.data || []);
    } catch (error) {
      console.warn('API Patients non disponible');
      setPatients([
        { id: 1, name: 'Jean Dupont', age: 45, status: 'Actif', lastVisit: '2024-01-15', phone: '06 12 34 56 78' },
        { id: 2, name: 'Marie Martin', age: 32, status: 'Stable', lastVisit: '2024-01-14', phone: '06 23 45 67 89' },
        { id: 3, name: 'Pierre Lambert', age: 58, status: 'Surveillance', lastVisit: '2024-01-15', phone: '06 34 56 78 90' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (newPatient) => {
    try {
      await axios.post(`${API_BASE_URL}/Patients`, newPatient);
      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      alert("Erreur lors de l'ajout du patient");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
        try {
            await axios.delete(`${API_BASE_URL}/Patients/${id}`);
            setPatients(patients.filter(p => p.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, var(--primary), var(--accent))'
      }}></div>
      
      <div className="page-header">
        <div>
          <h1>Gestion des Patients</h1>
          <p>{patients.length} patients enregistrés</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Nouveau Patient
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Âge</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Dernière Visite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id || patient.Id}>
                <td>
                  <div className="patient-info">
                    <div className="patient-avatar">
                      {(patient.name || patient.Name)?.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="patient-name">{patient.name || patient.Name}</div>
                      <div className="patient-id">ID: #{patient.id || patient.Id}</div>
                    </div>
                  </div>
                </td>
                <td>{patient.age || patient.Age}</td>
                <td>{patient.phone || patient.Phone || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${(patient.status || patient.Status)?.toLowerCase()}`}>
                    {patient.status || patient.Status}
                  </span>
                </td>
                <td>{patient.lastVisit || patient.LastVisit || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn">
                      <Eye size={18} />
                    </button>
                    <button className="action-btn edit">
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(patient.id || patient.Id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {patients.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0',
            color: '#64748b'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#94a3b8'
            }}>
              <Users size={40} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Aucun patient trouvé</h3>
            <p style={{ fontSize: '15px' }}>Commencez par ajouter un nouveau patient</p>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ fontWeight: '500' }}>Chargement des patients...</p>
          </div>
        )}
      </div>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPatient}
      />
    </div>
  );
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Doctors`);
      setDoctors(response.data || []);
    } catch (error) {
      console.warn('API Doctors non disponible');
      setDoctors([
        { id: 1, name: 'Dr. Sarah Chen', specialization: 'Cardiologie', status: 'Actif', email: 'sarah.chen@medisynth.com', phone: '06 12 34 56 78' },
        { id: 2, name: 'Dr. Michael Rodriguez', specialization: 'Neurologie', status: 'Actif', email: 'michael@medisynth.com', phone: '06 23 45 67 89' },
        { id: 3, name: 'Dr. James Wilson', specialization: 'Orthopédie', status: 'En congé', email: 'james@medisynth.com', phone: '06 34 56 78 90' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (newDoctor) => {
    try {
      await axios.post(`${API_BASE_URL}/Doctors`, newDoctor);
      setIsDocModalOpen(false);
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du médecin. Vérifiez la connexion à l'API.");
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
      }}></div>
      
      <div className="page-header">
        <div>
          <h1>Gestion des Médecins</h1>
          <p>{doctors.length} médecins enregistrés</p>
        </div>
        <button className="btn-primary" onClick={() => setIsDocModalOpen(true)}>
          <UserPlus size={20} />
          Ajouter un Médecin
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ fontWeight: '500' }}>Chargement des médecins...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0',
            color: '#64748b'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#94a3b8'
            }}>
              <UserPlus size={40} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Aucun médecin trouvé</h3>
            <p style={{ fontSize: '15px' }}>Commencez par ajouter un nouveau médecin</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>MÉDECIN</th>
                <th>SPÉCIALITÉ</th>
                <th>CONTACT</th>
                <th>STATUT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id || doctor.Id || index}>
                  <td>
                    <div className="patient-info">
                      <div className="patient-avatar" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
                        {(doctor.name || doctor.Name)?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="patient-name">{doctor.name || doctor.Name}</div>
                        <div className="patient-id">ID: #{doctor.id || doctor.Id || index + 1}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#475569'
                    }}>
                      {doctor.specialization || doctor.Specialization}
                    </span>
                  </td>
                  <td>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#1e293b' 
                      }}>
                        {doctor.email || doctor.Email || 'N/A'}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#64748b',
                        fontWeight: '500' 
                      }}>
                        {doctor.phone || doctor.Phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${(doctor.status || doctor.Status) === 'Actif' ? 'actif' : (doctor.status || doctor.Status) === 'En congé' ? 'surveillance' : 'stable'}`}>
                      {doctor.status || doctor.Status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn">
                        <Eye size={18} />
                      </button>
                      <button className="action-btn edit">
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddDoctorModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [appRes, patRes, docRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/Appointments`),
        axios.get(`${API_BASE_URL}/Patients`),
        axios.get(`${API_BASE_URL}/Doctors`)
      ]);

      if (appRes.status === 'fulfilled') {
        setAppointments(appRes.value.data || []);
      } else {
        console.error("Erreur chargement rendez-vous:", appRes.reason);
        setAppointments([]);
      }

      if (patRes.status === 'fulfilled') {
        setPatients(patRes.value.data || []);
      } else {
        console.error("Erreur chargement patients:", patRes.reason);
        setPatients([]);
      }

      if (docRes.status === 'fulfilled') {
        setDoctors(docRes.value.data || []);
      } else {
        console.error("Erreur chargement médecins:", docRes.reason);
        setDoctors([]);
      }

    } catch (err) {
      console.error("Erreur générale:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce rendez-vous ?")) {
      try {
        await axios.delete(`${API_BASE_URL}/Appointments/${id}`);
        fetchData();
      } catch (err) { 
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression"); 
      }
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 0: return 'Prévu';
      case 1: return 'Confirmé';
      case 2: return 'Terminé';
      case 3: return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 0: return 'pending';
      case 1: return 'confirmed';
      case 2: return 'completed';
      case 3: return 'cancelled';
      default: return '';
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
      }}></div>
      
      <div className="page-header">
        <div>
          <h1>Gestion des Rendez-vous</h1>
          <p>{appointments.length} rendez-vous enregistrés</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nouveau Rendez-vous
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ fontWeight: '500' }}>Chargement des rendez-vous...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 0',
            color: '#64748b'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#94a3b8'
            }}>
              <Calendar size={40} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>Aucun rendez-vous trouvé</h3>
            <p style={{ fontSize: '15px' }}>Commencez par ajouter un nouveau rendez-vous</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>DATE ET HEURE</th>
                <th>PATIENT</th>
                <th>MÉDECIN</th>
                <th>PRIX (DT)</th>
                <th>STATUT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => {
                const patientId = app.patientId || app.PatientId;
                const doctorId = app.doctorId || app.DoctorId;
                const statusValue = app.status || app.Status;
                
                const patient = patients.find(p => 
                  (p.id === patientId) || (p.Id === patientId)
                );
                const doctor = doctors.find(d => 
                  (d.id === doctorId) || (d.Id === doctorId)
                );
                
                return (
                  <tr key={app.id || app.Id}>
                    <td>{new Date(app.appointmentDate || app.AppointmentDate).toLocaleString('fr-FR')}</td>
                    <td>{patient ? (patient.name || patient.Name) : `ID: ${patientId}`}</td>
                    <td>{doctor ? (doctor.name || doctor.Name) : `ID: ${doctorId}`}</td>
                    <td>{app.cost || app.Cost} DT</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(statusValue)}`}>
                        {getStatusText(statusValue)}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn delete" onClick={() => handleDelete(app.id || app.Id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchData}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
};

// ==================== SIDEBAR COMPONENT ====================
const Sidebar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState(3);
  const location = useLocation();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Brain size={28} />
          </div>
          {!sidebarCollapsed && <h2>MediSynth</h2>}
        </div>
        <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavItem to="/admin/dashboard" icon={<LayoutDashboard />} label="Tableau de Bord" collapsed={sidebarCollapsed} />
        <NavItem to="/admin/patients" icon={<Users />} label="Patients" badge="3+" collapsed={sidebarCollapsed} />
        <NavItem to="/admin/doctors" icon={<UserPlus />} label="Médecins" collapsed={sidebarCollapsed} />
        <NavItem to="/admin/appointments" icon={<Calendar />} label="Rendez-vous" collapsed={sidebarCollapsed} />
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="nav-link">
          <div className={`nav-item ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="nav-icon">
              <HomeIcon size={22} />
            </div>
            {!sidebarCollapsed && <span className="nav-label">Accueil Public</span>}
          </div>
        </Link>
        <NavItem to="/admin/settings" icon={<Settings />} label="Paramètres" collapsed={sidebarCollapsed} />
        <NavItem to="/logout" icon={<LogOut />} label="Déconnexion" collapsed={sidebarCollapsed} />
      </div>
    </aside>
  );
};

// ==================== TOPBAR COMPONENT ====================
const Topbar = () => {
  const location = useLocation();
  const [notifications] = useState(3);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Tableau de Bord';
    if (path.includes('patients')) return 'Patients';
    if (path.includes('doctors')) return 'Médecins';
    if (path.includes('appointments')) return 'Rendez-vous';
    return 'Tableau de Bord';
  };

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Admin</span>
        <ChevronRight size={16} />
        <span className="active">{getPageTitle()}</span>
      </div>
      
      <div className="topbar-actions">
        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Rechercher patients, médecins..." />
          <div className="search-shortcut">⌘K</div>
        </div>
        
        <button className="icon-btn notification-btn">
          <Bell size={22} />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </button>
        
        <button className="icon-btn">
          <Download size={22} />
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Dr. Admin</span>
            <span className="user-role">Administrateur</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ==================== PROTECTED ROUTE ====================
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// ==================== APPLICATION PRINCIPALE ====================
export default function App() {
  return (
    <>
      <style>{styles}</style>
      <Router>
        <Routes>
          {/* --- 1. Routes Public --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- 2. Espace Patient (Protégé) --- */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/booking" element={
            <ProtectedRoute role="patient">
              <PatientBooking />
            </ProtectedRoute>
          } />

          {/* --- 3. Espace Admin (Protégé) --- */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <div className="app">
                <Sidebar />
                <main className="main-content">
                  <Topbar />
                  <div className="content-area">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="patients" element={<Patients />} />
                      <Route path="doctors" element={<DoctorsPage />} />
                      <Route path="appointments" element={<AppointmentsPage />} />
                    </Routes>
                  </div>
                </main>

                <div className="ai-assistant">
                  <div className="ai-pulse"></div>
                  <Brain size={28} />
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}