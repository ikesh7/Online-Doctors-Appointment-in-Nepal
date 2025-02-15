"use client";

import { useState } from "react";

interface DiagnosisFormProps {
  onSave: (diagnosis: string, notes: string) => void;
  onCancel: () => void;
}

export const DiagnosisForm = ({ onSave, onCancel }: DiagnosisFormProps) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!diagnosis.trim()) {
      alert("Diagnosis cannot be empty!");
      return;
    }
    onSave(diagnosis, notes);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Add Diagnosis</h3>

      {/* Diagnosis Input */}
      <label className="block text-sm font-medium">Diagnosis</label>
      <textarea
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="Enter diagnosis details..."
      />

      {/* Notes Input */}
      <label className="block text-sm font-medium">Notes (Optional)</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="Additional notes..."
      />

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Diagnosis
        </button>
      </div>
    </div>
  );
};
