import { InputPropsInterface } from "@/types/props/DefaultProps";
import classNames from "classnames";
import cl from './inputPrimaty.module.scss';

interface Props extends InputPropsInterface {
  style: 'default' | 'big'
}

const InputPrimary = ({ type, className, onChange, value, placeholder, style }: Props): JSX.Element => {
  return (
    <input 
      className={classNames(cl.input, cl[`input_${style}`], className)} 
      type={type} 
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}

export default InputPrimary