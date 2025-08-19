import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import NotFound from './pages/NotFound';
import AllTools from './pages/tools/AllTools';
import Exchange from './pages/exchange/Exchange';
import { ProtectedRoute, PublicRoute } from '../src/route/ProtectedRoute'
import Cart from './pages/Cart';
import ToolDetails from './pages/tools/ToolDetails';
import Notification from './pages/Notification';
import SessionManager from './components/SessionManager';
import UserProblem from './pages/problem/UserProblem';
import Problems from './pages/problem/Problems';
import Solutions from './pages/solution/Solutions';
import ProblemSolutions from './pages/problem/ProblemSolutions';
import ProblemById from './pages/problem/ProblemById';
import SolutionForProblem from './pages/solution/SolutionForProblem';
import OthersProblem from './pages/problem/OtherProblem';
import ProblemByIdPublic from './pages/problem/ProblemByIdPublic';
import UsersTools from './pages/tools/UsersTools';
import OthersTools from './pages/tools/OthersTool';
import PublicProfile from './pages/about/PublicProfile';
import Splash from './Splash';

function App() {
  return (
    <Router>
      <SessionManager />
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            {/* <Home /> */}
            <Splash/>
          </PublicRoute>
        } />
         <Route path="/7empire-mobile-care" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about-us" element={<PublicProfile />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/allTools"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllTools />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/others-tools"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OthersTools />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users-tools"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UsersTools />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Problems />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solutions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Solutions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/others-problems"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OthersProblem />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:problemId"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProblemById />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/solution"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SolutionForProblem />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:problemId/public"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProblemByIdPublic />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem/:problemId/solutions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProblemSolutions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-problem"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserProblem />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exchange"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Exchange />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Cart />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tool_details/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ToolDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Notification />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-problems"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserProblem />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
