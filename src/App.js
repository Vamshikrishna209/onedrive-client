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
  const [resource, setResource] = useState('');
  const [users, setUsers] = useState([]);
  // const [fileContent, setFileContent] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken') || '');
  const [tabValue, setTabValue] = useState(0);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      const eventSource = new EventSource(`${baseURL}/events/sse`);
      eventSource.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const resource = data.resource;

        // Call the delta API
        try {
          const deltaResponse = await axios.get(`${baseURL}/onedrive/delta`, {
            params: { resource },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const lastUpdatedFile = deltaResponse.data.value[0];
          toast.info(`File updated: ${lastUpdatedFile.name}`);
        } catch (error) {
          console.error('Error fetching delta:', error);
          toast.error('Error fetching delta');
        }
      };
      return () => {
        eventSource.close();
      };
    }
  }, [accessToken, baseURL]);

  const handleResourceChange = (e) => setResource(e.target.value);

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

  // const downloadFile = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/onedrive/download-file?resource=${resource}`, {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //       responseType: 'arraybuffer',
  //     });
  //     const blob = new Blob([response.data], { type: 'application/octet-stream' });
  //     const url = URL.createObjectURL(blob);
  //     setFileContent(url);
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //   }
  // };

  const listUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/onedrive/list-users?resource=${resource}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data.value.map(permission => permission.grantedTo.user));
    } catch (error) {
      console.error('Error listing users:', error);
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
    setResource('');
    setUsers([]);
    // setFileContent(null);
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
                          ) : <p>Empty file/folder</p>
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
              label="Resource"
              value={resource}
              onChange={handleResourceChange}
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
              label="Resource"
              value={resource}
              onChange={handleResourceChange}
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
