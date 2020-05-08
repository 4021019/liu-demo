import Token from 'markdown-it/lib/token';

export interface ITokenArrays {
  array: Token[];
}

export interface IProps {
  value: string;
}

export interface IMdTokenProps extends ITokenArrays {
  index: number;
  type?: string;
  children?: any;
}

export interface IRenderReturn {
  step: number;
  content?: any;
}
