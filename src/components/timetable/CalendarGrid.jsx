import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { DateNoteModal } from './DateNoteModal';
import { useTimetableStore } from '../../store/useTimetableStore';

export const CalendarGrid = () => {
  const calendarNotes = useTimetableStore((state) => state.calendarNotes);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToThisMonth = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (dayNum) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setModalOpen(true);
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Month Navigator Header */}
      <div className="flex items-center justify-between bg-surface dark:bg-slate-800 p-3.5 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-card">
        <button
          onClick={prevMonth}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Previous Month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
          {!isCurrentMonth && (
            <button
              onClick={goToThisMonth}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Next Month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Monthly Grid */}
      <div className="bg-surface dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-card">
        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center font-heading font-semibold text-xs text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-700">
          {daysOfWeek.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {/* Blank cells for offset */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`blank-${i}`} className="h-10 sm:h-11" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const note = calendarNotes.find((n) => n.date === dateStr);

            return (
              <button
                key={dayNum}
                onClick={() => handleDateClick(dayNum)}
                className={`h-10 sm:h-11 rounded-2xl flex items-center justify-center p-0 transition-all relative cursor-pointer ${
                  isToday
                    ? 'bg-primary text-white font-bold shadow-md ring-2 ring-primary/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-900 dark:text-slate-200 font-medium'
                }`}
              >
                <span className="text-xs font-semibold leading-none flex items-center justify-center select-none">
                  {dayNum}
                </span>

                {/* Date Note Colored Indicator Dot perfectly aligned at bottom */}
                {note && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 ${
                      isToday ? 'bg-amber-300' : 'bg-primary'
                    }`}
                    title={note.title}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Summary Below Calendar */}
      <div className="space-y-2">
        <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white px-1">
          Calendar Notes ({calendarNotes.length})
        </h4>

        {calendarNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedDate(note.date);
              setModalOpen(true);
            }}
            className="bg-surface dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card flex items-start space-x-3 cursor-pointer hover:border-primary transition-colors"
          >
            <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <h5 className="font-semibold text-xs text-slate-900 dark:text-white">{note.title}</h5>
                <span className="text-[10px] text-slate-400 font-mono">{note.date}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{note.content}</p>
            </div>
          </div>
        ))}
      </div>

      <DateNoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        existingNote={calendarNotes.find((n) => n.date === selectedDate)}
      />
    </div>
  );
};
