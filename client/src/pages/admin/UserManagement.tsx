import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Trash2, UserCog, UserPlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
    _id: string;
    username: string;
    email: string;
    role: string;
}

const UserManagement = () => {
    const { token, isAdmin } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

    const fetchUsers = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                if (res.status === 403) {
                    toast({ title: "Access Denied", description: "Admin privileges required", variant: "destructive" });
                } else {
                    toast({ title: "Error", description: "Could not fetch users", variant: "destructive" });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) fetchUsers();
    }, [token, isAdmin]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast({ title: "User deleted" });
                setUsers(users.filter(u => u._id !== id));
            } else {
                toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleRole = async (user: UserData) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            const res = await fetch(`/api/admin/users/${user._id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            if (res.ok) {
                toast({ title: "Role updated", description: `User is now ${newRole}` });
                fetchUsers();
            } else {
                toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.username || !newUser.email || !newUser.password) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                toast({ title: "Success", description: "User created successfully" });
                setShowAddDialog(false);
                setNewUser({ username: '', email: '', password: '', role: 'user' });
                fetchUsers();
            } else {
                const data = await res.json();
                toast({ title: "Error", description: data.message || "Failed to create user", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">User Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage system access and roles
                        </p>
                    </div>
                    <Button onClick={() => setShowAddDialog(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <div className="soc-card p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => toggleRole(user)}>
                                            <UserCog className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {users.length === 0 && !isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Add User Dialog */}
                {showAddDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add New User</h2>
                                <button onClick={() => setShowAddDialog(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full px-3 py-2 bg-muted/20 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1">Create User</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default UserManagement;
