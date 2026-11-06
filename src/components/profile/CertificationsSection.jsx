import React, { useState } from 'react';
import { Award, Plus, Trash2, Calendar } from 'lucide-react';
import { AddCertificateModal } from './AddCertificateModal';
import { useProfileStore } from '../../store/useProfileStore';

export const CertificationsSection = () => {
  const certificates = useProfileStore((state) => state.certificates);
  const deleteCertificate = useProfileStore((state) => state.deleteCertificate);
  const isEditing = useProfileStore((state) => state.isEditing);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-accent" />
          <span>Certifications ({certificates.length})</span>
        </h3>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cert</span>
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="p-4 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <p className="text-xs text-slate-400">No certificates added yet. Add your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-3 relative"
            >
              {cert.imageUrl ? (
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-12 h-12 rounded-xl object-cover border shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{cert.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{cert.issuer}</p>
                <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{cert.date}</span>
                </span>
              </div>

              {isEditing && (
                <button
                  onClick={() => deleteCertificate(cert.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <AddCertificateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
