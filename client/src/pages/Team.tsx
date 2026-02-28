import MainLayout from '@/components/layout/MainLayout';
import { Users, Mail, Shield, UserPlus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const Team = () => {
  const { token } = useAuth();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'User' });
  const [teamMembers, setTeamMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const users = await res.json();
        const formattedUsers = users.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          role: user.role || 'User',
          status: 'online'
        }));
        setTeamMembers(formattedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: inviteForm.name,
          email: inviteForm.email,
          password: 'TempPassword123!',
          role: inviteForm.role.toLowerCase()
        })
      });
      
      if (res.ok) {
        setMessage(`✅ Invitation sent to ${inviteForm.email}`);
        setShowInviteDialog(false);
        setInviteForm({ name: '', email: '', role: 'User' });
        fetchTeamMembers();
      } else {
        const data = await res.json();
        setMessage(`❌ Failed: ${data.message || 'Could not invite user'}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send invitation');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your security team members</p>
          </div>
          <button onClick={() => setShowInviteDialog(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="soc-card text-center">
            <div className="text-4xl font-bold text-primary">{teamMembers.length}</div>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </div>
          <div className="soc-card text-center">
            <div className="text-4xl font-bold text-accent">{teamMembers.filter(m => m.status === 'online').length}</div>
            <p className="text-sm text-muted-foreground">Online Now</p>
          </div>
          <div className="soc-card text-center">
            <div className="text-4xl font-bold text-warning">{teamMembers.filter(m => m.role === 'admin').length}</div>
            <p className="text-sm text-muted-foreground">Administrators</p>
          </div>
        </div>

        {message && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded text-center">
            {message}
          </div>
        )}

        <div className="soc-card">
          <h3 className="text-xl font-semibold mb-4">Team Members</h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading team members...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No team members found</div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        member.status === 'online' ? 'bg-accent' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.role === 'admin' ? 'bg-destructive/20 text-destructive' :
                      member.role === 'analyst' ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Shield className="h-3 w-3 inline mr-1" />
                      {member.role}
                    </div>
                    <span className={`text-xs ${member.status === 'online' ? 'text-accent' : 'text-muted-foreground'}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invite Dialog */}
        {showInviteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Invite Team Member</h2>
                <button onClick={() => setShowInviteDialog(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="user">User</option>
                    <option value="analyst">Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    Send Invitation
                  </button>
                  <button type="button" onClick={() => setShowInviteDialog(false)} className="flex-1 px-4 py-2 bg-muted/20 rounded hover:bg-muted/30 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Team;
