import React from "react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Label = ({ htmlFor, children, className }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={twMerge(
                "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
                className
            )}
        >
            {children}
        </label>
    );
};

Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Label;
