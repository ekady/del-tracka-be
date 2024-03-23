export enum ETaskStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  ReadyForTest = 'READY_FOR_TEST',
  Review = 'REVIEW',
  Failed = 'FAILED',
  Closed = 'CLOSED',
  Hold = 'HOLD',
}

export type TStatusType =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'READY_FOR_TEST'
  | 'CLOSED'
  | 'FAILED'
  | 'HOLD';

export type TStatusIndexable = {
  [key in TStatusType]: { value: string; name: string };
};

export const STATUS: TStatusIndexable = {
  OPEN: { value: 'OPEN', name: 'Open' },
  IN_PROGRESS: { value: 'IN_PROGRESS', name: 'In Progress' },
  REVIEW: { value: 'REVIEW', name: 'Review' },
  CLOSED: { value: 'CLOSED', name: 'Closed' },
  READY_FOR_TEST: { value: 'READY_FOR_TEST', name: 'Ready' },
  FAILED: { value: 'FAILED', name: 'Failed' },
  HOLD: { value: 'HOLD', name: 'Hold' },
};
