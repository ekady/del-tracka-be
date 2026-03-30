import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationService } from 'src/modules/notification/services/notification.service';
import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { ProjectMemberService } from 'src/modules/project/services/project-member.service';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ERoleName } from 'src/shared/enums';

describe('ProjectMemberService', () => {
  let service: ProjectMemberService;
  let projectHelperService: ProjectHelperService;
  let userProjectService: UserProjectService;
  let userService: UserService;
  let roleService: RoleService;
  let notificationService: NotificationService;

  const mockProjectHelperService = {
    findProjectByShortId: jest.fn(),
  };

  const mockUserProjectService = {
    addUserProject: jest.fn(),
    updateUserProject: jest.fn(),
    findUsersByProjectId: jest.fn(),
    deleteUserProject: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRoleService = {
    findOneRole: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectMemberService,
        { provide: ProjectHelperService, useValue: mockProjectHelperService },
        { provide: UserProjectService, useValue: mockUserProjectService },
        { provide: UserService, useValue: mockUserService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<ProjectMemberService>(ProjectMemberService);
    projectHelperService =
      module.get<ProjectHelperService>(ProjectHelperService);
    userProjectService = module.get<UserProjectService>(UserProjectService);
    userService = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    it('should add a member to a project', async () => {
      const mockProject = {
        _id: 'project-id',
        name: 'Test Project',
        shortId: 'proj1',
        isDemo: false,
      };
      const mockUser = {
        _id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
        isDemo: false,
      };
      const mockRole = { _id: 'role-id', name: 'DEVELOPER' };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockRoleService.findOneRole.mockResolvedValue(mockRole);
      mockUserProjectService.addUserProject.mockResolvedValue({});
      mockNotificationService.create.mockResolvedValue(true);

      const result = await service.addMember('creator-id', 'proj1', {
        email: 'john@test.com',
        roleName: ERoleName.DEVELOPER,
      });

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserProjectService.addUserProject).toHaveBeenCalled();
    });

    it('should throw BadRequestException when adding non-demo user to demo project', async () => {
      const mockProject = { _id: 'project-id', isDemo: true };
      const mockUser = { _id: 'user-id', isDemo: false };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.addMember('creator-id', 'proj1', {
          email: 'john@test.com',
          roleName: ERoleName.DEVELOPER,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMember', () => {
    it('should update a member role', async () => {
      const mockProject = {
        _id: 'project-id',
        name: 'Test Project',
        shortId: 'proj1',
      };
      const mockUser = { _id: 'user-id', firstName: 'John', lastName: 'Doe' };
      const mockRole = { _id: 'role-id', name: ERoleName.MAINTAINER };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockRoleService.findOneRole.mockResolvedValue(mockRole);
      mockUserProjectService.updateUserProject.mockResolvedValue({});
      mockNotificationService.create.mockResolvedValue(true);

      const result = await service.updateMember('updater-id', 'proj1', {
        userId: 'user-id',
        roleName: ERoleName.MAINTAINER,
      });

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserProjectService.updateUserProject).toHaveBeenCalled();
    });

    it('should throw BadRequestException when adding non-demo user to demo project', async () => {
      const mockProject = { _id: 'project-id', isDemo: true };
      const mockUser = { _id: 'user-id', isDemo: false };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.addMember('creator-id', 'proj1', {
          email: 'john@test.com',
          roleName: ERoleName.DEVELOPER,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateMember', () => {
    it('should update a member role', async () => {
      const mockProject = {
        _id: 'project-id',
        name: 'Test Project',
        shortId: 'proj1',
      };
      const mockUser = { _id: 'user-id', firstName: 'John', lastName: 'Doe' };
      const mockRole = { _id: 'role-id', name: ERoleName.MAINTAINER };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockRoleService.findOneRole.mockResolvedValue(mockRole);
      mockUserProjectService.updateUserProject.mockResolvedValue({});
      mockNotificationService.create.mockResolvedValue(true);

      const result = await service.updateMember('updater-id', 'proj1', {
        userId: 'user-id',
        roleName: ERoleName.MAINTAINER,
      });

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('getMember', () => {
    it('should return all members of a project', async () => {
      const mockProject = { _id: 'project-id' };
      const mockMembers = [
        { _id: 'user-id', firstName: 'John', lastName: 'Doe' },
      ];

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserProjectService.findUsersByProjectId.mockResolvedValue(
        mockMembers,
      );

      const result = await service.getMember('proj1');

      expect(result).toEqual(mockMembers);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a project', async () => {
      const mockUser = { _id: 'user-id' };
      const mockProject = { _id: 'project-id' };

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserProjectService.deleteUserProject.mockResolvedValue({});

      const result = await service.removeMember('proj1', { userId: 'user-id' });

      expect(result).toEqual({ message: 'Success' });
    });
  });
});
