/* eslint-disable react/prop-types */

const Button = ({ children, onClick, variant = "primary", ...props }) => {
  // Base Tailwind classes for common styling
  const baseClasses =
    "px-4 py-2 rounded focus:outline-none transition-colors duration-200";

  // Define variant-specific Tailwind classes
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    createProjectButton:
      "bg-green-600 flex items-center gap-2 text-xl font-semibold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 transition duration-300 ",
  };

  // Fallback to primary if an unknown variant is provided
  const classes = `${baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  }`;

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
