import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/layout/Header';
import Profile from './components/pages/Profile/Profile';
import Absences from './components/pages/Absences/Absences';
import App from './App';
import {auth} from './firebase';
import {AuthProvider} from './context/Context';
import Dashboard from "./components/pages/Dashboard/Dashboard";
import EditPopup from "./components/pages/WorkHours/EditPopup";


test('renders learn react link', () => {

    expect(true).toBe(true);
    ;
});

describe('Frontend tests', () => {

// ------------------------------HEADER---------------------------------------
// Mocking auth.signOut function to prevent actual logout
    jest.mock('./firebase', () => ({
        auth: {
            signOut: jest.fn(),
        },
    }));

    describe('Header Component', () => {
        const mockSetRole = jest.fn();
        const mockSetIsAuthenticated = jest.fn();

        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test to avoid any residual effect
        });

        it('should render the correct links for admin role', () => {
            // Render Header with admin role
            render(
                <Router>
                    <Header role="admin" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated}/>
                </Router>
            );

            // Check if "Nadzorna plošča" link is rendered for admin
            expect(screen.getByText(/Nadzorna plošča/i)).toBeInTheDocument();
            // Check if "Moje ure" link is rendered
            expect(screen.getByText(/Moje ure/i)).toBeInTheDocument();
            // Check if "Moji dopusti/bolniške" link is rendered
            expect(screen.getByText(/Moji dopusti\/bolniške/i)).toBeInTheDocument();
            // Check if "Odjava" button is rendered
            expect(screen.getByText(/Odjava/i)).toBeInTheDocument();
        });

        it('should render the correct links for non-admin role', () => {
            // Render Header with non-admin role
            render(
                <Router>
                    <Header role="user" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated}/>
                </Router>
            );

            // Check if "Nadzorna plošča" link is NOT rendered
            expect(screen.queryByText(/Nadzorna plošča/i)).not.toBeInTheDocument();
            // Check if "Moje ure" link is rendered
            expect(screen.getByText(/Moje ure/i)).toBeInTheDocument();
            // Check if "Moji dopusti/bolniške" link is rendered
            expect(screen.getByText(/Moji dopusti\/bolniške/i)).toBeInTheDocument();
            // Check if "Odjava" button is rendered
            expect(screen.getByText(/Odjava/i)).toBeInTheDocument();
        });

        it('should call logout functions when logout button is clicked', () => {
            render(
                <Router>
                    <Header role="admin" setRole={mockSetRole} setIsAuthenticated={mockSetIsAuthenticated}/>
                </Router>
            );

            const logoutButton = screen.getByText(/Odjava/i);

            fireEvent.click(logoutButton);

            // Check if signOut function was called
            //expect(auth.signOut).toHaveBeenCalledTimes(1);
            // Check if setRole function was called with null
            expect(mockSetRole).toHaveBeenCalledWith(null);
            // Check if setIsAuthenticated function was called with false
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
        });
    });
//-------------------------------------------------------------------------

//----------------------------ABSENCES-------------------------------------
    describe('Absences Component', () => {
        it('should render the table with correct headers', () => {
            render(<Absences/>);

            // Check if the table headers are rendered correctly
            expect(screen.getByText(/Ime in Priimek/i)).toBeInTheDocument();
            expect(screen.getByText(/Vrsta odsotnosti/i)).toBeInTheDocument();
            expect(screen.getByText(/Datum od/i)).toBeInTheDocument();
            expect(screen.getByText(/Datum do/i)).toBeInTheDocument();
        });

        it('should display the absence data in the table', () => {
            render(<Absences/>);

            // Use getAllByText to check for multiple instances of "Bolniška"
            const absenceTypes = screen.getAllByText(/Bolniška/i);
            expect(absenceTypes.length).toBe(2); // Expect two "Bolniška" entries
        });
    });
//--------------------------------------------------------------------------

//---------------------------LEAVE----------------------------------------
    describe('Leave Data', () => {
        it('should render leave type correctly', () => {
            render(<Dashboard/>);
            // Check if leave data is rendered correctly
            expect(screen.getByText('Sick Leave')).toBeInTheDocument();
            expect(screen.getByText('Vacation')).toBeInTheDocument();
        });

        it('should render leave details (employee, dates) correctly', () => {
            render(<Dashboard/>);
            // Check if leave details (employee, type, start and end dates) are displayed
            expect(screen.getByText('Janez Novak')).toBeInTheDocument();
            expect(screen.getByText('2023-09-10')).toBeInTheDocument();
            expect(screen.getByText('2023-09-15')).toBeInTheDocument();

            expect(screen.getByText('Ana Kovač')).toBeInTheDocument();
            expect(screen.getByText('2023-10-01')).toBeInTheDocument();
            expect(screen.getByText('2023-10-07')).toBeInTheDocument();
        });
    });
//--------------------------------------------------------------------------

//-----------------EDITPOPUP--------------------------
    test('EditPopup component: should call onSave when Save button is clicked and onClose when Cancel button is clicked', () => {
        const mockSave = jest.fn();
        const mockClose = jest.fn();
        const mockWorkDay = {
            date: '2023-11-19',
            hours: 8,
            overtime: 2
        };

        render(<EditPopup workDay={mockWorkDay} onClose={mockClose} onSave={mockSave}/>);

        // Simulate user interaction
        fireEvent.click(screen.getByText(/Save/i));

        // Check if the onSave function is called
        expect(mockSave).toHaveBeenCalledWith({
            date: '2023-11-19',
            hours: 8,
            overtime: 2
        });

        // Check if the onClose function is called
        expect(mockClose).toHaveBeenCalled();

        // Simulate Cancel button click
        fireEvent.click(screen.getByText(/Cancel/i));

        // Check if the onClose function is called
        expect(mockClose).toHaveBeenCalledTimes(2);
    });
//-------------------------------------------------------------------------
//------------------------DASHBOARD----------------------------------------
    describe('Dashboard Component', () => {

        describe('Employee Data', () => {
            it('should render employee name correctly', () => {
                render(<Dashboard />);
                // Check if employee names are rendered correctly
                expect(screen.getByText('Eva Horvat')).toBeInTheDocument();
            });

            it('should render total hours and overtime correctly', () => {
                render(<Dashboard />);
                // Check if total hours and overtime for employee are displayed correctly
                expect(screen.getByText('140 ur')).toBeInTheDocument();
                expect(screen.getByText('5 ur')).toBeInTheDocument();
            });
        });
    });


//-----------------------DODATNO - PROFILE---------------------------------
    describe('Profile component', () => {

        // Mock za Firebase Auth
        //jest.mock('./firebase', () => ({
          //  auth: {
            //    onAuthStateChanged: jest.fn((callback) => callback(null)), // Simuliraj neavtentificiranega uporabnika
           // },
        //}));

        const mockSetRole = jest.fn();
        const mockSetIsAuthenticated = jest.fn();

        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks after each test to avoid any residual effect
        });

        // 1. Test za vidnost povezave do profila za prijavljene uporabnike
        it('displays profile link for authenticated users', () => {
            render(
                <Router>
                    <Header role="user" setRole={jest.fn()} setIsAuthenticated={jest.fn()}/>
                </Router>
            );

            // Preveri, ali je povezava do profila vidna za prijavljene uporabnike
            const profileLink = screen.getByText(/Profil/i);
            expect(profileLink).toBeInTheDocument();
        });

        // 2. Test za renderiranje začetnih podatkov uporabnika.
        it('renders user data and allows editing', () => {
            // Render Profile komponento
            render(<Profile/>);

            // Preveri začetne vrednosti
            expect(screen.getByLabelText(/Ime:/i)).toHaveValue('Janez Novak');
            expect(screen.getByLabelText(/E-pošta:/i)).toHaveValue('janez.novak@example.com');
            expect(screen.getByLabelText(/Vloga:/i)).toHaveValue('User');

            // Spremeni ime in e-pošto
            fireEvent.change(screen.getByLabelText(/Ime:/i), {target: {value: 'Nov Ime'}});
            fireEvent.change(screen.getByLabelText(/E-pošta:/i), {target: {value: 'nov.email@example.com'}});

            // Preveri, ali so vrednosti posodobljene
            expect(screen.getByLabelText(/Ime:/i)).toHaveValue('Nov Ime');
            expect(screen.getByLabelText(/E-pošta:/i)).toHaveValue('nov.email@example.com');
        });

        // 3. Test za prikazovanje komponente `Profile` ob obisku `/profile` (prijavljen uporabnik)
        it('renders profile page for authenticated users', () => {
            render(
                <Router>
                    <Profile/>
                </Router>
            );

            // Preveri, ali je komponenta Profile prikazana
            expect(screen.getByText(/Profil/i)).toBeInTheDocument();
        });

        // 4. Test za prikazovanje povezave do profila po prijavi
        it('displays profile link after login', async () => {
            // Simuliraj prijavo uporabnika
            auth.onAuthStateChanged = jest.fn((callback) => {
                callback({uid: '123'});
            });

            render(
                <Router>
                    <Header role="user" setRole={jest.fn()} setIsAuthenticated={jest.fn()}/>
                </Router>
            );

            // Preveri, ali je povezava do profila vidna po prijavi
            const profileLink = screen.getByText(/Profil/i);
            expect(profileLink).toBeInTheDocument();
        });

        // 5. Test za delovanje gumba za odjavo
        it('logout button works correctly', () => {
            const mockSetIsAuthenticated = jest.fn();
            const mockSetRole = jest.fn();

            render(
                <Router>
                    <Header
                        role="user"
                        setRole={mockSetRole}
                        setIsAuthenticated={mockSetIsAuthenticated}
                    />
                </Router>
            );

            // Simuliraj klik na gumb za odjavo
            fireEvent.click(screen.getByText(/Odjava/i));

            // Preveri, ali se je odjava izvedla in so bile funkcije klicane
            expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
            expect(mockSetRole).toHaveBeenCalledWith(null);
        });
    });
});