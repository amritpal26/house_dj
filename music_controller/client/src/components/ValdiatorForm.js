import React from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

export default (props) => {
    if (!ValidatorForm.hasValidationRule('isPasswordMatch')) {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            const { formData } = props.formData;
            if (value !== formData.password) {
                return false;
            }
            return true;
        });
    }

    return (
        <ValidatorForm onSubmit={props.onSubmit}/>
    );
};