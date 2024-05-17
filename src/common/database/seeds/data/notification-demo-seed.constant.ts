export const NotificationDemoSeed = [
  {
    _id: {
      $oid: '64fc56a5396b15feb8d2ef93',
    },
    createdAt: {
      $date: '2023-09-09T11:27:33.898Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:27:33.898Z',
    },
    deletedAt: null,
    title: 'Added to Project',
    body: 'Submitter Demo has been added to Demo Project',
    isRead: false,
    user: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    webUrl: '/app/project/kOYgLbtgRT',
    type: 'ADDED_PROJECT',
  },
  {
    _id: {
      $oid: '64fc5bb84f9990845265b568',
    },
    createdAt: {
      $date: '2023-09-09T11:49:12.705Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:49:12.705Z',
    },
    deletedAt: null,
    title: 'Create Task',
    body: 'Submitter Demo has created a new task Sign Up Failed (#shjHuPsavL)',
    isRead: false,
    user: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    task: '64fc5bb84f9990845265b55f',
    webUrl: '/app/project/kOYgLbtgRT/FcsHix71so/shjHuPsavL',
    type: 'CREATE_TASK',
  },
  {
    _id: {
      $oid: '64fc5bf34f9990845265b5ce',
    },
    createdAt: {
      $date: '2023-09-09T11:50:11.596Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:50:11.596Z',
    },
    deletedAt: null,
    title: 'Create Comment',
    body: 'Submitter Demo has commented on task Sign Up Failed (#shjHuPsavL)',
    isRead: false,
    user: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    task: '64fc5bb84f9990845265b55f',
    webUrl: '/app/project/kOYgLbtgRT/FcsHix71so/shjHuPsavL-',
    type: 'CREATE_COMMENT',
  },
  {
    _id: {
      $oid: '64fc5cf44f9990845265b6ab',
    },
    createdAt: {
      $date: '2023-09-09T11:54:28.610Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:54:28.610Z',
    },
    deletedAt: null,
    title: 'Create Comment',
    body: 'Developer Demo has commented on task Sign Up Failed (#shjHuPsavL)',
    isRead: false,
    user: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    task: '64fc5bb84f9990845265b55f',
    webUrl: '/app/project/kOYgLbtgRT/FcsHix71so/shjHuPsavL-',
    type: 'CREATE_COMMENT',
  },
  {
    _id: {
      $oid: '64fc5cff4f9990845265b70a',
    },
    createdAt: {
      $date: '2023-09-09T11:54:39.064Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:54:39.064Z',
    },
    deletedAt: null,
    title: 'Update Task Status',
    body: 'Developer Demo has updated status task Sign Up Failed (#shjHuPsavL) from Open to In Progress',
    isRead: false,
    user: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    task: '64fc5bb84f9990845265b55f',
    webUrl: '/app/project/kOYgLbtgRT/FcsHix71so/shjHuPsavL',
    type: 'UPDATE_TASK_STATUS',
  },
  {
    _id: {
      $oid: '64fc5d4d4f9990845265b7c5',
    },
    createdAt: {
      $date: '2023-09-10T11:55:57.454Z',
    },
    updatedAt: {
      $date: '2023-09-10T11:55:57.454Z',
    },
    deletedAt: null,
    title: 'Update Task Status',
    body: 'Developer Demo has updated status task Sign Up Failed (#shjHuPsavL) from In Progress to Ready',
    isRead: false,
    user: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    task: '64fc5bb84f9990845265b55f',
    webUrl: '/app/project/kOYgLbtgRT/FcsHix71so/shjHuPsavL',
    type: 'UPDATE_TASK_STATUS',
  },
];
