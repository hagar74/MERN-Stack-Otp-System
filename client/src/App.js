import { Navigate, Route, Routes } from "react-router-dom";
import EmailVerify from "./components/EmailVerify";
import Login from "./components/Login";
import Main from "./components/Main";

import Otp from "./components/Otp/otp";
import OtpVerify from "./components/OtpVerify/otpVerify";
import Signup from "./components/Singup";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/otp" exact element={<Otp />} />
			<Route path="/otpVerify" exact element={<OtpVerify />} />
			<Route path="/" element={<Navigate replace to="/Signup" />} />
			<Route path="/signUp/:id/verify/:token" element={<EmailVerify />} />
		</Routes>
	);
}

export default App;
