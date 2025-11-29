const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
