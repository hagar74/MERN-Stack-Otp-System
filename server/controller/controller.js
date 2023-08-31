const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const otpGenerator = require('otp-generator');
const axios = require("axios");
const Otp = require('../models/otp');

const sign_up = async (req, res) => {
    let { firstName, lastName, email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(409)
                .send({ message: "User email already Exist!" });
        } else {

            const newUser = new User({ firstName, lastName, email });
            await newUser.save();

            const token = await new Token({
                userId: newUser._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();

            // send verification link after signup
            const url = `${process.env.BASE_URL}/signUp/${newUser.id}/verify/${token.token}`;

            await sendEmail(newUser.email, "Verify Email", url);
            res
                .status(201)
                .send({ message: "Email sent to your account please verify" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const verifyToken = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        await User.updateOne({ _id: user._id, verified: true });
        await Token.findOneAndRemove({
            userId: user._id,
            token: req.params.token
        });


        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const sendOtp = async (req, res) => {

    if (!req.body.phone) {
        return res.status(400).json({ message: "Enter Mobile number" });
    }
    const user = await User.findOne({
        phone: req.body.phone
    });
    if (user) return res.status(400).send("User already registered!");
    const OTP = otpGenerator.generate(6, {
        digits: true, alphabets: false, upperCase: false, specialChars: false
    });
    console.log(OTP);
    const phone = req.body.phone;
    const masrBokraSms = new URLSearchParams();
    masrBokraSms.append('user', 'eman');
    masrBokraSms.append('password', 'DemoNode');
    masrBokraSms.append('numbers', `+${201141094941}`);
    masrBokraSms.append('sender', 'TOGETHER');
    masrBokraSms.append('message', `Verification Code ${OTP}`);
    masrBokraSms.append('lang', 'en');

    await axios.post('http://sms.masrbokra.com/sendsms.php', masrBokraSms)

    const otp = await Otp({
        phone: phone,
        otp: OTP,
        expireAt: new Date(Date.now() + 5 * 60 * 1000) // expires in 5 mins
    });

    await otp.save();
    res.status(200).send({ message: "Otp send successfully!", otp });
}


const verifyOtp = async (req, res) => {

    const { phone, otp } = req.body;

    // validate
    if (!phone || !otp) return res.status(400).json({ error: "Invalid request" });

    // find OTP by phone number 
    const foundOtp = await Otp.findOne({ phone, otp });

    if (!foundOtp) return res.status(400).json({ error: "Invalid OTP" });

    // check expiration 
    if (foundOtp.expireAt < Date.now()) {
        return res.status(400).json({ error: "OTP expired" });
    }

    // verify success
    await Otp.findByIdAndDelete(foundOtp._id);

    return res.status(200).json({ message: "OTP verified successfully" });

}


module.exports = {
    sign_up,
    verifyToken,
    sendOtp,
    verifyOtp
};
