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
import Loader from "@/components/UI/loader";
import { getUserStateLoading } from "@/store/user/UserSelector";

const App = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const {auth: IsAuthChecking} = useAppSelector(getUserStateLoading)

	useEffect(() => {
		dispatch(UserService.authCheck());

		userSocket.on('hello', msg => {
			console.log(msg);
		});

	}, []);

	if (IsAuthChecking) {
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
