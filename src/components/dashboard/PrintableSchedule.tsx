'use client';

import React from 'react';

interface PrintableScheduleProps {
  plan: any;
  settings: any;
  daysTrans: any;
  uiStrings: any;
  days: string[];
}

const PrintableSchedule = React.forwardRef<HTMLDivElement, PrintableScheduleProps>(({ plan, settings, daysTrans, uiStrings, days }, ref) => {
  if (!plan) return null;

  return (
    <div 
      ref={ref} 
      style={{ 
        position: 'fixed', 
        top: '-10000px', 
        left: '-10000px', 
        background: 'white', 
        padding: '40px', 
        width: '1800px', 
        color: '#1e293b',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ marginBottom: '30px', borderBottom: '6px solid #2563eb', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#2563eb', margin: 0, letterSpacing: '-2px' }}>TanGYM</h1>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '5px', color: '#64748b' }}>{plan.title}</h2>
        </div>
        <div style={{ textAlign: 'right', fontSize: '20px', fontWeight: 600, color: '#94a3b8' }}>
          {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '20px' }}>
        {days.map((day, idx) => {
          const workout = plan.days?.find((w: any) => w.dayOfWeek === day);
          const dayLabel = settings.dayMode === 'dayNum' ? `${daysTrans.day} ${idx + 1}` : daysTrans[day];

          return (
            <div key={day} style={{ border: '2px solid #e2e8f0', borderRadius: '24px', padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '15px', color: '#0f172a', borderBottom: '3px solid #3b82f6', paddingBottom: '8px' }}>{dayLabel}</h3>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb', marginBottom: '15px', minHeight: '1.5em' }}>{workout?.sessionName || '---'}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', flex: 1 }}>
                {workout?.exercises?.map((ex: any, i: number) => (
                  <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid #cbd5e1' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{ex.name}</div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '5px', display: 'flex', gap: '6px' }}>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>{ex.sets} set</span>
                      <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>{ex.reps} rep</span>
                      <span style={{ fontWeight: 800, color: '#2563eb', marginLeft: 'auto' }}>{ex.weight}kg</span>
                    </div>
                  </li>
                ))}
              </ul>

              {workout?.notes && (
                <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#475569', background: '#fffbeb', padding: '12px', borderRadius: '12px', border: '1px solid #fef3c7', marginTop: '10px' }}>
                  {workout.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {plan.generalNotes && (
        <div style={{ marginTop: '60px', padding: '30px', background: '#f1f5f9', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{uiStrings.generalNotes}</h4>
          <p style={{ margin: 0, fontSize: '18px', whiteSpace: 'pre-wrap', color: '#334155', lineHeight: '1.6' }}>{plan.generalNotes}</p>
        </div>
      )}

      <div style={{ marginTop: '50px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        Thiết kế bởi TanGYM - Website quản lý lịch tập gym chuyên nghiệp © {new Date().getFullYear()}
      </div>
    </div>
  );
});

PrintableSchedule.displayName = 'PrintableSchedule';

export default PrintableSchedule;
