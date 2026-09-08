import React from "react";
import PropTypes from "prop-types";

const Input = ({
    type = "text",
    id,
    name,
    placeholder,
    value,
    onChange,
    className = "",
    min,
    max,
    step,
    disabled = false,
    success = false,
    error = false,
    hint,
}) => {
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm ${className}`;

    if (disabled) {
        inputClasses += ` text-muted border-subtle-strong opacity-50 cursor-not-allowed glass-field`;
    } else if (error) {
        inputClasses += ` border-red-500 focus:border-red-400 focus:ring-red-500/20 glass-field`;
    } else if (success) {
        inputClasses += ` border-green-500 focus:border-green-400 focus:ring-green-500/20 glass-field`;
    } else {
        inputClasses += ` text-strong border-subtle-strong glass-field`;
    }

    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={inputClasses}
            />

            {hint && (
                <p
                    className={`mt-1.5 text-xs ${error
                        ? "text-danger"
                        : success
                            ? "text-green-600"
                            : "text-muted"
                        }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    className: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool,
    hint: PropTypes.string,
};

export default Input;
