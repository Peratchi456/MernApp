import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';



const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const [regcheck, setRegCheck] = useState(false);
    // const [regmodel, setRegModel] = useState(false);

    //modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const navigate = useNavigate();


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                name,
                username,
                password,
            });
            console.log("Response check", response);
            if (response != undefined) {
                if (response.data.statusCode == 201) {
                    setOpen(true);
                    // alert('Registration Successfull');
                    setName('');
                    setUsername('');
                    setPassword('');
                }
                if (response.data.statusCode == 400) {
                    setRegCheck(true);
                }
            }
        } catch (error) {
            if (error.response.status === 400) {
                setError('Bad request: The server could not process the request.');
            } else {
                setError('An error occurred while fetching data.');
            }
            // console.error(error.response.data.message);
        }
    };

    const handleNavigate = async () => {
        if (open) {
            navigate('/');
        }
    }

    return (
        <div>
            <div>
                <form onSubmit={handleRegister}>
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
                        <Typography variant='h3' padding={3} textAlign={'center'}>Register</Typography>
                        <TextField type={'text'} variant='outlined'
                            placeholder='Name'
                            margin='normal'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required={true}
                            autoFocus={true}
                        />
                        <TextField type={'text'} variant='outlined'
                            placeholder='Username'
                            margin='normal'
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setRegCheck(false)
                            }}
                            value={username}
                            required={true}

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
                        >Register</Button>

                        <Button
                            sx={{ marginTop: 3, borderRadius: 3 }}
                            onClick={() => navigate("/")}
                        >Login</Button>

                        {regcheck ? <Typography
                            marginTop={3}
                            color={'red'}
                        >User Already Exist</Typography> : ''}
                    </Box>
                </form>
            </div>

            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            User Registration Completed
                        </Typography>

                        <Button variant='contained'
                            type='submit'
                            sx={{ marginTop: 3, borderRadius: 3 }}
                            color='success'
                            onClick={handleNavigate}
                        >OK</Button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default Register;
