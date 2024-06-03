import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { AppState } from '../store';
import { login } from '../store/authSlice';
import '../css/Login.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(); // Initialize translation function
    const { user, isError, isLoading, isSuccess, message } = useSelector((state: AppState) => state.auth);
    const { i18n } = useTranslation();
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hn' : 'en';
        i18n.changeLanguage(newLang);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(login({ email, password }));
    };

    useEffect(() => {
        if (isSuccess && user) {
            // Navigation logic remains the same
            if (user.type === 'jobseeker' && user.resume && user.medicalProof) {
                navigate('/jobseeker');
            } else if (user.type === 'jobseeker') {
                navigate('/upload');
            } else if (user.type === 'admin') {
                navigate('/applications');
            } else {
                navigate(`/${user.type}`);
            }
        } else if (isError) {
            console.error('Login Error:', message);
        }
        else{
            localStorage.clear();
        }
    }, [user, isSuccess, isError, navigate, message]);

    return (
        <div className="login-page">
            <div className="overview-container">
                <h1>IncluWork</h1>
                <p>
                    <strong>{t('loginPage.projectOverview')}</strong>
                    <br/>
                    {t('loginPage.projectDescription')}
                </p>
                <h2>{t('loginPage.keyFeatures')}</h2>
                <ul>
                    <li>{t('loginPage.featureList.accommodationTools')}</li>
                    <li>{t('loginPage.featureList.employerProfiles')}</li>
                    <li>{t('loginPage.featureList.employeeRegistration')}</li>
                    <li>{t('loginPage.featureList.interactiveDashboard')}</li>
                    <li>{t('loginPage.featureList.educationalResources')}</li>
                </ul>
                <Button variant="outlined" onClick={toggleLanguage}>
                    {t('loginPage.switchLanguage')}
                </Button>

            </div>
            <div className="login-container">
                <h1>{t('loginPage.login')}</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="email"
                        variant="outlined"
                        color="secondary"
                        label={t('loginPage.email')}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        type="password"
                        variant="outlined"
                        color="secondary"
                        label={t('loginPage.password')}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    {isError && <p style={{ color: 'red' }}>{t('loginPage.loginError')}: {message}</p>}
                    <div className="button-container">
                        <Button variant="outlined" color="secondary" type="submit" disabled={isLoading}>
                            {t('loginPage.login')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
