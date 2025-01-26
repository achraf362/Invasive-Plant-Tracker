# README: Setting Up and Running Your Project

## Prerequisites

### 1. Install Docker on Windows
To install Docker on Windows, follow these steps:

1. **Download Docker Desktop:**
   - Visit the [Docker Desktop for Windows download page](https://www.docker.com/products/docker-desktop).
   - Click on "Download for Windows" to download the installer.

2. **Install Docker Desktop:**
   - Run the downloaded installer.
   - Follow the installation instructions.
   - During installation, ensure that the option "Use WSL 2 instead of Hyper-V" is selected.

3. **Start Docker Desktop:**
   - After installation, start Docker Desktop from the Start menu.
   - Follow the onboarding tutorial if prompted.

4. **Verify Installation:**
   - Open a Command Prompt or PowerShell window.
   - Run the command: `docker --version`.
   - You should see the Docker version number displayed.

### 2. Install Node.js
To install Node.js, follow these steps:

1. **Download Node.js:**
   - Visit the [Node.js download page](https://nodejs.org/).
   - Click on "LTS" to download the long-term support version.

2. **Install Node.js:**
   - Run the downloaded installer.
   - Follow the installation instructions, including adding Node.js to your PATH.

3. **Verify Installation:**
   - Open a Command Prompt or PowerShell window.
   - Run the command: `node --version`.
   - You should see the Node.js version number displayed.
   - Run the command: `npm --version`.
   - You should see the npm version number displayed.

---

## Running the Project

### 1. Backend and Database Execution with Docker Compose

1. **Navigate to the Project Directory:**
   - Open a Command Prompt or PowerShell window.
   - Navigate to the directory containing your `docker-compose.yml` file.

2. **Build and Run Docker Containers:**
   - Run the command: `docker-compose up --build`.
   - This will build the Docker images and start the containers for your backend and database services.

3. **Verify Backend and Database:**
   - Once the services are running, you can verify their status by visiting the respective endpoints or using tools like Postman.

### 2. Frontend Execution with npm

1. **Navigate to the Frontend Directory:**
   - Open a Command Prompt or PowerShell window.
   - Navigate to the directory containing your frontend project.

2. **Install Dependencies:**
   - Run the command: `npm install` to install all necessary dependencies.

3. **Start the Frontend Development Server:**
   - Run the command: `npm run dev`.
   - This will start the frontend development server.

4. **Access the Frontend:**
   - Open a web browser and go to the URL displayed in the console, usually `http://localhost:3000` or similar.

---

## Notes

- Ensure that Docker Desktop is running before you execute any Docker commands.
- If you encounter any errors during the installation or execution steps, consult the official documentation for [Docker](https://docs.docker.com/) or [Node.js](https://nodejs.org/) for troubleshooting tips.
- You can stop the Docker containers by pressing `Ctrl+C` in the terminal where `docker-compose up` is running, or by running `docker-compose down` in a new terminal window.

