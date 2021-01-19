import { TableFormDataType } from './components/TableForm';

export interface formDataType {
  title: string;
  date: string[];
  select: string;
  radio1: string;
  radio2: string;
  checkbox: string[];
  remark: string;
  users?: TableFormDataType[];
}
