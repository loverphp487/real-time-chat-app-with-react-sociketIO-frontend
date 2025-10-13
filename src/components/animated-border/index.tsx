/**
 * AnimatedBorder component that displays an animated border around its children.
 * The border color changes from cyan to indigo.
 * The border angle is controlled by the `--border-angle` CSS variable.
 *
 * @param {{ children: React.ReactNode }} props - The children components to be rendered within the AnimatedBorder.
 * @returns {JSX.Element} The rendered AnimatedBorder component.
 */
const AnimatedBorder = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="w-full max-w-6xl min-h-3/4 h-full z-40">
			<div className="w-full h-full [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.cyan.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.cyan.600/.48))_border-box] rounded-2xl border-[3px] border-transparent animate-border overflow-hidden">
				{children}
			</div>
		</div>
	);
};

export default AnimatedBorder;
