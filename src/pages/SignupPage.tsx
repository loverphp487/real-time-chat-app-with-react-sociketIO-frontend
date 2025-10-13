import { AnimatedBorder } from '@/components';
import API from '@/utilis/axios-api';
import { registerSchema } from '@/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import {
	LoaderCircle,
	LockKeyhole,
	Mail,
	MessageCircleIcon,
	User2,
} from 'lucide-react';
import { useEffect, type MouseEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

/**
 * SignupPage is a page that allows users to create a new account.
 * It contains a form with fields for the user's full name, email, and password.
 * When the form is submitted, it sends a POST request to the /auth/register endpoint
 * with the form values.
 * The response is expected to contain the user data as well as an access token.
 * The user data is then stored in the redux store and used to authenticate the user.
 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
 */
const SignupPage = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['signup'],
		/**
		 * The mutation function that is called when the form is submitted.
		 * It sends a POST request to the '/auth/register' endpoint with the form values.
		 * The response is expected to contain the user data as well as an access token.
		 * The user data is then stored in the redux store and used to authenticate the user.
		 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
		 */
		mutationFn: async (values: z.infer<typeof registerSchema>) => {
			return await API.post('auth/signup', values);
		},
	});

	const {
		handleSubmit,
		control,
		formState: { errors, isValid },
		reset,
	} = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
		},
		mode: 'all',
	});

	/*************  ✨ Windsurf Command ⭐  *************/
	/**
	 * Submits the signup form.
	 * Sends a POST request to the '/auth/register' endpoint with the form values.
	 * The response is expected to contain the user data as well as an access token.
	 * The user data is then stored in the redux store and used to authenticate the user.
	 * The access token is stored in local storage and used to authenticate the user on subsequent requests.
	 * @param {z.infer<typeof registerSchema>} values - The form values
	 */
	/*******  f0b235b8-5e4a-48a0-8879-2dee277d9a3d  *******/
	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		try {
			await mutateAsync(values)
				.then((res: any) => {
					toast.success(res?.data?.message);
					reset();
				})
				.catch((err: any) => {
					toast.error(err?.response?.data?.message || err?.message);
				});
		} catch (error) {}
	};

	useEffect(() => {
		document.title = 'Sign Up | Realtime Chat App '; // Set the desired title for this page
	}, []); // The empty dependency array ensures this runs only once on mount

	return (
		<AnimatedBorder>
			<div className="grid grid-cols-1 md:grid-cols-2 w-full ">
				<div className="col-span-1 md:border-r border-slate-600/30 md:p-4">
					<div className="w-full h-full flex items-center justify-center p-4 pb-6 md:p-8">
						<div className="w-full mx-w-md">
							<div className="text-center mb-8 ">
								<MessageCircleIcon className="size-10 sm:size-12 text-slate-100 mx-auto mb-2" />
								<h1 className="font-bold text-lg sm:text-2xl text-slate-100 mb-2">
									Create Account
								</h1>
								<p className="text-slate-400 text-xs md:text-sm">
									Sign Up to Create a new account
								</p>
							</div>
							<form
								className="space-y-4 sm:space-y-6 md:space-y-8"
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="space-y-1.5">
									<label htmlFor="fullname" className="auth-label">
										full name
									</label>
									<Controller
										name="firstName" // Unique name for your field
										control={control} // The control object from useForm
										render={({ field }) => (
											<div className=" relative">
												<User2 className="auth-icon" />
												<input
													id="fullname"
													type="text"
													autoFocus
													autoComplete="fullname"
													placeholder="Enter your full name"
													className={classNames('auth-input', {
														'border-red-200': errors.firstName,
													})}
													{...field}
													disabled={isPending}
												/>
											</div>
										)}
									/>
									<p className="text-red-200">{errors.firstName?.message}</p>
								</div>
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
										<span>Sign Up</span>
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
									to="/login"
									className={classNames('auth-link', {
										'pointer-events-none': isPending,
									})}
									onMouseDown={(e: MouseEvent) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									Already have an account?
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="col-span-1 hidden md:flex md:items-center md:justify-center md:flex-col md:p-8 md:bg-gradient-to-bl md:from-slate-800 md:to-slate-900">
					<div>
						<img src="signup.png" className="w-full h-auto object-cover" />
					</div>

					<div className="text-center space-y-4">
						<h1 className="text-xl font-medium text-cyan-400">
							Start Your Journey Today
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

export default SignupPage;
