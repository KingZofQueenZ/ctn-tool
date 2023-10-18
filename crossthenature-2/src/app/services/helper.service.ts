import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private snackBar: MatSnackBar) {}

  successSnackbar(text: string) {
    this.snackBar.open(text, '', {
      panelClass: ['green-snackbar'],
    });
  }

  errorSnackbar(text: string) {
    this.snackBar.open(text, '', {
      panelClass: ['red-snackbar'],
    });
  }

  combineTrialParticipants(event: Event) {
    event.trial_workouts.forEach((trialParticipant: any) => {
      event.participant_ids.push({
        _id: trialParticipant._id,
        firstname: trialParticipant.firstname,
        lastname: trialParticipant.lastname,
        phone: trialParticipant.phone,
        trial: true,
      });
    });
  }

  removeParticipantFromArray(event: Event, participanId: string) {
    event.participant_ids.splice(
      event.participant_ids.findIndex((x) => x._id === participanId),
      1,
    );
  }
}
