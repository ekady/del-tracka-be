import { TaskStatus } from 'src/common/enums';

export const STATS_INITIAL_RESPONSE = {
  [TaskStatus.Open]: 0,
  [TaskStatus.InProgress]: 0,
  [TaskStatus.ReadyForTest]: 0,
  [TaskStatus.Review]: 0,
  [TaskStatus.Failed]: 0,
  [TaskStatus.Closed]: 0,
  [TaskStatus.Hold]: 0,
};
