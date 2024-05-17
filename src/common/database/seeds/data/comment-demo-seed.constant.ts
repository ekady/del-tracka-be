export const CommentDemoSeed = [
  {
    _id: {
      $oid: '64fc5bf34f9990845265b5c4',
    },
    createdAt: {
      $date: '2023-09-09T11:50:11.566Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:50:11.566Z',
    },
    deletedAt: null,
    user: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    comment: 'Fix this asap before demo',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stage: {
      $oid: '64fc5674396b15feb8d2ef25',
    },
    task: {
      $oid: '64fc5bb84f9990845265b55f',
    },
  },
  {
    _id: {
      $oid: '64fc5cf44f9990845265b6a1',
    },
    createdAt: {
      $date: '2023-09-09T11:54:28.555Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:54:28.555Z',
    },
    deletedAt: null,
    user: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    comment: 'Got it',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stage: {
      $oid: '64fc5674396b15feb8d2ef25',
    },
    task: {
      $oid: '64fc5bb84f9990845265b55f',
    },
  },
];
