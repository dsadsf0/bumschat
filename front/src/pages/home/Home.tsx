import { Link } from "react-router-dom"

const Home = (): JSX.Element => {
	return (
	<div>
		Home <br/>
		<Link to={'/login'}>login</Link>
	</div>
	)
}

export default Home