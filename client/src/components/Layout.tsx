import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, FileText, Briefcase, LogOut, ChevronDown, Camera, ClipboardCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IntuitLogo } from './IntuitLogo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { RubricTracker } from './RubricTracker';
import { getImpacts } from '@/lib/api';
import type { Impact } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showRubricTracker, setShowRubricTracker] = useState(false);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const featuresDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load impacts when drawer opens
  useEffect(() => {
    if (showRubricTracker) {
      getImpacts({}).then(setImpacts).catch(console.error);
    }
  }, [showRubricTracker]);

  // Get user initials from email
  const getInitials = (email: string | undefined) => {
    if (!email) return '?';
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Load avatar on mount
  useEffect(() => {
    if (user?.id) {
      loadAvatar();
    }
  }, [user?.id]);

  async function loadAvatar() {
    if (!user?.id) return;

    const { data } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`${user.id}/avatar`);

    // Check if avatar exists by trying to fetch it
    try {
      const response = await fetch(data.publicUrl, { method: 'HEAD' });
      if (response.ok) {
        setAvatarUrl(data.publicUrl + '?t=' + Date.now());
      }
    } catch {
      // Avatar doesn't exist, use initials
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .upload(`${user.id}/avatar`, file, { upsert: true });

      if (error) throw error;

      // Refresh avatar URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(`${user.id}/avatar`);

      setAvatarUrl(data.publicUrl + '?t=' + Date.now());
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Make sure the avatars storage bucket exists in Supabase.');
    } finally {
      setUploading(false);
      setDropdownOpen(false);
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target as Node)) {
        setFeaturesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/new', label: 'New Assessment', icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <IntuitLogo className="h-6 text-[#236CFF]" />
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}

              {/* Other Features Dropdown */}
              <div className="relative" ref={featuresDropdownRef}>
                <button
                  onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    featuresDropdownOpen || ['/summary', '/framework'].includes(location.pathname)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  Other Features
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform",
                    featuresDropdownOpen && "rotate-180"
                  )} />
                </button>

                {featuresDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/summary"
                      onClick={() => setFeaturesDropdownOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                        location.pathname === '/summary'
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      Summary
                    </Link>
                    <button
                      onClick={() => {
                        setFeaturesDropdownOpen(false);
                        setShowRubricTracker(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Tracker
                    </button>
                    <Link
                      to="/framework"
                      onClick={() => setFeaturesDropdownOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                        location.pathname === '/framework'
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Briefcase className="h-4 w-4" />
                      Rubric
                    </Link>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="ml-4 pl-4 border-l border-gray-200 relative" ref={dropdownRef}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                      {getInitials(user?.email)}
                    </div>
                  )}
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    dropdownOpen && "rotate-180"
                  )} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      {uploading ? 'Uploading...' : avatarUrl ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Rubric Tracker Drawer */}
      {showRubricTracker && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            style={{ zIndex: 9998 }}
            onClick={() => setShowRubricTracker(false)}
          />
          {/* Drawer */}
          <div
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-xl overflow-y-auto"
            style={{ zIndex: 9999 }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary-500" />
                Rubric Coverage Tracker
              </h2>
              <button
                onClick={() => setShowRubricTracker(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <RubricTracker impacts={impacts} />
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
