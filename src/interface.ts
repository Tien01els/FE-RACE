export interface IStringOptions {
    [key: string]: string;
}

export interface IAutoCompleteOption {
    id: string;
    label: string;
}

export interface IInformationTable {
    headInfo: string[],
    bodyInfo: any[]
}

export interface ITablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}