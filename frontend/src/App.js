import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider, useApp } from './context/AppContext';
import { MobileLayout } from './components/layout/MobileLayout';

// Pages
import OnboardingPage from './pages/OnboardingPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import OTPPage from './pages/auth/OTPPage';
import HomePage from './pages/HomePage';
import StoryViewer from './pages/story/StoryViewer';
import ChatListPage from './pages/chat/ChatListPage';
import ChatThreadPage from './pages/chat/ChatThreadPage';
import CallPage from './pages/chat/CallPage';
import WalletPage from './pages/wallet/WalletPage';
import DepositPage from './pages/wallet/DepositPage';
import WithdrawPage from './pages/wallet/WithdrawPage';
import TipsPage from './pages/wallet/TipsPage';
import StorePage from './pages/store/StorePage';
import ProductDetailPage from './pages/store/ProductDetailPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import SearchPage from './pages/search/SearchPage';

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OTPPage />} />

      {/* Main App Routes with Bottom Navigation */}
      <Route element={<MobileLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>

      {/* Story Viewer (Full Screen) */}
      <Route path="/story/:storyId" element={<StoryViewer />} />

      {/* Chat Routes */}
      <Route path="/chat/:chatId" element={<ChatThreadPage />} />
      <Route path="/call/:chatId" element={<CallPage />} />

      {/* Wallet Routes */}
      <Route path="/wallet/deposit" element={<DepositPage />} />
      <Route path="/wallet/withdraw" element={<WithdrawPage />} />
      <Route path="/wallet/tips" element={<TipsPage />} />

      {/* Store Routes */}
      <Route path="/store/:productId" element={<ProductDetailPage />} />

      {/* Profile Routes */}
      <Route path="/profile/settings" element={<SettingsPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/onboarding" replace />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App min-h-screen bg-background">
          <div className="max-w-lg mx-auto bg-background min-h-screen shadow-xl relative">
            <AppRoutes />
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
