/**
 * A component that displays a list of 5 loading skeletons for users.
 * The skeletons are animated with a pulse animation and have a grey background.
 * Each skeleton consists of a circular avatar and two rectangles for the user's name and other details.
 * The component is useful for displaying a list of users while the data is loading.
 */
const UsersLoadingSkeleton = () => {
	return (
		<div className="space-y-2">
			{[...Array(5)].map((_, index) => (
				<div
					className="bg-slate-800/30 p-4 rounded-lg animate-pulse"
					key={index}
				>
					<div className="flex items-center space-x-3">
						<div className="size-12 rounded-full bg-slate-700"></div>
						<div className="flex-1 space-y-2">
							<div className="h-3 bg-slate-700 rounded w-2/3"></div>
							<div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default UsersLoadingSkeleton;
