export const ActivityProjection: Record<string, number> = {
  _id: 0,
  createdBy: 1,
  project: 1,
  'stageBefore._id': 1,
  'stageBefore.name': 1,
  'stageBefore.description': 1,
  'stageBefore.shortId': 1,
  'stageAfter._id': 1,
  'stageAfter.name': 1,
  'stageAfter.description': 1,
  'stageAfter.shortId': 1,
  'taskBefore._id': 1,
  'taskBefore.title': 1,
  'taskBefore.feature': 1,
  'taskBefore.priority': 1,
  'taskBefore.status': 1,
  'taskBefore.shortId': 1,
  'taskAfter._id': 1,
  'taskAfter.title': 1,
  'taskAfter.feature': 1,
  'taskAfter.priority': 1,
  'taskAfter.status': 1,
  'taskAfter.shortId': 1,
  type: 1,
  createdAt: 1,
  comment: 1,
};
