import mongoose, { Schema, model, models } from 'mongoose';

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  weight: { type: Number, default: 0 },
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
});

const DayPlanSchema = new Schema({
  dayOfWeek: { type: String, required: true },
  sessionName: { type: String, default: '' },
  notes: { type: String, default: '' },
  exercises: [ExerciseSchema],
});

const WorkoutPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Lịch tập mặc định',
    required: true,
  },
  generalNotes: { type: String, default: '' },
  days: [DayPlanSchema],
}, { timestamps: true });

const WorkoutPlan = models.WorkoutPlan || model('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
