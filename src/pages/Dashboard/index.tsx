
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Filters from '../../components/Filters';
import ArchiveTable from '../../components/ArchiveTable';
import GraphRanking from '../../components/GraphRanking';
import { IInformationTable } from '../../interface';
import Header from '../../components/Header';

export default function Dashboard() {
    const [informationOfFormula, setInformationOfFormula] = useState<IInformationTable>()
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div>
            <Header />
            <Filters
                setInformationOfFormula={setInformationOfFormula}
            />
            {shouldRender ? informationOfFormula?.bodyInfo.length ?
                <div>
                    <ArchiveTable informationOfFormula={informationOfFormula} />
                    <GraphRanking informationOfFormula={informationOfFormula} />
                </div>
                : <span className='flex justify-center text-center'>No results are currently available</span>
                : <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>
            }
        </div>
    );
}

