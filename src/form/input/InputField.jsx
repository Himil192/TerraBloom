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
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring ${className}`;

    if (disabled) {
        inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed`;
    } else if (error) {
        inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20`;
    } else if (success) {
        inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20`;
    } else {
        inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20`;
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
                        ? "text-error-500"
                        : success
                            ? "text-success-500"
                            : "text-gray-500"
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
