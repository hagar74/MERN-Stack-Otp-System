import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const OtpVerify = ({ phone }) => {
    const [otp, setOtp] = useState({ otp: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setOtp({ ...otp, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/verify-otp', {
                phone, // retrieved from signup
                otp
            });

        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Enter Your Code! </h1>
                        <input
                            type="string"
                            placeholder="verify"
                            name="otp"
                            value={otp.otp}
                            onChange={handleChange}
                            className={styles.input}
                        />


                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Verify Me
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here ?</h1>
                    <Link to="/main">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
