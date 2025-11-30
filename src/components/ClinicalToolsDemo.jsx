import React, { useState } from 'react';
import InfertilityWizardV2 from './InfertilityWizardV2';
import PrescriptionWriter from './PrescriptionWriter';
import { ClipboardList, Settings } from 'lucide-react';

// Mock medicines data - in production this would come from Supabase
const mockMedicines = [
  {
    trade_name: 'Clomid',
    scientific_name: 'Clomiphene Citrate',
    category: 'Ovulation Induction',
    form: 'Tablet',
    concentration: '50mg',
    default_dosage: 'قرص مرتين يومياً من اليوم الثاني للدورة لمدة 5 أيام',
    price: 50
  },
  {
    trade_name: 'Femara',
    scientific_name: 'Letrozole',
    category: 'Ovulation Induction',
    form: 'Tablet',
    concentration: '2.5mg',
    default_dosage: 'قرص مرتين يومياً من اليوم الثالث للدورة لمدة 5 أيام',
    price: 75
  },
  {
    trade_name: 'Cidophage',
    scientific_name: 'Metformin',
    category: 'Ovulation Induction',
    form: 'Tablet',
    concentration: '500mg',
    default_dosage: 'قرص مرتين يومياً',
    price: 40
  },
  {
    trade_name: 'Duphaston',
    scientific_name: 'Dydrogesterone',
    category: 'Luteal Support',
    form: 'Tablet',
    concentration: '10mg',
    default_dosage: 'قرص مرتين يومياً من اليوم الثالث للإباضة',
    price: 60
  },
  {
    trade_name: 'Cyclogest',
    scientific_name: 'Progesterone',
    category: 'Luteal Support',
    form: 'Suppository',
    concentration: '400mg',
    default_dosage: 'تحميلة مرتين يومياً',
    price: 85
  },
  {
    trade_name: 'Prontogest',
    scientific_name: 'Progesterone',
    category: 'Luteal Support',
    form: 'Injection',
    concentration: '100mg/ml',
    default_dosage: 'حقنة عضلية يومياً',
    price: 70
  },
  {
    trade_name: 'Folicap',
    scientific_name: 'Folic Acid + Vitamins',
    category: 'Supplements',
    form: 'Capsule',
    concentration: '400mcg',
    default_dosage: 'كبسولة يومياً',
    price: 25
  },
  {
    trade_name: 'Feroglobin',
    scientific_name: 'Iron + Vitamins',
    category: 'Supplements',
    form: 'Capsule',
    concentration: 'Complex',
    default_dosage: 'كبسولة يومياً',
    price: 35
  },
  {
    trade_name: 'Osteocare',
    scientific_name: 'Calcium + Vitamin D',
    category: 'Supplements',
    form: 'Tablet',
    concentration: 'Complex',
    default_dosage: 'قرص يومياً',
    price: 30
  }
];

export default function ClinicalToolsDemo() {
  const [activeTab, setActiveTab] = useState('wizard');
  const [selectedMedications, setSelectedMedications] = useState([]);

  const handleAddMedication = (medication) => {
    setSelectedMedications([...selectedMedications, medication]);
    // Switch to prescription tab to show added meds
    setActiveTab('prescription');
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Clinical Tools Dashboard</h1>
        <p className="text-blue-100">Infertility Diagnosis & Prescription Writer</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('wizard')}
          className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition ${
            activeTab === 'wizard'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <ClipboardList size={20} />
          Clinical Decision
        </button>
        <button
          onClick={() => setActiveTab('prescription')}
          className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition ${
            activeTab === 'prescription'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Settings size={20} />
          Prescription Writer
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg">
        {activeTab === 'wizard' && (
          <div className="p-6">
            <InfertilityWizardV2
              onMedicationAdd={handleAddMedication}
              lang="en"
            />
          </div>
        )}

        {activeTab === 'prescription' && (
          <div className="p-6">
            <PrescriptionWriter
              medicines={mockMedicines}
              patientName="علياء محمد"
              patientAge={32}
              lang="en"
            />
            
            {/* Show selected medications if any */}
            {selectedMedications.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Medications Added from Clinical Decision Tool
                </h3>
                <div className="space-y-2">
                  {selectedMedications.map((med, idx) => (
                    <div key={idx} className="text-sm text-blue-800">
                      <strong>{med.trade_name}:</strong> {med.dosage}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h2>
        <ol className="space-y-2 text-gray-700">
          <li>
            <strong>1. Clinical Decision Tool:</strong> Answer questions about patient history,
            semen analysis, and hormones. The system will suggest diagnosis and medications.
          </li>
          <li>
            <strong>2. Add Recommendations:</strong> Click "Add to Prescription" button to add
            suggested medications.
          </li>
          <li>
            <strong>3. Prescription Writer:</strong> Search for additional medicines, adjust
            dosages, add notes.
          </li>
          <li>
            <strong>4. Print:</strong> Click the Print button to generate prescription PDF.
          </li>
        </ol>
      </div>
    </div>
  );
}
