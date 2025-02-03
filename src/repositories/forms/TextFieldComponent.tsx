import type { TextFieldProps } from "@mui/material";

import { useField } from "@unform/core";
import { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";



type ITextFieldProps = TextFieldProps & {
    name: string;
};

export const TextFieldComponent: React.FC<ITextFieldProps> = ({ name, ...rest }) => {
    const { fieldName, registerField, defaultValue, clearError, error } = useField(name);
    const [value, setValue] = useState(defaultValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue),
        });
    }, [registerField, fieldName, value]);

    return (
        <TextField
            name={name}
            {...rest}
            error={!!error}
            helperText={error}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                rest.onChange?.(e);
            }}
            onKeyDown={(e) => {
                if (error) clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};
