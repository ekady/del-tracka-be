export const ActivityDemoSeed = [
  {
    _id: {
      $oid: '64fc5bb84f9990845265b561',
    },
    createdAt: {
      $date: '2023-09-09T11:49:12.642Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:49:12.642Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    type: 'CREATE_TASK',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stageBefore: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:49:12.634Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    stageAfter: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:49:12.635Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    taskBefore: null,
    taskAfter: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:49:12.639Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    comment: null,
  },
  {
    _id: {
      $oid: '64fc5bf34f9990845265b5c7',
    },
    createdAt: {
      $date: '2023-09-09T11:50:11.582Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:50:11.582Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b18d0350bcfaf12b64c4',
    },
    type: 'CREATE_COMMENT',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stageBefore: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:50:11.581Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    stageAfter: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:50:11.581Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    taskBefore: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:50:11.581Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    taskAfter: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:50:11.581Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    comment: 'Fix this asap before demo',
  },
  {
    _id: {
      $oid: '64fc5cf44f9990845265b6a4',
    },
    createdAt: {
      $date: '2023-09-09T11:54:28.583Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:54:28.583Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    type: 'CREATE_COMMENT',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stageBefore: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:28.581Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    stageAfter: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:28.582Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    taskBefore: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:28.582Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    taskAfter: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:28.582Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    comment: 'Got it',
  },
  {
    _id: {
      $oid: '64fc5cff4f9990845265b703',
    },
    createdAt: {
      $date: '2023-09-09T11:54:39.031Z',
    },
    updatedAt: {
      $date: '2023-09-09T11:54:39.031Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    type: 'UPDATE_TASK_STATUS',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stageBefore: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:39.029Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    stageAfter: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:39.030Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    taskBefore: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:39.030Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
      },
      updatedBy: {
        $oid: '64f7b18d0350bcfaf12b64c4',
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
      status: 'OPEN',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    taskAfter: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:54:39.030Z',
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
      status: 'IN_PROGRESS',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    comment: null,
  },
  {
    _id: {
      $oid: '64fc5d4d4f9990845265b7be',
    },
    createdAt: {
      $date: '2023-09-10T11:55:57.427Z',
    },
    updatedAt: {
      $date: '2023-09-10T11:55:57.427Z',
    },
    deletedAt: null,
    createdBy: {
      $oid: '64f7b1a50350bcfaf12b64c7',
    },
    type: 'UPDATE_TASK_STATUS',
    project: {
      $oid: '64fc5657396b15feb8d2ef06',
    },
    stageBefore: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:55:57.427Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    stageAfter: {
      createdAt: {
        $date: '2023-09-09T11:26:44.539Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:55:57.427Z',
      },
      deletedAt: null,
      createdBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      updatedBy: {
        $oid: '64f7ae680d3d0f4944657a14',
      },
      name: 'Sprint 1',
      description: 'Sprint demonstration',
      project: {
        $oid: '64fc5657396b15feb8d2ef06',
      },
      shortId: 'FcsHix71so',
      _id: {
        $oid: '64fc5674396b15feb8d2ef25',
      },
    },
    taskBefore: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:55:57.427Z',
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
      status: 'IN_PROGRESS',
      images: [],
      shortId: 'shjHuPsavL',
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    taskAfter: {
      createdAt: {
        $date: '2023-09-09T11:49:12.579Z',
      },
      updatedAt: {
        $date: '2023-09-09T11:55:57.427Z',
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
      _id: {
        $oid: '64fc5bb84f9990845265b55f',
      },
    },
    comment: null,
  },
];
