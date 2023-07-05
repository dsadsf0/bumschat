import { InputPropsInterface } from "@/types/DefaultProps";
import classNames from "classnames";
import cl from './inputPrimaty.module.scss';
import { memo } from 'react';

interface Props extends InputPropsInterface {
    style: 'default' | 'big',
    isError?: boolean
}

const InputPrimary = memo(({ type, className, onChange, value, placeholder, style, title, isError, autoFocus }: Props): JSX.Element => {
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
})

export default InputPrimary