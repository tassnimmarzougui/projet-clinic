import { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);

    // Fonction pour charger les données
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:5268/api/Appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Liste des Rendez-vous</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Patient</th>
                            <th className="px-6 py-3 text-left">Médecin</th>
                            <th className="px-6 py-3 text-left">Coût</th>
                            <th className="px-6 py-3 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((app) => (
                            <tr key={app.id} className="border-b">
                                <td className="px-6 py-4">{new Date(app.appointmentDate).toLocaleString()}</td>
                                <td className="px-6 py-4">{app.patientName}</td>
                                <td className="px-6 py-4">{app.doctorName}</td>
                                <td className="px-6 py-4">{app.cost} DT</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded ${app.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};