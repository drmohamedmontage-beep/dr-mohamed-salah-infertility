import React, { useState, useMemo } from 'react';
import { Printer, Plus, X, Search } from 'lucide-react';

export default function PrescriptionWriter({
  medicines = [],
  patientName = 'Patient',
  patientAge = 0,
  lang = 'en'
}) {
  const [prescription, setPrescription] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');

  // Filter medicines based on search
  const filteredMedicines = useMemo(() => {
    if (!searchTerm) return [];
    return medicines.filter(m =>
      m.trade_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, medicines]);

  // Add medicine to prescription
  const handleAddMedicine = (medicine) => {
    const newItem = {
      trade_name: medicine.trade_name,
      dosage: medicine.default_dosage,
      quantity: 1
    };
    setPrescription([...prescription, newItem]);
    setSearchTerm('');
  };

  // Remove medicine from prescription
  const handleRemoveMedicine = (index) => {
    setPrescription(prescription.filter((_, i) => i !== index));
  };

  // Update dosage
  const handleUpdateDosage = (index, dosage) => {
    const updated = [...prescription];
    updated[index].dosage = dosage;
    setPrescription(updated);
  };

  // Update instructions
  const handleUpdateInstructions = (index, instructions) => {
    const updated = [...prescription];
    updated[index].instructions = instructions;
    setPrescription(updated);
  };

  // Print prescription
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-300">
        <h1 className="text-2xl font-bold text-gray-800">Prescription Writer</h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 uppercase">Patient Name</p>
          <p className="text-lg font-semibold text-gray-800">{patientName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Age</p>
          <p className="text-lg font-semibold text-gray-800">{patientAge} years</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Date</p>
          <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Clinic</p>
          <p className="text-lg font-semibold text-gray-800">OB/GYN Clinic</p>
        </div>
      </div>

      {/* Search & Add Medicine */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Add Medicine</label>
        <div className="relative">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <Search size={16} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 outline-none"
            />
          </div>

          {/* Dropdown Results */}
          {searchTerm && filteredMedicines.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredMedicines.map((med, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddMedicine(med)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
                >
                  <p className="font-medium text-gray-800">{med.trade_name}</p>
                  <p className="text-xs text-gray-500">{med.scientific_name} • {med.concentration}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Medications</h2>
        {prescription.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
            No medications added yet
          </div>
        ) : (
          <div className="space-y-3">
            {prescription.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{item.trade_name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(idx)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={item.dosage}
                      onChange={(e) => handleUpdateDosage(idx, e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const updated = [...prescription];
                        updated[idx].quantity = parseInt(e.target.value);
                        setPrescription(updated);
                      }}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-1">Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g., Take twice daily after meals"
                    value={item.instructions || ''}
                    onChange={(e) => handleUpdateInstructions(idx, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Clinical Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any clinical notes or follow-up instructions..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .prescription-page {
            page-break-after: always;
            margin: 0;
            padding: 20mm;
            font-family: 'Arial', sans-serif;
          }
        }
      `}</style>
    </div>
  );
}
