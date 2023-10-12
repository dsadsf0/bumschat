import Chat from "@/pages/chat";
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
import Recovery from "@/pages/recovery";
import Welcome from "@/pages/welcome";

const App = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const {auth: IsAuthChecking} = useAppSelector(getUserStateLoading);

	useEffect(() => {
		dispatch(UserService.authCheck());
	}, []);

	if (IsAuthChecking) {
		return (
			<Loader/>
		)
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path={mainRoutes.welcome} element={<Welcome />} />
				<Route path={mainRoutes.chats} element={<Chat />} />
				<Route path={mainRoutes.login} element={<Login />} />
				<Route path={mainRoutes.signup} element={<Signup />} />
				<Route path={mainRoutes.recovery} element={<Recovery />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
