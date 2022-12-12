import xlsx, { IJsonSheet, ISettings } from 'json-as-xlsx';

const settings: ISettings = {
  writeOptions: {
    type: 'buffer',
    bookType: 'xlsx',
  },
};

export const generateExcel = (data: IJsonSheet[]): Buffer => {
  return xlsx(data, settings);
};
