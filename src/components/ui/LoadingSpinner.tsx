interface LoadingSpinnerProps {
	size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium" }) => {
	const sizeClasses = {
		small: "w-5 h-5 border-2",
		medium: "w-8 h-8 border-3",
		large: "w-12 h-12 border-4",
	};

	return (
		<div className="flex justify-center items-center p-4">
			<div
				className={`${sizeClasses[size]} rounded-full border-t-accent-500 border-r-accent-500 border-b-transparent border-l-transparent animate-spin`}
			></div>
		</div>
	);
};

export default LoadingSpinner;
