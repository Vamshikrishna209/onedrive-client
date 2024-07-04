# OneDrive Integration

This project integrates with OneDrive to provide functionalities such as listing files, downloading files, and listing users who have access to specific files. It also supports real-time updates using server-sent events (SSE).

## Features

- **List Files**: List all files in a specified folder.
- **Download File**: Download a specified file.
- **List Users**: List users who have access to a specified file.
- **Real-Time Updates**: Receive real-time updates when changes occur in specified resources.

## Technologies Used

- **Backend**: Nest.js, Axios, Event Emitter, Microsoft Graph API
- **Frontend**: React.js, Material-UI, Axios, React-Toastify

## Prerequisites

- Node.js
- npm or yarn
- A Microsoft Azure account to register your application and obtain API credentials.

## Getting Started

### Testing the features in the deployed Website

1. **Login**: Navigate to `https://onedrive-client.onrender.com/` and click on the login button. You will be redirected to Microsoft's login page. After successful authentication, you will be redirected back to the application.

2. **List Files**: Navigate to the "List Files" tab and click the "List Files" button to fetch and display files from OneDrive.

3. **Download File**: Navigate to the "Download File" tab, enter the resource path, and click the "Download File" button to download the specified file.

4. **List Users**: Navigate to the "User Details" tab, enter the resource path, and click the "List Users" button to list users who have access to the specified file.

5. **Real-Time Updates**: The application will automatically display toast notifications for any changes detected in the specified resources.


### Local Setup

## Backend Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/onedrive-integration.git
    cd onedrive-integration/backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the `backend` directory with the following content:

    ```env
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    REDIRECT_URI=http://localhost:3000/auth/callback
    TENANT_ID=your_tenant_id
    ACCESS_TOKEN=your_access_token
    ```

    Replace the placeholders with your actual Microsoft Azure application credentials.

4. **Run the backend server**:

    ```bash
    npm run start:dev
    ```

    The backend server will start on `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the frontend directory**:

    ```bash
    cd ../frontend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the `frontend` directory with the following content:

    ```env
    REACT_APP_BASE_URL=http://localhost:3000
    ```

4. **Run the frontend server**:

    ```bash
    npm start
    ```

    The frontend server will start on `http://localhost:3001`.

## Usage

1. **Login**: Navigate to `http://localhost:3001` and click on the login button. You will be redirected to Microsoft's login page. After successful authentication, you will be redirected back to the application.

2. **List Files**: Navigate to the "List Files" tab and click the "List Files" button to fetch and display files from OneDrive.

3. **Download File**: Navigate to the "Download File" tab, enter the resource path, and click the "Download File" button to download the specified file.

4. **List Users**: Navigate to the "User Details" tab, enter the resource path, and click the "List Users" button to list users who have access to the specified file.

5. **Real-Time Updates**: The application will automatically display toast notifications for any changes detected in the specified resources.

## API Endpoints

### Backend

- **List Files**: `GET /onedrive/list-files`
- **Download File**: `GET /onedrive/download-file?resource=RESOURCE_PATH`
- **List Users**: `GET /onedrive/list-users?resource=RESOURCE_PATH`
- **Delta API**: `GET /onedrive/delta?resource=RESOURCE_PATH`
- **SSE Notifications**: `POST /realtime/notification`

### Frontend

- **List Files**: Calls the `GET /onedrive/list-files` endpoint.
- **Download File**: Calls the `GET /onedrive/download-file` endpoint.
- **List Users**: Calls the `GET /onedrive/list-users` endpoint.
- **Delta API**: Calls the `GET /onedrive/delta` endpoint upon receiving SSE notifications.

## License

This project is licensed to vamshikrishna209@gmail.com
