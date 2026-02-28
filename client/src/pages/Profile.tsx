import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="soc-card text-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{user?.username}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                <Shield className="h-4 w-4" />
                {user?.role || 'User'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="soc-card">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                  <Mail className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                  <Shield className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded">
                  <Calendar className="h-5 w-5 text-info" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="soc-card">
              <h3 className="text-xl font-semibold mb-4">Security Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded text-center">
                  <p className="text-3xl font-bold text-primary">156</p>
                  <p className="text-sm text-muted-foreground">Threats Blocked</p>
                </div>
                <div className="p-4 bg-muted/20 rounded text-center">
                  <p className="text-3xl font-bold text-accent">42</p>
                  <p className="text-sm text-muted-foreground">Scans Completed</p>
                </div>
                <div className="p-4 bg-muted/20 rounded text-center">
                  <p className="text-3xl font-bold text-warning">8</p>
                  <p className="text-sm text-muted-foreground">Incidents Resolved</p>
                </div>
                <div className="p-4 bg-muted/20 rounded text-center">
                  <p className="text-3xl font-bold text-info">23</p>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
