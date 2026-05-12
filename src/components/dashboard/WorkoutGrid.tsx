'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  CalendarIcon, 
  BoltIcon, 
  CheckIcon, 
  XMarkIcon, 
  PencilSquareIcon,
  TrashIcon,
  FolderPlusIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  PencilIcon, 
  TrashIcon as TrashIconSolid, 
  FolderPlusIcon as FolderPlusIconSolid 
} from '@heroicons/react/24/solid';
import styles from '@/app/dashboard.module.css';
import ConfirmModal from './ConfirmModal';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const DAYS_MAP: any = {
  vi: {
    'Monday': 'Thứ Hai',
    'Tuesday': 'Thứ Ba',
    'Wednesday': 'Thứ Tư',
    'Thursday': 'Thứ Năm',
    'Friday': 'Thứ Sáu',
    'Saturday': 'Thứ Bảy',
    'Sunday': 'Chủ Nhật',
    day: 'Ngày'
  },
  en: {
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Sunday': 'Sunday',
    day: 'Day'
  }
};

const UI_STRINGS: any = {
  vi: {
    addEx: 'Thêm bài tập',
    editEx: 'Chỉnh sửa bài tập',
    exName: 'Tên bài tập',
    weight: 'Khối lượng (Kg)',
    sets: 'Số hiệp',
    reps: 'Số lần/hiệp',
    save: 'Lưu thay đổi',
    add: 'Thêm vào lịch tập',
    deletePlan: 'Xóa lịch tập?',
    deleteEx: 'Xóa bài tập?',
    empty: 'Trống',
    loading: 'Đang tải...',
    cleanup: 'Dọn dẹp lịch khác',
    create: 'Tạo lịch mới',
    rename: 'Đổi tên',
    confirmDeletePlan: 'Toàn bộ dữ liệu của lịch tập này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?',
    confirmDeleteEx: 'Bạn có chắc chắn muốn xóa bài tập này khỏi lịch tập?',
    confirmCleanup: (count: number, title: string) => `Tất cả ${count} lịch tập khác sẽ bị xóa. Chỉ giữ lại duy nhất lịch tập "${title}". Bạn có chắc chắn?`,
    limit: 'Bạn phải giữ lại ít nhất một lịch tập mặc định!',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    noPlans: 'Lịch',
    sessionPlaceholder: 'Buổi tập: Ngực, Chân...',
    setsLabel: 'hiệp',
    repsLabel: 'lần',
    processing: 'Đang xử lý...'
  },
  en: {
    addEx: 'Add Exercise',
    editEx: 'Edit Exercise',
    exName: 'Exercise Name',
    weight: 'Weight (Kg)',
    sets: 'Sets',
    reps: 'Reps',
    save: 'Save Changes',
    add: 'Add to Plan',
    deletePlan: 'Delete Plan?',
    deleteEx: 'Delete Exercise?',
    empty: 'Empty',
    loading: 'Loading...',
    cleanup: 'Cleanup Others',
    create: 'New Plan',
    rename: 'Rename',
    confirmDeletePlan: 'All data for this plan will be permanently deleted. Are you sure?',
    confirmDeleteEx: 'Are you sure you want to delete this exercise?',
    confirmCleanup: (count: number, title: string) => `All ${count} other plans will be deleted. Only "${title}" will be kept. Are you sure?`,
    limit: 'You must keep at least one default plan!',
    cancel: 'Cancel',
    confirm: 'Confirm',
    noPlans: 'Plan',
    sessionPlaceholder: 'Session: Chest, Legs...',
    setsLabel: 'sets',
    repsLabel: 'reps',
    processing: 'Processing...'
  }
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutGrid({ settings }: { settings: { language: 'vi' | 'en', dayMode: 'weekday' | 'dayNum' } }) {
  const t = UI_STRINGS[settings.language];
  const daysTrans = DAYS_MAP[settings.language];

  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<{ day: string, index: number, data: any } | null>(null);
  const [newExercise, setNewExercise] = useState({ name: '', weight: '', sets: '', reps: '' });
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workouts');
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          await handleCreatePlan(t.noPlans, true);
        } else {
          setPlans(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (title: string, isInitial = false) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const newPlan = await res.json();
        if (isInitial) {
          setPlans([newPlan]);
        } else {
          setPlans(prev => [newPlan, ...prev]);
        }
        setCurrentPlanIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeletePlan = (id: string) => {
    if (plans.length <= 1) {
      setModalConfig({
        isOpen: true,
        title: t.noPlans,
        message: t.limit,
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
        variant: 'primary'
      });
      return;
    }

    setModalConfig({
      isOpen: true,
      title: t.deletePlan,
      message: t.confirmDeletePlan,
      onConfirm: () => handleDeletePlan(id),
      variant: 'danger'
    });
  };

  const handleDeletePlan = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/workouts?planId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updatedPlans = plans.filter(p => p._id !== id);
        setPlans(updatedPlans);
        setCurrentPlanIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteAllOtherPlans = () => {
    if (plans.length <= 1) return;
    
    setModalConfig({
      isOpen: true,
      title: t.cleanup,
      message: t.confirmCleanup(plans.length - 1, currentPlan?.title),
      onConfirm: handleDeleteAllOthers,
      variant: 'danger'
    });
  };

  const handleDeleteAllOthers = async () => {
    if (!currentPlan) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/workouts?planId=${currentPlan._id}&deleteAllExcept=true`, { method: 'DELETE' });
      if (res.ok) {
        setPlans([currentPlan]);
        setCurrentPlanIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlan = plans[currentPlanIndex] || null;

  const updateSessionName = async (day: string, name: string) => {
    if (!currentPlan) return;
    const workout = currentPlan.days.find((w: any) => w.dayOfWeek === day);
    if (workout?.sessionName === name) return;
    
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: currentPlan._id,
          dayOfWeek: day, 
          sessionName: name,
          exercises: workout?.exercises || [] 
        })
      });
      if (res.ok) {
        const updatedPlan = await res.json();
        setPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExercise = async () => {
    if (!newExercise.name || !currentPlan || !activeDay) return;
    setIsSubmitting(true);

    const workout = currentPlan.days.find((w: any) => w.dayOfWeek === activeDay);
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
          planId: currentPlan._id,
          dayOfWeek: activeDay, 
          exercises: updatedExercises,
          sessionName: workout?.sessionName || ''
        })
      });

      if (res.ok) {
        const updatedPlan = await res.json();
        setPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
        setNewExercise({ name: '', weight: '', sets: '', reps: '' });
        setActiveDay(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise || !currentPlan) return;
    setIsSubmitting(true);
    const { day, index, data } = editingExercise;

    const workout = currentPlan.days.find((w: any) => w.dayOfWeek === day);
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
          planId: currentPlan._id,
          dayOfWeek: day, 
          exercises: updatedExercises,
          sessionName: workout.sessionName
        })
      });

      if (res.ok) {
        const updatedPlan = await res.json();
        setPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
        setEditingExercise(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteExercise = (day: string, index: number) => {
    setModalConfig({
      isOpen: true,
      title: t.deleteEx,
      message: t.confirmDeleteEx,
      onConfirm: () => deleteExercise(day, index),
      variant: 'danger'
    });
  };

  const deleteExercise = async (day: string, index: number) => {
    if (!currentPlan) return;
    setIsSubmitting(true);

    const workout = currentPlan.days.find((w: any) => w.dayOfWeek === day);
    const updatedExercises = workout.exercises.filter((_: any, i: number) => i !== index);

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: currentPlan._id,
          dayOfWeek: day, 
          exercises: updatedExercises,
          sessionName: workout.sessionName
        })
      });

      if (res.ok) {
        const updatedPlan = await res.json();
        setPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRename = async () => {
    if (!newTitle || !currentPlan) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: currentPlan._id, title: newTitle })
      });
      if (res.ok) {
        const updatedPlan = await res.json();
        setPlans(prev => prev.map(p => p._id === updatedPlan._id ? updatedPlan : p));
        setIsRenaming(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDayLabel = (dayName: string, index: number) => {
    if (settings.dayMode === 'dayNum') {
      return `${daysTrans.day} ${index + 1}`;
    }
    return daysTrans[dayName];
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Submitting Overlay */}
      {isSubmitting && <LoadingSpinner fullScreen />}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        variant={modalConfig.variant}
        confirmText={t.confirm}
        cancelText={t.cancel}
      />

      <Modal 
        isOpen={!!activeDay} 
        onClose={() => setActiveDay(null)} 
        title={`${t.addEx} - ${getDayLabel(activeDay || 'Monday', DAYS.indexOf(activeDay || 'Monday'))}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className={styles.labelSmall}>{t.exName}</label>
            <input
              type="text"
              placeholder="VD: Bench Press..."
              className="input-field"
              value={newExercise.name}
              onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className={styles.labelSmall}>Kg</label>
              <input type="number" placeholder="0" className="input-field" value={newExercise.weight} onChange={e => setNewExercise({ ...newExercise, weight: e.target.value })} />
            </div>
            <div>
              <label className={styles.labelSmall}>H</label>
              <input type="number" placeholder="0" className="input-field" value={newExercise.sets} onChange={e => setNewExercise({ ...newExercise, sets: e.target.value })} />
            </div>
            <div>
              <label className={styles.labelSmall}>L</label>
              <input type="number" placeholder="0" className="input-field" value={newExercise.reps} onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })} />
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
            onClick={handleAddExercise}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ArrowPathIcon className="w-5 h-5 animate-spin" style={{ width: '1.25rem', height: '1.25rem' }} /> : null}
            {isSubmitting ? t.processing : t.add}
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={!!editingExercise} 
        onClose={() => setEditingExercise(null)} 
        title={t.editEx}
      >
        {editingExercise && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className={styles.labelSmall}>{t.exName}</label>
              <input
                type="text"
                className="input-field"
                value={editingExercise.data.name}
                onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, name: e.target.value } })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className={styles.labelSmall}>Kg</label>
                <input type="number" className="input-field" value={editingExercise.data.weight} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, weight: e.target.value } })} />
              </div>
              <div>
                <label className={styles.labelSmall}>H</label>
                <input type="number" className="input-field" value={editingExercise.data.sets} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, sets: e.target.value } })} />
              </div>
              <div>
                <label className={styles.labelSmall}>L</label>
                <input type="number" className="input-field" value={editingExercise.data.reps} onChange={e => setEditingExercise({ ...editingExercise, data: { ...editingExercise.data, reps: e.target.value } })} />
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} 
              onClick={handleUpdateExercise}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ArrowPathIcon className="w-5 h-5 animate-spin" style={{ width: '1.25rem', height: '1.25rem' }} /> : null}
              {isSubmitting ? t.processing : t.save}
            </button>
          </div>
        )}
      </Modal>

      <div className="glass" style={{ padding: '0.75rem', borderRadius: '16px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {isRenaming ? (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <input 
                  className="input-field" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  autoFocus
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
                />
                <button className="btn btn-primary" style={{ padding: '0.4rem' }} onClick={handleRename} disabled={isSubmitting}>
                  {isSubmitting ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckIcon style={{ width: '1rem', height: '1rem' }} />}
                </button>
                <button className="btn" style={{ padding: '0.4rem' }} onClick={() => setIsRenaming(false)} disabled={isSubmitting}><XMarkIcon style={{ width: '1rem', height: '1rem' }} /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <select 
                    className={styles.sessionInput} 
                    value={currentPlanIndex} 
                    onChange={(e) => setCurrentPlanIndex(parseInt(e.target.value))}
                    disabled={isSubmitting}
                    style={{ 
                      fontSize: '1rem', 
                      width: '100%', 
                      paddingRight: '1.5rem',
                      color: 'var(--primary)',
                      borderBottom: '2px solid rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    {plans.map((plan, idx) => (
                      <option key={plan._id} value={idx}>{plan.title}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className={styles.btnIcon} 
                  onClick={() => { setIsRenaming(true); setNewTitle(currentPlan?.title || ''); }}
                  style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', borderRadius: '8px', padding: '0.4rem' }}
                  title={t.rename}
                  disabled={isSubmitting}
                >
                  <PencilSquareIcon style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              className="btn" 
              onClick={confirmDeleteAllOtherPlans}
              disabled={plans.length <= 1 || isSubmitting}
              style={{ 
                background: 'rgba(139, 92, 246, 0.1)', 
                color: '#8b5cf6', 
                padding: '0.5rem',
                opacity: plans.length <= 1 || isSubmitting ? 0.3 : 1
              }}
              title={t.cleanup}
            >
              <SparklesIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => handleCreatePlan(`${t.noPlans} ${plans.length + 1}`)} 
              title={t.create}
              style={{ padding: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <FolderPlusIcon style={{ width: '1.25rem', height: '1.25rem' }} />}
            </button>
            <button 
              className="btn" 
              onClick={() => confirmDeletePlan(currentPlan?._id)} 
              disabled={plans.length <= 1 || isSubmitting}
              style={{ 
                color: plans.length <= 1 || isSubmitting ? '#cbd5e1' : '#ef4444', 
                padding: '0.5rem',
                opacity: plans.length <= 1 || isSubmitting ? 0.5 : 1
              }} 
              title={t.deletePlan}
            >
              <TrashIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.weekGrid}>
        {DAYS.map((day, idx) => {
          const workout = currentPlan?.days?.find((w: any) => w.dayOfWeek === day);

          return (
            <div key={day} className={`${styles.dayCard} animate-slide-up`}>
              <div className={styles.dayHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className={styles.dayTitle} style={{ fontSize: '1.1rem' }}>{getDayLabel(day, idx)}</h3>
                  <CalendarIcon style={{ width: '1.1rem', height: '1.1rem', color: 'var(--text-muted)' }} />
                </div>
                <input
                  type="text"
                  className={styles.sessionInput}
                  placeholder={t.sessionPlaceholder}
                  defaultValue={workout?.sessionName || ''}
                  onBlur={(e) => updateSessionName(day, e.target.value)}
                  disabled={isSubmitting}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              
              <ul className={styles.exerciseList}>
                {workout?.exercises?.length > 0 ? (
                  workout.exercises.map((ex: any, exIdx: number) => (
                    <li key={exIdx} className={styles.exerciseItem} style={{ padding: '0.6rem 0.75rem' }}>
                      <div className={styles.exerciseInfo}>
                        <h4 title={ex.name} style={{ fontSize: '0.9rem' }}>{ex.name}</h4>
                        <div className={styles.exerciseStats} style={{ fontSize: '0.7rem' }}>
                          <span className={styles.statTag}>{ex.sets} {t.setsLabel}</span>
                          <span className={styles.statTag}>{ex.reps} {t.repsLabel}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={styles.weightDisplay}>
                          <span className={styles.weightValue} style={{ fontSize: '1rem' }}>{ex.weight}</span>
                          <span className={styles.weightUnit}>kg</span>
                        </div>
                        <div className={styles.actions}>
                          <button className={styles.actionBtnEdit} style={{ width: '24px', height: '24px' }} onClick={() => setEditingExercise({ day, index: exIdx, data: { ...ex } })} disabled={isSubmitting}>
                            <PencilIcon style={{ width: '0.85rem', height: '0.85rem' }} />
                          </button>
                          <button className={styles.actionBtnDelete} style={{ width: '24px', height: '24px' }} onClick={() => confirmDeleteExercise(day, exIdx)} disabled={isSubmitting}>
                            <TrashIconSolid style={{ width: '0.8rem', height: '0.8rem' }} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem 0', opacity: 0.3 }}>
                    <BoltIcon style={{ width: '1.5rem', height: '1.5rem', margin: '0 auto' }} />
                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{t.empty}</p>
                  </div>
                )}
              </ul>

              <button className={styles.addBtn} style={{ padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => setActiveDay(day)} disabled={isSubmitting}>
                <PlusIcon style={{ width: '1rem', height: '1rem' }} />
                {t.addEx}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
