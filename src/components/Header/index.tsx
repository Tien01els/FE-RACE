import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from '../../assets/images/f1_logo.png';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar id="top-bar" sx={{ minHeight: '48px !important', paddingLeft: '3rem !important' }} className="bg-[#e10600]">
                    <img src={logo} alt="Formula 1" className='h-[36px]' />
                </Toolbar>
            </AppBar>
        </Box >
    );
}
