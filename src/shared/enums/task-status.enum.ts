export enum TaskStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  ReadyForTest = 'READY_FOR_TEST',
  Review = 'REVIEW',
  Failed = 'FAILED',
  Closed = 'CLOSED',
  Hold = 'HOLD',
}

export type StatusType =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'READY_FOR_TEST'
  | 'CLOSED'
  | 'FAILED'
  | 'HOLD';

export type StatusIndexable = {
  [key in StatusType]: { value: string; name: string };
};

export const STATUS: StatusIndexable = {
  OPEN: { value: 'OPEN', name: 'Open' },
  IN_PROGRESS: { value: 'IN_PROGRESS', name: 'In Progress' },
  REVIEW: { value: 'REVIEW', name: 'Review' },
  CLOSED: { value: 'CLOSED', name: 'Closed' },
  READY_FOR_TEST: { value: 'READY_FOR_TEST', name: 'Ready' },
  FAILED: { value: 'FAILED', name: 'Failed' },
  HOLD: { value: 'HOLD', name: 'Hold' },
};
