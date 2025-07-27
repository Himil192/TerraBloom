// components/EcoLeafSpinner.jsx
const EcoLeafSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <svg
                className="animate-spin h-10 w-10 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 2C6.486 2 2 6.486 2 12h2a8 8 0 0116 0h2c0-5.514-4.486-10-10-10z" />
            </svg>
        </div>
    );
};

export default EcoLeafSpinner;
