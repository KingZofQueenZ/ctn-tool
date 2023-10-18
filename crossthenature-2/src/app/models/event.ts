import { User } from './user';

export interface Event {
  _id: string;
  name: string;
  description?: string;
  max_participants?: number;
  date: Date;
  time_to: Date;
  sign_in?: Date;
  sign_out?: Date;
  participant_ids: User[];
  allow_trials: Boolean;
  trial_workouts: any;
}
