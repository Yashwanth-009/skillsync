import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, Check, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { AddClassModal } from './AddClassModal';
import { useTimetableStore } from '../../store/useTimetableStore';

export const TimetableGrid = () => {
  const classes = useTimetableStore((state) => state.classes);
  const hasUnsavedChanges = useTimetableStore((state) => state.hasUnsavedChanges);
  const saveTimetableChanges = useTimetableStore((state) => state.saveTimetableChanges);

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
  ];

  const [selectedCell, setSelectedCell] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Calculate Monday of the selected week
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const monday = getMonday(selectedDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const todayStr = new Date().toISOString().split('T')[0];

  const weekDays = daysOfWeek.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      name: dayName,
      dateNum: d.getDate(),
      month: monthNames[d.getMonth()],
      dateStr,
      isToday: dateStr === todayStr,
      fullDate: d
    };
  });

  const isCurrentWeek = weekDays.some((d) => d.isToday);

  // Formatted range string (e.g., Aug 31 – Sep 6, 2026)
  const formattedWeekRange = monday.getMonth() === sunday.getMonth()
    ? `${monthNames[monday.getMonth()]} ${monday.getDate()} - ${sunday.getDate()}, ${sunday.getFullYear()}`
    : `${monthNames[monday.getMonth()]} ${monday.getDate()} - ${monthNames[sunday.getMonth()]} ${sunday.getDate()}, ${sunday.getFullYear()}`;

  const prevWeek = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev);
  };

  const nextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDatePick = (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    }
  };

  const handleCellClick = (day, timeSlot) => {
    const existing = classes.find((c) => c.day === day && c.timeSlot === timeSlot);
    setSelectedCell(existing || { day, timeSlot });
    setModalOpen(true);
  };

  const handleSave = () => {
    saveTimetableChanges();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Live Interactive Week Navigator */}
      <div className="bg-surface dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-card flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={prevWeek}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-center">
            <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
            <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              {formattedWeekRange}
            </span>
            {isCurrentWeek && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                This Week
              </span>
            )}
          </div>

          <button
            onClick={nextWeek}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {!isCurrentWeek && (
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-xl border border-primary/30 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Current Week</span>
            </button>
          )}

          <label className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-medium rounded-xl cursor-pointer transition-colors">
            <span className="text-slate-500 dark:text-slate-400">Select Date:</span>
            <input
              type="date"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
              onChange={handleDatePick}
              className="bg-transparent text-[11px] text-slate-900 dark:text-white font-semibold outline-none cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Grid Canvas with Sticky Header & Sticky Time Column for Seamless Scrolling */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="max-h-[58vh] sm:max-h-[66vh] overflow-auto relative overscroll-contain">
          <div className="min-w-[680px]">
            {/* Sticky Day Column Headers */}
            <div className="grid grid-cols-8 sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-center font-heading font-bold text-xs shadow-xs">
              {/* Sticky Top-Left Corner Header */}
              <div className="sticky left-0 top-0 z-30 bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 p-2 flex items-center justify-center border-r border-slate-200 dark:border-slate-700">
                Time
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.name}
                  className={`py-2 px-1 flex flex-col items-center justify-center text-center transition-colors border-r border-slate-100 dark:border-slate-800 ${
                    day.isToday
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide">{day.name}</span>
                  <span
                    className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-semibold ${
                      day.isToday
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {day.dateNum} {day.month}
                  </span>
                </div>
              ))}
            </div>

            {/* Time Rows & Cells */}
            {timeSlots.map((slot) => (
              <div key={slot} className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800/60 min-h-[52px]">
                {/* Sticky Left Time Label Column */}
                <div className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900 text-[10px] font-semibold text-slate-500 dark:text-slate-400 p-1.5 flex items-center justify-center border-r border-slate-200 dark:border-slate-800">
                  {slot}
                </div>

                {/* Day Grid Cells */}
                {weekDays.map((day) => {
                  const entry = classes.find((c) => c.day === day.name && c.timeSlot === slot);
                  return (
                    <div
                      key={`${day.name}-${slot}`}
                      onClick={() => handleCellClick(day.name, slot)}
                      className={`p-1 border-r border-slate-100 dark:border-slate-800/40 cursor-pointer hover:bg-primary/5 transition-colors relative ${
                        day.isToday ? 'bg-primary/[0.03] dark:bg-primary/[0.06]' : ''
                      }`}
                    >
                      {entry ? (
                        <div
                          className="h-full w-full rounded-xl p-1.5 text-white flex flex-col justify-between shadow-xs text-[10px] leading-tight font-medium"
                          style={{ backgroundColor: entry.color }}
                        >
                          <span className="font-bold truncate">{entry.subject}</span>
                          <div className="flex justify-between items-center text-[9px] opacity-90 mt-1">
                            <span className="truncate">{entry.room}</span>
                            <span className="px-1 bg-white/20 rounded font-bold">{entry.professor?.split(' ')[1] || 'Prof'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full rounded-lg border border-dashed border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-[10px] text-slate-300 dark:text-slate-600 opacity-0 hover:opacity-100 transition-opacity">
                          + Add
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-20 z-20 pt-2 bg-gradient-to-t from-background dark:from-slate-900 to-transparent">
        <button
          onClick={handleSave}
          className={`w-full py-3 text-white font-heading font-semibold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-primary hover:bg-primary-light shadow-glow'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Timetable Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{hasUnsavedChanges ? 'Save Timetable Changes *' : 'Timetable Saved'}</span>
            </>
          )}
        </button>
      </div>

      <AddClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedCell}
      />
    </div>
  );
};
