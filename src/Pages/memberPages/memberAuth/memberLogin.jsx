import React from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStateContext } from '../../../contexts/contextProvider';

// Define Zod schema for login validation
const loginSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be less than or equal to 20 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password must be less than or equal to 100 characters" }),
});

const MemberLoginForm = ({ onLogin }) => {
    // eslint-disable-next-line no-unused-vars
    const { setRole } = useStateContext();
    const navigate = useNavigate();

    const { register: login, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    // Use React Query for login mutation
    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/auth/member/login`, data);
            return response.data;
        },
        onSuccess: (data) => {
            const { token, memberID } = data;
            if (token && memberID) {
                localStorage.setItem('token', token);
                localStorage.setItem('isLoggedIn', 'true');
                setRole('member');
                localStorage.setItem('role', 'member');
                localStorage.setItem('userId', memberID);
                onLogin(token);
                toast.success("Login successful!");
                navigate('/task_management/dashboard');
            }
        },
        onError: (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error(error.response.data.error);
            } else if (error.response) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Unable to connect to the server. Please try again later.");
            }
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        loginMutation.mutate(data);
    };

    return (
        <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
            <div className="md:w-1/3 max-w-sm">
                <img
                    src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                    alt="Sample" />
            </div>
            <div className="md:w-1/3 max-w-sm">
                <div className="text-center md:text-left">
                    <label className="mr-1 text-2xl dark:text-white">Member Login</label>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <input
                            className="text-sm w-full mt-5 px-4 py-2 border border-solid border-gray-300 rounded"
                            type="text"
                            id="username"
                            {...login("username")}
                            placeholder="username"
                        />
                        {errors.username && <span className="text-xs ml-2 text-red-500">{errors.username.message}</span>}
                    </div>

                    <div>
                        <input
                            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                            type="password"
                            placeholder="Password"
                            {...login("password")}
                        />
                        {errors.password && <span className="text-xs ml-2 text-red-500">{errors.password.message}</span>}
                    </div>

                    <div className="mt-4 flex justify-between font-semibold text-sm">
                        <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
                            <input className="mr-1" type="checkbox" />
                            <span>Remember Me</span>
                        </label>
                        <a href="/" className="dark:text-gray-400">Forgot Password?</a>
                    </div>
                    <div className="text-center md:text-left">
                        <button
                            className={`mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider ${loginMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            type="submit"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div className="mt-2 font-semibold text-sm text-slate-500 text-center md:text-left">
                        Are you a Admin?
                        <Link className="text-blue-600 hover:underline hover:underline-offset-4" to="/admin/login"> Go to Admin Login</Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default MemberLoginForm;
