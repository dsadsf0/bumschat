export interface DefaultPropsInterface {
  className?: string
}

export interface InputPropsInterface extends DefaultPropsInterface {
  type: 'text';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  title?: string
}