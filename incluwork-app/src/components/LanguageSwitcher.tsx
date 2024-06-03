import React from 'react';
import {useTranslation} from "react-i18next";

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    return (
        <div>
            <button onClick={() => changeLanguage('en')}>English</button>
            <button onClick={() => changeLanguage('hn')}>Deutsch</button>
        </div>
    );
};

export default LanguageSwitcher;
