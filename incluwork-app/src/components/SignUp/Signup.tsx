import { SetStateAction, useState} from 'react';
import EmployerSignup from './EmployerSignup.tsx';
import JobSeekerSignup from './JobSeekerSignup.tsx';
import './../../css/Signup.css'; // Import CSS file for styling


const SignupPage = () => {
    const [selectedOption, setSelectedOption] = useState('employer');

    const handleOptionSelect = (option: SetStateAction<string>) => {
        setSelectedOption(option);
    };

    return (
        <div className="signup-page">
            <h1>Sign Up for {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}</h1>
            <div className="signup-options">
                <button
                    className={selectedOption === 'employer' ? 'selected' : ''}
                    onClick={() => handleOptionSelect('employer')}
                >
                    Sign Up as Employer
                </button>
                <button
                    className={selectedOption === 'jobSeeker' ? 'selected' : ''}
                    onClick={() => handleOptionSelect('jobSeeker')}
                >
                    Sign Up as Job Seeker
                </button>
            </div>

            {selectedOption === 'employer' && <EmployerSignup />}
            {selectedOption === 'jobSeeker' && <JobSeekerSignup />}
        </div>
    );
};

export default SignupPage;