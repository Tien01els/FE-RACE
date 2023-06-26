import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import logo from '../../assests/f1_logo.png';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ minHeight: '48px !important', paddingLeft: '3rem !important' }} className="bg-[#e10600]">
                    {/* <h1 className="font-sans text-2xl font-bold text-white-500 uppercase ">
                        Formula1
                    </h1> */}
                    <img src={logo} alt="Formula 1" className='h-[36px]' />
                </Toolbar>
            </AppBar>
        </Box >
    );
}
