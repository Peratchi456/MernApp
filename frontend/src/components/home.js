import React, { useContext, useEffect, useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';



import { AppContext } from './appContext';

import { Card, CardMedia, CardContent, Button } from '@mui/material';

import axios from 'axios';

const Home = () => {

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { name,setViewId } = useContext(AppContext);
    console.log("Name in ContextAPI", name);

    //Home State variable
    const [blogData, setBlogData] = useState([]);
    const [error, setError] = useState('');

  
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogDatas = async () => {
            try {
                const blogApiData = await axios.get('http://localhost:5000/api/getallblogs');
                console.log("API REsponse BLOG", blogApiData);
                if (blogApiData.data && blogApiData.data.statusCode == 200) {
                    if (blogApiData.data.data && blogApiData.data.data.length > 0) {
                        setBlogData(blogApiData.data.data);
                    }
                    setError('API RESPONSE DATA NOT FOUND');
                }
                setError('ERROR IN API FETCH');

            } catch (error) {
                if (error.response.status === 400) {
                    setError('Bad request: The server could not process the request.');
                } else {
                    setError('An error occurred while fetching data.');
                }
            }
        }
        fetchBlogDatas();
    }, [])


    //Appbar
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

    //Handling read more
    const handleReadMore = (object) =>{
        console.log("Object HandleReadMore",object);
        setViewId(object);
        navigate('/viewblog');
    }

    //data Stub
    // const blogData = [
    //     {
    //         id: 1,
    //         title: "Sample Post",
    //         description: "A blog (a truncation of weblog) is an informational website consisting of discrete, often informal diary-style text entries (posts)",
    //         imageUrl: "./assets/pixel1.jpg",
    //         createdBy: "Selvan",
    //         date: "2024-05-09T15:28:06.620Z"
    //     },
    //     {
    //         id: 1,
    //         title: "Sample Post",
    //         description: "A blog (a truncation of weblog) is an informational website consisting of discrete, often informal diary-style text entries (posts)",
    //         imageUrl: "./assets/pixel1.jpg",
    //         createdBy: "Selvan",
    //         date: "2024-05-09T15:28:06.620Z"
    //     }
    // ]

    // console.log("blogData", blogData);

    return (
        <div>
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

            <div style={{ marginTop: '2%', marginLeft: '2%', marginBottom: '2%', marginRight: '2%', float: 'left' }}>
                <Typography variant="h4"
                    gutterBottom
                    textAlign={'center'}
                >
                    Blogs
                </Typography>

                {blogData.length > 0 ?
                    blogData.map((obj) => {
                        return (
                            <div style={{ float: 'left', marginLeft: "10px" ,marginTop:'15px'}}>
                                <Card
                                    sx={{ maxWidth: 345 }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={obj.imageUrl}
                                        alt="Blog Image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {obj.title}
                                        </Typography>
                                        <div>
                                            <Typography variant="caption" gutterBottom style={{
                                                fontWeight: 'bold'
                                            }}>createdBy
                                                {obj.createdBy}
                                            </Typography>
                                            <Typography variant="caption" gutterBottom style={{ fontStyle: 'italic', marginLeft: '3px' }}>
                                                {'Posted On' + '' + new Date(obj.date).toLocaleString()}
                                            </Typography>
                                        </div>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            overflow={'hidden'}
                                            textOverflow={'ellipsis'}
                                            whiteSpace={'nowrap'}
                                        >
                                            {obj.description}
                                        </Typography>
                                        <Button variant="outlined"
                                            color="primary"
                                            size='small'
                                            style={{ marginTop: '5px' }}
                                            onClick={()=>{handleReadMore(obj.id)}}
                                        >
                                            Read More
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })
                    : <div style={{ textAlign: 'center' }}>{error ? error : 'No Records Found'}</div>
                }
            </div>
        </div>
    );
}

export default Home;