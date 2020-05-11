import Token from 'markdown-it/lib/token';

export interface ITokenArrays {
  array: Token[];
}

export type TypeOnEdit = (line?: number) => string;

export type TypeOnChange = (src: string, target: string, line?: number) => void;

export interface IOnEdit {
  onEdit: TypeOnEdit;
}

export interface IOnChange {
  onChange: TypeOnChange;
}

export interface IProps extends IOnEdit, IOnChange {
  value: string;
}

export interface IMdTokenProps extends ITokenArrays, IOnEdit, IOnChange {
  index: number;
  markup?: string;
  type?: string;
  children?: any;
}

export interface IRenderReturn {
  step: number;
  content?: any;
}
