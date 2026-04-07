import type { JSX } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Food from './pages/Food';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import authService from './services/authService';
import './App.css';

function PrivateRoute({ children }: { children: JSX.Element }) {
    return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function AuthRoute({ children }: { children: JSX.Element }) {
    return !authService.isAuthenticated() ? (
        children
    ) : (
        <Navigate to="/dashboard" />
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <AuthRoute>
                            <Register />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/food"
                    element={
                        <PrivateRoute>
                            <Food />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/food/:id"
                    element={
                        <PrivateRoute>
                            <FoodDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute>
                            <Cart />
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
