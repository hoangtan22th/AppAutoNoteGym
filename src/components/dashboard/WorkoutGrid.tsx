'use client';

import { useState, useEffect } from 'react';
import { Plus, Dumbbell, Calendar, Trash2, Edit2, Save, X, Weight } from 'lucide-react';
import styles from '@/app/dashboard.module.css';

const DAYS_VN: { [key: string]: string } = {
  'Monday': 'Thứ Hai',
  'Tuesday': 'Thứ Ba',
  'Wednesday': 'Thứ Tư',
  'Thursday': 'Thứ Năm',
  'Friday': 'Thứ Sáu',
  'Saturday': 'Thứ Bảy',
  'Sunday': 'Chủ Nhật'
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutGrid() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<{ day: string, index: number, data: any } | null>(null);
  const [newExercise, setNewExercise] = useState({ name: '', weight: '', sets: '', reps: '' });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('/api/workouts');
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionName = async (day: string, name: string) => {
    const workout = workouts.find(w => w.dayOfWeek === day);
    if (workout?.sessionName === name) return;
    
    try {
      await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dayOfWeek: day, 
          sessionName: name,
          exercises: workout?.exercises || [] 
        })
      });
      setWorkouts(prev => prev.map(w => w.dayOfWeek === day ? { ...w, sessionName: name } : w));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExercise = async (day: string) => {
    if (!newExercise.name) return;

    const workout = workouts.find(w => w.dayOfWeek === day);
    const updatedExercises = [...(workout?.exercises || []), {
      name: newExercise.name,
      weight: parseFloat(newExercise.weight || '0'),
      sets: parseInt(newExercise.sets || '0'),
      reps: parseInt(newExercise.reps || '0')
    }];

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dayOfWeek: day, 
          exercises: updatedExercises,
          sessionName: workout?.sessionName || ''
        })
      });

      if (res.ok) {
        fetchWorkouts();
        setNewExercise({ name: '', weight: '', sets: '', reps: '' });
        setActiveDay(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise) return;
    const { day, index, data } = editingExercise;

    const workout = workouts.find(w => w.dayOfWeek === day);
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = {
      ...data,
      weight: parseFloat(data.weight || '0'),
      sets: parseInt(data.sets || '0'),
      reps: parseInt(data.reps || '0')
    };

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dayOfWeek: day, 
          exercises: updatedExercises,
          sessionName: workout.sessionName
        })
      });

      if (res.ok) {
        fetchWorkouts();
        setEditingExercise(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExercise = async (day: string, index: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return;

    const workout = workouts.find(w => w.dayOfWeek === day);
    const updatedExercises = workout.exercises.filter((_: any, i: number) => i !== index);

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dayOfWeek: day, 
          exercises: updatedExercises,
          sessionName: workout.sessionName
        })
      });

      if (res.ok) {
        fetchWorkouts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Đang tải lịch tập...</div>;

  return (
    <div className={styles.weekGrid}>
      {DAYS.map(day => {
        const workout = workouts.find(w => w.dayOfWeek === day);
        const isAdding = activeDay === day;

        return (
          <div key={day} className={`${styles.dayCard} animate-slide-up`}>
            <div className={styles.dayHeader}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className={styles.dayTitle}>{DAYS_VN[day]}</h3>
                <Calendar size={18} color="var(--text-muted)" />
              </div>
              <input
                type="text"
                className={styles.sessionInput}
                placeholder="Nhập tên buổi tập (VD: Ngực, Tay...)"
                defaultValue={workout?.sessionName || ''}
                onBlur={(e) => updateSessionName(day, e.target.value)}
              />
            </div>
            
            <ul className={styles.exerciseList}>
              {workout?.exercises?.length > 0 ? (
                workout.exercises.map((ex: any, idx: number) => {
                  const isEditing = editingExercise?.day === day && editingExercise?.index === idx;
                  
                  if (isEditing) {
                    return (
                      <li key={idx} className="glass" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '0.75rem', border: '1px solid var(--primary)' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: var(--primary), marginBottom: '0.25rem', display: 'block' }}>Tên bài tập</label>
                        <input
                          type="text"
                          className="input-field"
                          style={{ marginBottom: '0.75rem', padding: '0.6rem' }}
                          placeholder="VD: Đẩy ngực ngang"
                          value={editingExercise.data.name}
                          onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, name: e.target.value } })}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kg</label>
                            <input type="number" className="input-field" style={{ padding: '0.6rem' }} value={editingExercise.data.weight} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, weight: e.target.value } })} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hiệp</label>
                            <input type="number" className="input-field" style={{ padding: '0.6rem' }} value={editingExercise.data.sets} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, sets: e.target.value } })} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lần</label>
                            <input type="number" className="input-field" style={{ padding: '0.6rem' }} value={editingExercise.data.reps} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, reps: e.target.value } })} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdateExercise}>
                            <Save size={16} /> Lưu
                          </button>
                          <button className="btn" onClick={() => setEditingExercise(null)}>
                            Hủy
                          </button>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={idx} className={styles.exerciseItem}>
                      <div className={styles.exerciseInfo}>
                        <h4 title={ex.name}>{ex.name}</h4>
                        <div className={styles.exerciseStats}>
                          <span className={styles.statTag}>{ex.sets} hiệp</span>
                          <span className={styles.statTag}>{ex.reps} lần</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={styles.weightDisplay}>
                          <span className={styles.weightValue}>{ex.weight}</span>
                          <span className={styles.weightUnit}>kg</span>
                        </div>
                        <div className={styles.actions}>
                          <button className={styles.btnIcon} onClick={() => setEditingExercise({ day, index: idx, data: { ...ex } })} title="Sửa bài tập">
                            <Edit2 size={16} />
                          </button>
                          <button className={styles.btnIcon} onClick={() => deleteExercise(day, idx)} style={{ color: 'var(--error)' }} title="Xóa bài tập">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', opacity: 0.35 }}>
                  <Dumbbell size={32} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem' }}>Chưa có lịch tập</p>
                </div>
              )}
            </ul>

            {isAdding ? (
              <div className="glass" style={{ padding: '1rem', borderRadius: '20px', marginBottom: '0.75rem', border: '1px solid var(--primary-glow)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>Thêm bài tập mới</h4>
                <input
                  type="text"
                  placeholder="Tên bài tập (VD: Squat, Bench Press...)"
                  className="input-field"
                  style={{ marginBottom: '0.75rem', padding: '0.75rem' }}
                  value={newExercise.name}
                  onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Khối lượng</label>
                    <input type="number" placeholder="Kg" className="input-field" style={{ padding: '0.6rem' }} value={newExercise.weight} onChange={e => setNewExercise({ ...newExercise, weight: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Số hiệp</label>
                    <input type="number" placeholder="Sets" className="input-field" style={{ padding: '0.6rem' }} value={newExercise.sets} onChange={e => setNewExercise({ ...newExercise, sets: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>Số lần</label>
                    <input type="number" placeholder="Reps" className="input-field" style={{ padding: '0.6rem' }} value={newExercise.reps} onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAddExercise(day)}>
                    Xác nhận
                  </button>
                  <button className="btn" onClick={() => setActiveDay(null)}>
                    Đóng
                  </button>
                </div>
              </div>
            ) : (
              <button className={styles.addBtn} onClick={() => setActiveDay(day)}>
                <Plus size={20} />
                Thêm bài tập
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
