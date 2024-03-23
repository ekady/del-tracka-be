import { ETaskStatus } from 'src/shared/enums';

export const STATS_INITIAL_RESPONSE = {
  [ETaskStatus.Open]: 0,
  [ETaskStatus.InProgress]: 0,
  [ETaskStatus.ReadyForTest]: 0,
  [ETaskStatus.Review]: 0,
  [ETaskStatus.Failed]: 0,
  [ETaskStatus.Closed]: 0,
  [ETaskStatus.Hold]: 0,
};
