export type Payload = {
  id: string;
  [key: string]: any;
};

export type Record = {
  id: number;
  method: string;
  bin_id: string;
  created_at: string;
  headers: string[];
  mongo_doc_id: string | null;
};

export type RecordWithDoc = {
  id: number;
  method: string;
  bin_id: string;
  created_at: string;
  headers: string;
  payload: Payload;
};

export interface BinInterface {
  id: string;
  created_at: string;
  session_id: string;
}

export type RecordComponentProps = {
  record: RecordWithDoc;
};

export type AppView = "home" | "modal" | "bins";

export type RecordsContextType = {
  records: RecordWithDoc[];
  setRecords: React.Dispatch<React.SetStateAction<RecordWithDoc[]>>;
};

export type BinsContextType = {
  bins: BinInterface[];
  setBins: React.Dispatch<React.SetStateAction<BinInterface[]>>;
  selectedBin: BinInterface | undefined;
  setSelectedBin: React.Dispatch<
    React.SetStateAction<BinInterface | undefined>
  >;
};

export type ViewContextType = {
  view: AppView;
  setView: React.Dispatch<React.SetStateAction<AppView>>;
};
