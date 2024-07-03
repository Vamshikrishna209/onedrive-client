import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Button,
  Container,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState('');
  const [users, setUsers] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken') || '');
  const [tabValue, setTabValue] = useState(0);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      const eventSource = new EventSource(`${baseURL}/events/sse`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("event " + JSON.stringify(event));
        toast.info(`File change detected: ${data.message}`);
      };
      return () => {
        eventSource.close();
      };
    }
  }, [accessToken, baseURL]);

  const handleFileIdChange = (e) => setFileId(e.target.value);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const listFiles = async () => {
    try {
      const response = await axios.get(`${baseURL}/onedrive/list-files`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFiles(response.data.value);
    } catch (error) {
      console.error('Error listing files:', error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await axios.get(`${baseURL}/onedrive/download-file?fileId=${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      setFileContent(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const listUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/onedrive/list-users?fileId=${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data.value.map(permission => permission.grantedTo.user));
    } catch (error) {
      console.error('Error listing users:', error);
    }
  };

  const createSubscription = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/realtime/subscribe`,
        { fileId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(`Subscription created: ${response.data.id}`);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Error creating subscription');
    }
  };

  const login = async () => {
    try {
      const response = await axios.get(`${baseURL}/auth/login`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setAccessToken('');
    setFiles([]);
    setFileId('');
    setUsers([]);
    setFileContent(null);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        OneDrive Integration
      </Typography>
      {!accessToken ? (
        <Button variant="contained" color="primary" onClick={login}>
          Login
        </Button>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
          <Typography variant="h6" gutterBottom>
            Logged in
          </Typography>
          <AppBar position="static" style={{ marginTop: '20px' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="List Files" />
              <Tab label="User Details" />
              <Tab label="Subscribe to File" />
            </Tabs>
          </AppBar>
          <TabPanel value={tabValue} index={0}>
            <Button variant="contained" color="primary" onClick={listFiles} style={{ margin: '20px 0' }}>
              List Files
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>File ID</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.id}</TableCell>
                      <TableCell>
                        {
                          file.size > 0 ? (
                            <Button
                          variant="contained"
                          color="primary"
                          href={file['@microsoft.graph.downloadUrl']}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </Button>
                          ): <p>Empty file / folder</p>
                        }
                        
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          {/* <TabPanel value={tabValue} index={1}>
            <TextField
              label="File ID"
              value={fileId}
              onChange={handleFileIdChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={downloadFile}>
              Download File
            </Button>
            {fileContent && (
              <a href={fileContent} download="file">
                Download Link
              </a>
            )}
          </TabPanel> */}
          <TabPanel value={tabValue} index={1}>
            <TextField
              label="File ID"
              value={fileId}
              onChange={handleFileIdChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={listUsers}>
              List Users
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User Name</TableCell>
                    <TableCell>User ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.displayName}</TableCell>
                      <TableCell>{user.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TextField
              label="File ID"
              value={fileId}
              onChange={handleFileIdChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={createSubscription}>
              Subscribe to File
            </Button>
          </TabPanel>
        </>
      )}
      <ToastContainer />
    </Container>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default App;
