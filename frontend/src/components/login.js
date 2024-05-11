import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

import { AppContext } from './appContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [credWrong, setCredWrong] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setName } = useContext(AppContext);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { username, password });
            console.log("resposne checking", response);
            if (response != undefined && response.data != undefined) {
                console.log("inside respose check");
                if (response.data.statusCode == 200 && response.data.message == 'Login Successful') {
                    setName(response.data.data.name);
                    // const data = {username : username}
                    // sessionStorage.setItem('user',JSON.stringify(data));
                    setUsername('');
                    setPassword('');
                    navigate('/home');
                }
                if (response.data.statusCode == 400 && response.data.message == 'Invalid Credentials') {
                    setUsername('');
                    setPassword('');
                    setCredWrong(true);
                }

            }
            else {
                setError('Error in LOGIN API');
            }


        } catch (error) {
            if (error.response.status === 401) {
                setError('Bad request: The server could not process the request.');
            } else {
                setError('An error occurred while fetching data.');
            }
        }
    };

    return (
        <div>
            {error == '' ?
                <div>
                    <form onSubmit={handleLogin}>
                        <Box display="flex" flexDirection={"column"}
                            maxWidth={400} alignItems={'center'}
                            justifyContent={'center'}
                            margin={'auto'}
                            marginTop={5}
                            padding={3}
                            borderRadius={5}
                            boxShadow={"5px 5px 10px #ccc"}
                            sx={{
                                ":hover": {
                                    boxShadow: '10px 10px 20px #ccc'
                                },
                            }}
                        >
                            <Typography variant='h2' padding={3} textAlign={'center'}>LOGIN</Typography>
                            <TextField type={'text'} variant='outlined'
                                placeholder='Username'
                                margin='normal'
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setCredWrong(false);
                                }}
                                value={username}
                                required={true}
                                autoFocus={true}
                            />
                            <TextField type={'password'} variant='outlined' placeholder='Password'
                                margin='normal'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required={true}
                            />
                            <Button variant='contained'
                                type='submit'
                                sx={{ marginTop: 3, borderRadius: 3 }}
                                color='warning'

                            >Login</Button>
                            {credWrong ? <Typography
                                marginTop={3}
                                color={'red'}
                            >Invalid Credentials</Typography> : ''}

                            <Button
                                sx={{ marginTop: 3, borderRadius: 3 }}
                                onClick={() => navigate("/register")}
                            >Register</Button>
                        </Box>
                    </form>
                </div> : <div style={{ textAlign: 'center', color: 'red' }}><Typography>{error}</Typography></div>
            }
        </div>
    );
};

export default Login;
