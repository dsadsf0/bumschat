import React from 'react';
import classNames from 'classnames';
import cl from './inputPrimary.module.scss';
import { memo } from 'react';
import { InputProps } from '@/types/defaultProps';

type Props = InputProps & {
    style: 'default' | 'big';
    isError?: boolean;
};

const InputPrimary: React.FC<Props> = memo(
    ({ type, className, onChange, value, placeholder, style, title, isError }) => {
        return (
            <input
                className={classNames(cl.input, cl[`input_${style}`], { [cl._error]: isError }, className)}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                title={title}
            />
        );
    }
);

export default InputPrimary;
