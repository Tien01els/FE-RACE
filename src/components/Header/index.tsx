import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import pngwing from '../images/logo.png';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ minHeight: '48px !important', paddingLeft: '3rem !important' }} className="bg-[#8e918f]">
                    <h1 className="font-sans text-2xl font-bold text-white-500 uppercase ">
                        Formula1
                    </h1>
                </Toolbar>
            </AppBar>
        </Box >
    );
}
