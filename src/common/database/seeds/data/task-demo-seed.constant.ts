export const TaskDemoSeed = [
  {
    _id: {
      $oid: '64fc5bb84f9990845265b55f',
    },
    createdAt: {
      $date: '2023-09-09T11:49:12.579Z',
    },
    updatedAt: {
      $date: '2023-09-10T11:55:57.388Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    updatedBy: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stage: {
      $oid: '64fc5674396b15feb8d2ef25',
    },
    feature: 'Authentication',
    dueDate: {
      $date: '2023-09-11T17:00:00.000Z',
    },
    title: 'Sign Up Failed',
    detail:
      'Got following error: password confirm is not the same\r\nCondition:\r\n- password: 1234\r\n- passwordConfirm: 1234',
    priority: 'CRITICAL',
    assignee: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    reporter: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    status: 'READY_FOR_TEST',
    images: [],
    shortId: 'shjHuPsavL',
  },
];
