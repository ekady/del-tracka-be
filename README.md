## Tracka - Bug Tracking Application

![Tracka Logo](https://res.cloudinary.com/dwixtayvd/image/upload/v1713677969/tracka-layout_dcbjaj.png)

Tracka is a web application designed to streamline your software development process by efficiently managing and tracking bugs and issues within your projects. 

### Feature Set

Tracka offers a comprehensive suite of features to empower a smooth bug tracking workflow:

| Feature                 | Description                                                                                                  |
|-------------------------|--------------------------------------------------------------------------------------------------------------------|
| **Dashboard**            | Provides a high-level view of all projects, user-assigned tasks, and overall user activity within the system.                     |
| **Project Management**   | Manage and organize your projects, including sprints and detailed lists of associated issues and tasks.                          |
| **Issue/Task Tracking**  | Create, assign, and track issues and tasks within specific projects, ensuring clear accountability and streamlined workflows.      |
| **My Issues**             | View a dedicated section showcasing all issues and tasks currently assigned to you, facilitating focused bug resolution.        |
| **Log Activities**        | Track and search for project activities within a designated time range, enabling comprehensive project audit trails.           |


### Getting Started

**Prerequisites**

* **Node.js (version 18 or higher):** [https://nodejs.org/en](https://nodejs.org/en)
* **pnpm package manager:** [https://pnpm.io/installation](https://pnpm.io/installation)
* **Git version control system:** [https://git-scm.com/downloads](https://git-scm.com/downloads)

**1. Clone the Repository:**

```bash
git clone https://github.com/ekady/del-tracka-be.git
```

**2. Install Dependencies:**

```bash
cd del-tracka-be
pnpm install
```

**3. Run Development Server:**

```bash
pnpm start:dev
```

This command will initiate the development server at http://localhost:3333/.

**4. Build for Production:**

* Install build dependencies:

```bash
pnpm install
```

* Build the application:

```bash
pnpm build
```

* Start the production server:

```bash
pnpm start:prod
```

### Contributing

We highly encourage contributions from the community! If you're passionate about fixing bugs or enhancing existing features, here's how you can get involved:

1. **Fork the Repository:** Create your personal copy of the Tracka repository on GitHub.
2. **Create a Branch:**  Switch to a new dedicated branch for your changes (e.g., `git checkout -b improve-feature`).
3. **Implement Changes:** Edit the relevant files to incorporate your contribution.
4. **Add and Commit:** Stage your changes using `git add` and commit them with a clear and concise message (`git commit -am 'Improve feature'`).
5. **Push to Branch:** Push your committed changes to your forked branch (`git push origin improve-feature`).
6. **Pull Request:** Create a Pull Request from your branch to the `main` branch of the main Tracka repository. This allows us to review your contributions before merging them into the official codebase.

**Merging to Production:**

Following a successful review and approval of your Pull Request on the `main` branch, you can create a separate Pull Request from a new branch (e.g., `improve-feature`) to the `next` branch to deploy the changes to the production application.

### License

This project is distributed under the MIT License.
