import { AnimatedBorder } from '@/components';
import type { CookieValues } from '@/types';
import API from '@/utilis/axios-api';
import { loginSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import {
	LoaderCircle,
	LockKeyhole,
	LucideShieldUser,
	Mail,
} from 'lucide-react';
import { useEffect, type MouseEvent } from 'react';
import { useCookies } from 'react-cookie';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

/**
 * LoginPage is a page that allows users to login to their account.
 * It contains a form with fields for the user's email and password.
 * When the form is submitted, it sends a POST request to the '/auth/login' endpoint with the form values.
 * The response is expected to contain the user data as well as an access token.
 * The user data is then stored in the redux store and used to authenticate the user.
 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
 */

const LoginPage = () => {
	const navigate = useNavigate();
	//@ts-ignore
	const [cookies, setCookie] = useCookies<'token', CookieValues>(['token']);

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['login'],
		/**
		 * The mutation function that is called when the form is submitted.
		 * It sends a POST request to the '/auth/register' endpoint with the form values.
		 * The response is expected to contain the user data as well as an access token.
		 * The user data is then stored in the redux store and used to authenticate the user.
		 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
		 */
		mutationFn: async (values: z.infer<typeof loginSchema>) => {
			return await API.post('auth/login', values);
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'all',
	});

	/**
	 * Submits the login form.
	 * Sends a POST request to the '/auth/login' endpoint with the form values.
	 * The response is expected to contain the user data as well as an access token.
	 * The user data is then stored in the redux store and used to authenticate the user.
	 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
	 * @param {z.infer<typeof loginSchema>} values - The form values
	 */
	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		try {
			await mutateAsync(values)
				.then(({ data }: any) => {
					const expires = new Date();
					expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
					setCookie('token', data?.token, {
						path: '/',
						expires,
						sameSite: 'none',
						secure: true,
					});
					reset();

					toast.success(data?.messagem);

					navigate(`/`, {
						replace: true,
					});
				})
				.catch((err: any) => {
					toast.error(err?.response?.data?.message || err?.message);
				});
		} catch (error) {}
	};

	useEffect(() => {
		document.title = 'Login | Realtime Chat App '; // Set the desired title for this page
	}, []); // The empty dependency array ensures this runs only once on mount
	return (
		<AnimatedBorder>
			<div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
				<div className="col-span-1 md:border-r border-slate-600/30 md:p-4">
					<div className="w-full h-full flex items-center justify-center p-4 pb-6 md:p-8">
						<div className="w-full mx-w-md">
							<div className="text-center mb-8 ">
								<LucideShieldUser className="size-10 sm:size-12 text-slate-100 mx-auto mb-2" />
								<h1 className="font-bold text-lg sm:text-2xl text-slate-100 mb-2">
									Welcome Back
								</h1>
								<p className="text-slate-400 text-sm">
									Login to access to your account
								</p>
							</div>
							<form
								className="space-y-4 sm:space-y-6 md:space-y-8"
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="space-y-1.5">
									<label htmlFor="email" className="auth-label">
										Email
									</label>
									<Controller
										name="email" // Unique name for your field
										control={control} // The control object from useForm
										render={({ field }) => (
											<div className="relative">
												<Mail className="auth-icon" />
												<input
													id="email"
													type="email"
													autoFocus
													autoComplete="email"
													placeholder="Enter your email"
													className={classNames('auth-input', {
														'border-red-200': errors.email,
													})}
													{...field}
													disabled={isPending}
												/>
											</div>
										)}
									/>
									<p className="text-red-200">{errors.email?.message}</p>
								</div>
								<div className="space-y-1.5">
									<label htmlFor="password" className="auth-label">
										Password
									</label>
									<Controller
										name="password" // Unique name for your field
										control={control} // The control object from useForm
										render={({ field }) => (
											<div className="relative">
												<LockKeyhole className="auth-icon" />
												<input
													id="password"
													type="password"
													autoComplete="new-password"
													placeholder="Enter your password"
													className={classNames('auth-input', {
														'border-red-200': errors.password,
													})}
													{...field}
													disabled={isPending}
												/>
											</div>
										)}
									/>
									<p className="text-red-200">{errors.password?.message}</p>
								</div>
								<button
									className="auth-btn"
									type="submit"
									disabled={isPending || isValid === false}
								>
									{!isPending ? (
										<span> Sign In</span>
									) : (
										<>
											<span>loading.....</span>
											<LoaderCircle className="animate-spin size-5" />
										</>
									)}
								</button>
							</form>
							<div className="mt-6 text-center">
								<Link
									to="/sign-up"
									className={classNames('auth-link cursor-pointer', {
										'pointer-events-none': isPending,
									})}
									onMouseDown={(e: MouseEvent) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									Don&apos;t have an account? Sign Up
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-1 hidden md:flex md:items-center md:justify-center md:flex-col md:p-8 md:bg-gradient-to-bl md:from-slate-800 md:to-slate-900 ">
					<div>
						<img src="login.png" className="w-full h-auto object-cover" />
					</div>
					<div className="text-center space-y-4">
						<h1 className="text-xl font-medium text-cyan-400">
							Connect anytime, anywhere
						</h1>
						<div className="flex items-center justify-center space-x-4">
							<span className="auth-badge">Free</span>
							<span className="auth-badge">Easy Setup</span>
							<span className="auth-badge">Private</span>
						</div>
					</div>
				</div>
			</div>
		</AnimatedBorder>
	);
};

export default LoginPage;
