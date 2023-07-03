import { userSocket } from "@/main";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import mainRoutes from "@/routes/mainRoutes";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppDispatch } from './../hooks/useStore';
import { UserService } from '@/api/services/UserService';
import { useAppSelector } from '@/hooks/useStore';
import { getUserLoading } from "@/store/user/UserSelector";
import Loader from "@/components/UI/loader";

const App = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const isUserLoading = useAppSelector(getUserLoading)

	useEffect(() => {
		dispatch(UserService.authCheck());

		userSocket.on('hello', msg => {
			console.log(msg);
		});

	}, []);

	if (isUserLoading) {
		return (
			<Loader/>
		)
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path={mainRoutes.home} element={<Home />} />
				<Route path={mainRoutes.login} element={<Login />} />
				<Route path={mainRoutes.signup} element={<Signup />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
