import { padStart } from 'lodash';

export class TimeCode {
  private readonly _hours: number;
  private readonly _minutes: number;
  private readonly _seconds: number;
  private readonly _milliseconds: number;

  constructor(seconds: number) {
    this._milliseconds = Math.floor((seconds - Math.floor(seconds)) * 1_000);
    this._seconds = Math.floor(seconds % 60);
    this._minutes = Math.floor((seconds / 60) % 60);
    this._hours = Math.floor(seconds / 3_600);
  }

  get hours() {
    return this._hours;
  }

  get minutes() {
    return this._minutes;
  }

  get seconds() {
    return this._seconds;
  }

  get milliseconds() {
    return this._milliseconds;
  }

  toSeconds() {
    return this._hours * 3_600 + this._minutes * 60 + this.seconds + this._milliseconds / 1_000;
  }

  toString() {
    return `${padStart(this.hours + '', 2, '0')}:${padStart(this._minutes + '', 2, '0')}:${padStart(this._seconds + '', 2, '0')}`;
  }
}
