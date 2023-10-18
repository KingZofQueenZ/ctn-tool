import { User } from './user';

export class Event {
  _id: string = '';
  name: string = '';
  description: string = '';
  max_participants: number | undefined;
  date: Date = new Date();
  time_to: Date = new Date();
  sign_in: Date | undefined;
  sign_out: Date | undefined;
  participant_ids: User[] = [];
  allow_trials: Boolean = false;
  trial_workouts: any;
}
