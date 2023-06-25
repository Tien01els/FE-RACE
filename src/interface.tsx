
export interface IStringOptions {
    [key: string]: string;
}

export interface IHref {
    id: string,
    hrel: string,
}

export interface IAllRaces {
    grandPrix: IHref,
    date: string,
    winner: string,
    car: string,
    laps: string,
    time: string
}

export interface IDetailRace {
    pos: string,
    no: string,
    driver: string,
    car: string,
    laps: string,
    timeRetired: string,
    pts: string
}


export interface IAutoCompleteOption {
    id: string;
    label: string;
}

export interface IInformationTable {
    headInfo: string[],
    bodyInfo: any[]
}
