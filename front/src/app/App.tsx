import { userSocket } from "@/main";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import mainRoutes from "@/routes/mainRoutes";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = (): JSX.Element => {
	useEffect(() => {
		userSocket.on('hello', msg => {
			console.log(msg);
		});
	}, [])

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
