export interface ListInfo {
    name: string;
    year: string;
    department?: string;
    entity?: string;
    path: string;
}

export interface CandidateInfo {
    name: string;
    year: string;
    listName: string;
    department?: string;
    entity?: string;
    path: string;
}

export interface CdlInfo {
    name: string;
    year: string;
    isUnder500: boolean;
}
