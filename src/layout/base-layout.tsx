import { Loader } from '@/components';
import { Suspense } from 'react';

const BaseLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="flex w-inherit relative h-inherit select-none min-h-dvh  flex-col items-center justify-center bg-slate-900  px-4 py-10">
			{/* DECORATORS - GRID BG & GLOW SHAPES */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
			<div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
			<div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
			<Suspense fallback={<Loader />}>{children}</Suspense>
		</div>
	);
};

export default BaseLayout;
