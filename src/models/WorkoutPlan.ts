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
  exercises: [ExerciseSchema],
});

const WorkoutPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // 1-1 Relationship
  },
  days: [DayPlanSchema],
}, { timestamps: true });

const WorkoutPlan = models.WorkoutPlan || model('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
