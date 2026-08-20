import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProfileProvider, useAuthProfile } from './context/AuthProfileContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatProvider } from './context/ChatContext';
import { RoomProvider } from './context/RoomContext';
import { ArchiveProvider } from './context/ArchiveContext';
import { ContinuityProvider } from './context/ContinuityContext';

import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingOnboarding } from './pages/LandingOnboarding';
import { InboxPage } from './pages/InboxPage';
import { ChatThreadPage } from './pages/ChatThreadPage';
import { RoomsListPage } from './pages/RoomsListPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ArchiveBrowserPage } from './pages/ArchiveBrowserPage';
import { ArchiveEraPage } from './pages/ArchiveEraPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { AvatarPage } from './pages/AvatarPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SafetyHubPage } from './pages/SafetyHubPage';
import { BlockedPage } from './pages/BlockedPage';
import { MutedPage } from './pages/MutedPage';
import { ClueNotebookPage } from './pages/ClueNotebookPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AppearanceSettings } from './pages/settings/AppearanceSettings';
import { SoundSettings } from './pages/settings/SoundSettings';
import { AccessibilitySettings } from './pages/settings/AccessibilitySettings';
import { DataExportPage } from './pages/settings/DataExportPage';
import { InternalDevPage } from './pages/internal/InternalDevPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { HelpArticlePage } from './pages/HelpArticlePage';
import { AppErrorBoundary } from './components/common/AppErrorBoundary';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded, isLoading } = useAuthProfile();

  if (isLoading) {
    return (
      <div className="app-viewport flex-1 flex items-center justify-center bg-night-bg text-night-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono tracking-wider">MOUNTING_AFTERHOURS</span>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AppErrorBoundary>
    <SettingsProvider>
      <AuthProfileProvider>
        <NotificationProvider>
          <ChatProvider>
            <RoomProvider>
              <ArchiveProvider>
                <ContinuityProvider>
                  <AppShell>
                    <Routes>
                    {/* Public Landing & Onboarding */}
                    <Route path="/" element={<LandingOnboarding />} />

                    {/* Authenticated Routes */}
                    <Route
                      path="/app"
                      element={
                        <ProtectedRoute>
                          <InboxPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chats"
                      element={
                        <ProtectedRoute>
                          <InboxPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chats/:threadId"
                      element={
                        <ProtectedRoute>
                          <ChatThreadPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rooms"
                      element={
                        <ProtectedRoute>
                          <RoomsListPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/rooms/:roomId"
                      element={
                        <ProtectedRoute>
                          <RoomDetailPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/archive"
                      element={
                        <ProtectedRoute>
                          <ArchiveBrowserPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/archive/:era"
                      element={
                        <ProtectedRoute>
                          <ArchiveEraPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <SearchPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile/edit"
                      element={
                        <ProtectedRoute>
                          <ProfileEditPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/avatar"
                      element={
                        <ProtectedRoute>
                          <AvatarPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookmarks"
                      element={
                        <ProtectedRoute>
                          <BookmarksPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/safety"
                      element={
                        <ProtectedRoute>
                          <SafetyHubPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/blocked"
                      element={
                        <ProtectedRoute>
                          <BlockedPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/muted"
                      element={
                        <ProtectedRoute>
                          <MutedPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/appearance"
                      element={
                        <ProtectedRoute>
                          <AppearanceSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/sound"
                      element={
                        <ProtectedRoute>
                          <SoundSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/accessibility"
                      element={
                        <ProtectedRoute>
                          <AccessibilitySettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/data"
                      element={
                        <ProtectedRoute>
                          <DataExportPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/internal"
                      element={
                        <ProtectedRoute>
                          <InternalDevPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/internal/continuity"
                      element={
                        <ProtectedRoute>
                          <InternalDevPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/internal/moderation"
                      element={
                        <ProtectedRoute>
                          <InternalDevPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/notebook"
                      element={
                        <ProtectedRoute>
                          <ClueNotebookPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activities"
                      element={
                        <ProtectedRoute>
                          <ActivitiesPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Help Center Routes */}
                    <Route path="/help" element={<HelpCenterPage />} />
                    <Route path="/help/:slug" element={<HelpArticlePage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppShell>
              </ContinuityProvider>
            </ArchiveProvider>
          </RoomProvider>
        </ChatProvider>
      </NotificationProvider>
    </AuthProfileProvider>
    </SettingsProvider>
    </AppErrorBoundary>
);
};
export default App;
