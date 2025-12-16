import { AuthProvider } from './contexts/AuthContext'
import { MessagingProvider } from './contexts/MessagingContext'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar/Navbar'
import AppRoutes from './routes/AppRoutes'

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MessagingProvider>
        <AppContent />
      </MessagingProvider>
    </AuthProvider>
  );
}

export default App
