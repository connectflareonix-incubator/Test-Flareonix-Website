import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../adminApi';
import { Card, SectionHeader, GhostButton, TextInput, Select, Loader, Empty, Pill } from '../ui';
import { downloadCSV } from '../csvUtil';
import { toast } from 'sonner';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('all');

  const load = async () => setUsers(await adminApi.listUsers());
  useEffect(() => { load(); }, []);

  const ban = async (u) => { await adminApi.updateUser(u.user_id, { is_banned: !u.is_banned }); toast.success(u.is_banned ? 'Unbanned' : 'Banned'); load(); };
  const promote = async (u) => { if (window.confirm('Make admin?')) { await adminApi.updateUser(u.user_id, { role: 'admin' }); load(); } };

  const filtered = useMemo(() => {
    return (users || []).filter((u) => {
      if (role !== 'all' && u.role !== role) return false;
      if (q && !(u.name?.toLowerCase().includes(q.toLowerCase()) || u.email?.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [users, q, role]);

  if (users === null) return <Loader />;

  return (
    <div data-testid="admin-users">
      <SectionHeader title="Users" actions={[
        <GhostButton key="csv" onClick={() => downloadCSV(filtered, 'users.csv')}>Export CSV</GhostButton>,
      ]} />
      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          <TextInput placeholder="Search name or email..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
          <Select value={role} onChange={(e) => setRole(e.target.value)} className="max-w-[200px]">
            <option value="all">All roles</option><option value="user">User</option><option value="admin">Admin</option>
          </Select>
        </div>
        {filtered.length === 0 ? <Empty /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-white/60"><tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Joined</th><th className="p-2">Status</th><th></th></tr></thead>
              <tbody>{filtered.map((u) => (
                <tr key={u.user_id} className="border-t border-white/5">
                  <td className="p-2 flex items-center gap-2">
                    {u.picture ? <img src={u.picture} alt="" className="h-6 w-6 rounded-full" /> : <div className="h-6 w-6 rounded-full bg-white/10" />}
                    {u.name}
                  </td>
                  <td className="p-2 text-white/70">{u.email}</td>
                  <td className="p-2"><Pill color={u.role === 'admin' ? 'orange' : 'gray'}>{u.role}</Pill></td>
                  <td className="p-2 text-white/50">{(u.created_at || '').slice(0, 10)}</td>
                  <td className="p-2"><Pill color={u.is_banned ? 'red' : 'green'}>{u.is_banned ? 'banned' : 'active'}</Pill></td>
                  <td className="p-2 text-right">
                    <button onClick={() => ban(u)} className="text-xs text-yellow-400 hover:underline mr-3">{u.is_banned ? 'Unban' : 'Ban'}</button>
                    {u.role !== 'admin' && <button onClick={() => promote(u)} className="text-xs text-[#FF6B00] hover:underline">Promote</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
