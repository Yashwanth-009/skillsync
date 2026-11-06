import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { sanitizeInput } from '../../lib/security';

export const AttendanceRequestModal = ({ isOpen, onClose }) => {
  const attendance = useDashboardStore((state) => state.attendance || 100);
  const attendanceOverview = {
    subjectWise: [
      { code: 'CS301', subject: 'Data Structures', percentage: attendance },
      { code: 'CS302', subject: 'DBMS', percentage: Math.min(100, attendance + 2) },
      { code: 'CS303', subject: 'Operating Systems', percentage: Math.max(75, attendance - 3) }
    ]
  };
  const submitAttendanceRequest = (req) => {
    useDashboardStore.getState().addReminder({
      title: `Attendance Request: ${req.subject} (${req.requestType})`,
      dueDate: req.date,
      priority: 'High',
      category: 'Attendance'
    });
  };

  const [subject, setSubject] = useState(attendanceOverview.subjectWise[0]?.subject || '');
  const [requestType, setRequestType] = useState('Missing attendance');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [evidenceDoc, setEvidenceDoc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitAttendanceRequest({
      subject,
      requestType,
      date,
      reason: sanitizeInput(reason),
      evidenceDoc: sanitizeInput(evidenceDoc) || 'Signed Attendance Slip / Note.pdf'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              Submit Attendance Request
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Flow: Student → Attendance Request → Admin Reviews → Approve/Reject
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Select Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {attendanceOverview.subjectWise.map((s) => (
                <option key={s.code} value={s.subject}>
                  {s.subject} ({s.percentage}%)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Request Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Missing attendance">Missing attendance</option>
                <option value="Incorrect attendance">Incorrect attendance</option>
                <option value="Wrong date">Wrong date</option>
                <option value="Other issue">Other issue</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Class Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Reason / Explanation for Admin
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Attended 2nd hour lab session, teacher signed physical register..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Attach Proof / Slip (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. LabSlip_Aug18.pdf"
                value={evidenceDoc}
                onChange={(e) => setEvidenceDoc(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Admin</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
