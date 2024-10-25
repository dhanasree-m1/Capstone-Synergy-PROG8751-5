import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { Container, Row, Col, Alert } from "react-bootstrap";

const Login = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setMessage(data.message || 'Error logging in');
            }
        } catch (error) {
            setMessage('Error logging in');
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={7} className="p-0">
                    <div className="login-container">
                        <div className="login-box">
                            <img src={Logo} className="logo" alt="Logo" />
                            <h2 className="form-title mt-5 mb-2">Sign In to HomeBite</h2>
                            <h4 className="form-sub-title mb-3">
                                Sign in to enjoy the best home-cooked meals made with care!
                            </h4>
                            {message && <Alert variant="danger">{message}</Alert>}
                            <form onSubmit={handleSubmit}>
                                <InputField
                                    label="Your Email Address"
                                    name="username"
                                    type="text"
                                    value={loginData.username}
                                    onChange={handleChange}
                                    placeholder="Your Email Address"
                                    required
                                />
                                <InputField
                                    label="Your Password"
                                    name="password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    placeholder="Your Password"
                                    required
                                />
                                <Button type="submit" className="btn-primary w-100 mb-3">
                                    Let's Go!
                                </Button>
                                <div className="auth-links d-flex justify-content-between">
                                    <p>
                                        New to HomeBite? <a href="/register" className="btn btn-link">Create an account</a>
                                    </p>
                                    <a href="/forgot-password" className="btn btn-link">Forgot Password?</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </Col>
                <Col md={5} className="d-flex align-items-center justify-content-center p-0 position-relative">
                    <div className="overlay position-absolute w-100 h-100"></div>
                    <img src={loginbg} className="img-fluid login-bg w-100 h-100" alt="Background" />
                    <div id="textCarousel" className="carousel slide position-absolute mb-3" data-bs-ride="carousel">
                        <div className="carousel-inner w-50">
                            <div className="carousel-item active">
                                <div className="d-block p-3 text-white h3 text-carousel">
                                    “Home-cooked meals, made by the community, for the community.”
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="d-block p-3 text-white h3 text-carousel">
                                    Second Text Slide
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="d-block p-3 text-white h3 text-carousel">
                                    Third Text Slide
                                </div>
                            </div>
                        </div>
                        <div className='position-relative w-50 mx-3 d-flex'>
                            <button className="carousel-control-prev position-relative w-auto" type="button" data-bs-target="#textCarousel" data-bs-slide="prev">
                                <i className="material-icons">arrow_circle_left</i>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next position-relative w-auto mx-3" type="button" data-bs-target="#textCarousel" data-bs-slide="next">
                                <i className="material-icons">arrow_circle_right</i>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>
            <footer>
                <div className='d-flex justify-content-between footer-container'>
                    <p>HomeBite © All Rights Reserved</p>
                    <div className='d-flex link-color'>
                        <i className='material-icons mx-2'>email</i>
                        <p className='align-middle'>help@homebite.com</p>
                    </div>
                </div>
            </footer>
        </Container>
    );
};

export default Login;
