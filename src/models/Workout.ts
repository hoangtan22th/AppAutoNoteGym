import mongoose, { Schema, model, models } from 'mongoose';

const ExerciseSchema = new Schema({
  name: { type: String, required: true },
  weight: { type: Number, default: 0 }, // in kg
  sets: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
});

const WorkoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  sessionName: {
    type: String,
    default: '',
  },
  exercises: [ExerciseSchema],
}, { timestamps: true });

const Workout = models.Workout || model('Workout', WorkoutSchema);

export default Workout;
