export interface IProps {
  value: string;
  saveValue: (value: string) => boolean;
}

export interface IState {
  text: string;
}
