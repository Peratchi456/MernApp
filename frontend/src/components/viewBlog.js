import React from "react";

import { useState, useEffect, useContext } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Button } from '@mui/material';

//Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { AppContext } from './appContext';

import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ViewBlog = () => {
    //AppBar State Variable
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    //viewBlog State variable
    const { name, viewId, setViewId, setEditId } = useContext(AppContext);
    const [error, setError] = useState('');
    const [viewData, setViewData] = useState({});
    const [comment, setComment] = useState('');
    const [commentTab, setCommentTab] = useState([]);

    const navigate = useNavigate();


    console.log("NAME and VIEWID", name, viewId);

    useEffect(() => {
        const viewBlogInfo = async () => {
            try {
                if (viewId && viewId != null) {
                    const viewBlog = await axios.get(`http://localhost:5000/api/getblog/${viewId}`);
                    console.log("VIEW BLOG", viewBlog.data);
                    if (viewBlog.data.data) {
                        setViewData(viewBlog.data.data);
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
        viewBlogInfo();

        const getCommentData = async () => {

            try {
                if (viewId && viewId != null) {
                    const commentData = await axios.get(`http://localhost:5000/api/getcomment/${viewId}`);
                    console.log("Comment Data API", commentData);
                    if (commentData.data.data.length > 0) {
                        setCommentTab(commentData.data.data);
                    }
                    setError('Error getting comments');
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
        getCommentData();
    }, []);

    console.log("Comment", comment)


    //APP Bar
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

    const handleEditBlogClick = () => {

        if (viewId != null) {
            setEditId(viewId);
            navigate('/editblog');
        }
    }

    const handleCommentSubmit = async (e) => {

        try {
            if (name && viewId && name != '' && viewId != null) {
                const createComment = {
                    comment: comment,
                    createdby: name,
                    blogid: viewId
                }
                const postComment = await axios.post('http://localhost:5000/api/createcomment', createComment);
                console.log("Post Comment Response", postComment);
                if (postComment.data.statCode == 200) {
                    e.preventDefault();
                    // alert('comment added successfully');
                }
            }

        } catch (error) {
            if (error.response.status === 400) {
                setError('Bad request: The server could not process the request.');
            } else {
                setError('An error occurred while fetching data.');
            }
        }
    }

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
            {
                viewData != {} ?
                    <div style={{ marginTop: '2%', marginLeft: '2%', marginBottom: '2%', marginRight: '2%' }}>
                        <Typography
                            textAlign={'center'}
                            variant="h4" gutterBottom
                        > View Blog</Typography>
                        <Typography
                            textAlign={'center'}
                            variant="h4" gutterBottom

                        > {viewData.title}</Typography>

                        <img src={viewData.imageUrl} alt='image'
                            style={{ width: '55%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                        <Typography
                            marginTop={'10px'}
                            variant="body2" gutterBottom
                            textAlign={'center'}
                        >{viewData.description}</Typography>

                        <Typography
                            variant="subtitle2" gutterBottom
                            textAlign={'center'}
                        >Created by:{viewData.createdby}
                        </Typography>

                        <div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}
                        >
                            <Button variant="outlined"
                                size="medium"
                                onClick={() => { handleEditBlogClick() }}
                            >Edit blog
                            </Button>
                        </div>
                        <Typography
                            variant="h6" gutterBottom
                        >Comments</Typography>
                        <div>
                            <form onClick={(e) => handleCommentSubmit(e)}>
                                <textarea
                                    required={true}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your comment..." rows={4} cols={50} />
                                <br />
                                <Button variant="contained" color="primary"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </form>
                        </div>

                        {/* Display existing comments */}
                        <div style={{ width: '50%', marginTop: '5%' }}>
                            <Typography
                                variant="h6" gutterBottom
                            >Existing Comments:</Typography>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Comments</TableCell>
                                            <TableCell align="right">Commented By</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            commentTab.length > 0 ? commentTab.map((dt) => {
                                                return (
                                                    <>
                                                        <TableRow
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            scope="row"
                                                        >
                                                            <TableCell>{dt.comment}</TableCell>
                                                            <TableCell align="right">{dt.createdby}</TableCell>
                                                        </TableRow>
                                                    </>
                                                );
                                            }) : <TableRow>
                                                <TableCell>No Records Found</TableCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div> : <div style={{ alignItems: 'center' }}>{error}</div>
            }
        </div>

    );

}

export default ViewBlog;