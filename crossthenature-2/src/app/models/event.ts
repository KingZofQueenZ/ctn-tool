import { User } from './user';

export class Event {
  _id: string = '';
  name: string = '';
  description: string = '';
  max_participants: Number = 0;
  date: Date = new Date();
  time_to: Date = new Date();
  sign_in: Date = new Date();
  sign_out: Date = new Date();
  participant_ids: User[] = [];
  allow_trials: Boolean = false;
  trial_workouts: any;
}
