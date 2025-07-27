import React from "react";
import PropTypes from "prop-types";

const Button = ({
    children,
    size = "md",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
}) => {
    const sizeClasses = {
        sm: "px-4 py-3 text-sm",
        md: "px-5 py-3.5 text-sm",
    };

    // const variantClasses = {
    //     primary:
    //         "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    //     outline:
    //         "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100",
    // };
    const variantClasses = {
        primary:
            " bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer",
        outline:
            "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 cursor-pointer",
    };


    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${sizeClasses[size]
                } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
                }`}
            onClick={onClick}
            disabled={disabled}
        >
            {startIcon && <span className="flex items-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["sm", "md"]),
    variant: PropTypes.oneOf(["primary", "outline"]),
    startIcon: PropTypes.node,
    endIcon: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;
