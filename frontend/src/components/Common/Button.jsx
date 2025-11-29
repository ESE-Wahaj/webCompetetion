const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseClasses = 'font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
    secondary: 'bg-spring-400 hover:bg-spring-500 text-primary-900 shadow-sm',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    ghost: 'hover:bg-whisper-100 text-gray-700'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
