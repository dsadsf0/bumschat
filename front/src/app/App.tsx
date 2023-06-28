import Home from "@/pages/home"
import Login from "@/pages/login"
import Signup from "@/pages/signup/Signup"
import mainRoutes from "@/routes/mainRoutes"
import { BrowserRouter, Route, Routes } from "react-router-dom"


const App = (): JSX.Element => {

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
