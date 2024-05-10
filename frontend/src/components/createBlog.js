import React from "react";
import { useState, useContext } from "react";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';

import { Button, TextField } from '@mui/material';

import Modal from '@mui/material/Modal';
import { AppContext } from './appContext';


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




const CreateBlog = () => {

    const navigate = useNavigate();
    const { name } = useContext(AppContext);

    //BlogCreation
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState("");
    const [error, setError] = useState('');


    //Appbar
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

     //modal
     const [open, setOpen] = React.useState(false);
     const handleOpen = () => setOpen(true);
     const handleCloseModal = () => setOpen(false);



    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const randomnum = Math.round(Math.random() * 1000);
            console.log("Random Nun", randomnum);
            const formData = {
                id: randomnum,
                title: title,
                description: description,
                createdby: name,
                imageUrl: file
            }
            console.log("Form Data",formData);
            const blogcreate = await axios.post('http://localhost:5000/api/createblog', formData);
            console.log("Create API Resp",blogcreate);
            if(blogcreate){
                

            }
            // alert('Blog created successfully!');
            //after that open the model
        } catch (error) {
            if (error.response.status === 400) {
                setError('Bad request: The server could not process the request.');
            } else {
                setError('An error occurred while fetching data.');
            }
        }
    };

    function handleChangeFile(e) {
        console.log("FILE Select",e.target.files);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = ()=>{
            console.log("imgbase",reader.result);
            // console.log("image type",typeof(reader.result));
            setFile(reader.result);
        }
        reader.onerror = error =>{
            console.log("Error during img conversion",error);
        }
        // setFile(URL.createObjectURL(e.target.files[0]));
    }

    //AppBar
    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        sessionStorage.removeItem('user');
        navigate('/');
    };

    const handleHomeLink = () => {
        navigate('/home');
        console.log("HomeLink Clicked");
    }

    const handleBlogCreation = () => {
        navigate('/createblog');
        console.log("BlogLink");
    }

    const handleNavigate = () =>{
        navigate('/home');
    }

    

    return (
        <>
            <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}
                                onClick={handleHomeLink}
                            >
                                Home
                            </Typography>

                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}
                                onClick={handleBlogCreation}
                            >
                                Create Blogs
                            </Typography>

                            {auth && (
                                <div>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem
                                            onClick={handleClose}
                                        >Logout</MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box>

            </div>

            <div style={{ marginTop: '2%', marginLeft: '2%', marginBottom: '2%', marginRight: '2%' }}>
                <Typography
                    textAlign={'center'}
                    variant="h4" gutterBottom
                > Create Blog</Typography>

                <div style={{ width: '90%', marginLeft: '20px' }}>

                    <form
                        onSubmit={handleFormSubmit}
                    >
                        <div>
                            <Typography>Choose Image</Typography>
                            
                            <input type="file" onChange={handleChangeFile}
                            required={true}
                            ></input><br/>
                            {
                            file && file !=""?<img src={file} style={{ width: '40%', height: '40%',marginTop:'10px' }} />:""}
                            
                        </div>
                        <div style={{ float: "left", width: '100%' }}>
                            <Typography
                            marginTop={'10px'}
                            >Title</Typography>
                            <TextField type={'text'} 
                                size="small"
                                variant='outlined'
                                placeholder='title'
                                margin='normal'
                                onChange={(e) => { setTitle(e.target.value) }}
                                value={title}
                                required={true}
                            />
                        </div>
                        <div style={{ float: 'left',width:'100%'}}>
                            <Typography
                            marginBottom={'10px'}
                            >Description</Typography>

                            <ReactQuill value={description}
                                onChange={setDescription}
                                placeholder="Enter description"
                                height='60%'
                            />
                        </div>


                        <Button variant='contained'
                            type='submit'
                            sx={{ marginTop: 3, borderRadius: 3 }}
                            color='warning'
                        >Create Blog</Button>
                    </form>
                </div>
            </div>

            <div>
                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                           Blog Created Successfully
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
        </>
    );

}

export default CreateBlog;