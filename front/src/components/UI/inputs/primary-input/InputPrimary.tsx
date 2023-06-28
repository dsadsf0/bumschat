import { InputPropsInterface } from "@/types/props/DefaultProps";
import classNames from "classnames";
import cl from './inputPrimaty.module.scss';

interface Props extends InputPropsInterface {
    style: 'default' | 'big',
    isError?: boolean
}

const InputPrimary = ({ type, className, onChange, value, placeholder, style, title, isError }: Props): JSX.Element => {
    return (
        <input 
            className={classNames(cl.input, cl[`input_${style}`], {[cl._error]: isError}, className)} 
            type={type} 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            title={title}
        />
    )
}

export default InputPrimary