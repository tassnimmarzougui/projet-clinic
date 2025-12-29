import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, Clock, Printer, Search } from 'lucide-react';

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:5268/api/Invoices");
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error);
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-xl font-bold">Chargement des factures...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <FileText className="text-blue-600" /> Gestion des Factures
        </h2>
        
        {/* Barre de recherche */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Chercher un patient..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Tableau des Factures */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Réf</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Patient</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date Billing</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Montant</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Statut</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-blue-600">#INV-{inv.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{inv.patientName}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(inv.billingDate).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">{inv.totalAmount} DT</td>
                <td className="px-6 py-4">
                  {inv.isPaid ? (
                    <span className="flex items-center gap-1 w-fit px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                      <CheckCircle size={14} /> Payé
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 w-fit px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                      <Clock size={14} /> En attente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => window.print()} 
                    className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                    title="Imprimer"
                  >
                    <Printer size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="p-10 text-center text-gray-500 italic">
            Aucune facture trouvée.
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesList;