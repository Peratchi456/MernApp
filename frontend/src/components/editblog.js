import React from "react";
import { useState, useContext, useEffect } from "react";
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


//ModelCss
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


const EditBlog = () => {

    const navigate = useNavigate();
    const { name, editId } = useContext(AppContext);

    //Updation blog State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState("");
    const [fileSizeError, setFileSizeError] = useState(false);
    const [error, setError] = useState('');


    //Appbar State
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);

    //modal State
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    useEffect(() => {
        const getEditBlogData = async () => {
            try {
                if (editId && editId != null) {
                    const editBlogData = await axios.get(`http://localhost:5000/api/getblog/${editId}`);
                    console.log("VIEW BLOG", editBlogData.data);
                    if (editBlogData.data.data) {
                        setTitle(editBlogData.data.data.title);
                        setDescription(editBlogData.data.data.description);
                        setFile(editBlogData.data.data.imageUrl)
                    }
                    setError('Response Data object not Found');
                }
                else {
                    setError('Blog id is not found Please Choose Any blog');
                    navigate('/');
                }
            } catch (error) {
                if (error.response.status === 400) {
                    setError('Bad request: The server could not process the request.');
                } else {
                    setError('An error occurred while fetching data.');
                }
            }
        }
        getEditBlogData();

    }, [])



    //Edit Form Submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {

            const formData = {
                title: title,
                description: description,
                createdby: name,
                imageUrl: file,
                date: Date.now()
            }
            console.log("Edit Data", formData);
            const blogupdate = await axios.put(`http://localhost:5000/api/updateblog/${editId}`, formData);
            console.log("Create API Resp", blogupdate);
            if (blogupdate.data.statusCode == 200) {
                setOpen(true);
                setTitle('');
                setDescription('');
                setFile('');
            }
            setError('Error In Update API')

        } catch (error) {
            if (error.response.status === 400) {
                setError('Bad request: The server could not process the request.');
            } else {
                setError('An error occurred while fetching data.');
            }
        }
    };

    function handleChangeFile(e) {
        console.log("FILE Select", e.target.files);
        const selectedFile = e.target.files[0];
        const fileSizeInBytes = selectedFile.size;

        if (Math.round(fileSizeInBytes / 1000) <= 41) {
            setFileSizeError(false);
            //old logic for image
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                console.log("imgbase", reader.result);
                setFile(reader.result);
            }
            reader.onerror = error => {
                console.log("Error during img conversion", error);
            }
        } else {
            setFileSizeError(true);
        }

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

    const handleNavigate = () => {
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
            {error && error != '' ?
                <div style={{ marginTop: '2%', marginLeft: '2%', marginBottom: '2%', marginRight: '2%' }}>
                    <Typography
                        textAlign={'center'}
                        variant="h4" gutterBottom
                    > Edit Blog</Typography>

                    <div style={{ width: '90%', marginLeft: '20px' }}>

                        <form
                            onSubmit={handleFormSubmit}
                        >
                            <div>
                                <Typography>Choose Image</Typography>

                                <input type="file" onChange={handleChangeFile}
                                    required={true}
                                ></input>
                                {fileSizeError ?
                                    <Typography color={'red'}
                                        variant="caption" display="block" gutterBottom
                                    >Choose Only Images And Size Less Than 40kb</Typography> : ""
                                }

                                <br />
                                {
                                    file && file != "" ? <img src={file} style={{ width: '40%', height: '40%', marginTop: '10px' }} /> : ""}

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
                            <div style={{ float: 'left', width: '100%' }}>
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
                                disabled={fileSizeError}
                            >Update Blog</Button>
                        </form>
                    </div>
                </div> : <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
            }

            <div>
                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Blog Updated Successfully
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

export default EditBlog;