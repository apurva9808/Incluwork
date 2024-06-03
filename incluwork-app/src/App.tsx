import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/SignUp/Signup.tsx';
import Employer from './components/HomePages/Employer.tsx';
import Jobseeker from './components/HomePages/Jobseeker.tsx';
import Navbar from "./components/Common/Navbar.tsx";
import Unauthorized from './components/Common/Unauthorized.tsx';

//Admin imports
import Applications from './components/Admin/Applications.tsx';
import User from './components/Admin/User.tsx';
import Jobs from './components/Admin/Jobs.tsx';
import ViewProfiles from './components/Admin/ViewProfiles.tsx'


//JobSeeker imports
import JobCards from './components/HomePages/Jobseeker.tsx';
import Upload from './components/SignUp/JobseekerUpload.tsx';
import ApplicationsView from './components/JobSeeker/Jobapplications.tsx';
import JobOffers from './components/JobSeeker/Joboffers.tsx';


//Employer imports
import CreateJob from "./components/Employer/CreateJob.tsx";
import JobApplications from './components/Employer/JobListingApplications.tsx';
import EmployeesComponent from './components/Employer/Employees.tsx';
import EmployerProfile from './components/Employer/EmployerProfile.tsx';
import JobseekerProfile from './components/JobSeeker/JobseekerProfile.tsx';


function App() {
    return (
        <Router>
            <div>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/employer" element={<Employer/>}/>
                    <Route path="/jobseeker" element={<Jobseeker/>}/>
                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                    <Route path="/upload" element={<Upload/>}/>
                    <Route path="/create-job" element={<CreateJob/>}/>
                    <Route path="/applications" element={<Applications />}/>
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/users" element={<User />} />
                    <Route path="/jobseekerhome" element={<JobCards />}/>
                    <Route path="/viewapplications" element={<JobApplications />} />
                    <Route path="/verifyprofiles" element={<ViewProfiles/>}/>
                    <Route path="/jobapplications" element={<ApplicationsView/>}/>
                    <Route path="/employees" element={<EmployeesComponent />} />
                    <Route path="/joboffers" element={<JobOffers/>}/>
                    <Route path="/empprofile" element={<EmployerProfile/>}/>
                    <Route path="/jobseekerprofile" element={<JobseekerProfile />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
