export class Event {
  _id: string;
  name: string;
  description: string;
  max_participants: Number;
  date: Date;
  time_to: Date;
  sign_in: Date;
  sign_out: Date;
  participant_ids: any;
  allow_trials: Boolean;
  trial_workouts: any;
}
