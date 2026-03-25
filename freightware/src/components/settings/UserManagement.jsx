'use client';

import { useState } from 'react';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import HelpIcon from '@/components/shared/HelpIcon';
import { useToast } from '@/components/shared/ToastProvider';
import { teamMembers as initialMembers, roles } from '@/data/mockSettings';
import { UserPlus, Save, X } from 'lucide-react';

const inputCls =
  'w-full bg-fw-bg border border-fw-border rounded-md px-3 py-2 text-sm text-fw-text placeholder:text-fw-text-muted focus:outline-none focus:border-fw-cyan/50';

export default function UserManagement() {
  const { addToast } = useToast();
  const [members, setMembers] = useState(initialMembers);
  const [inviting, setInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Viewer' });

  const handleRoleChange = (id, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const handleInvite = () => {
    if (!inviteForm.name || !inviteForm.email) {
      addToast('Please fill in name and email', 'warning');
      return;
    }
    setMembers((prev) => [
      ...prev,
      {
        id: `USR-${String(prev.length + 1).padStart(3, '0')}`,
        ...inviteForm,
        status: 'invited',
        lastActive: 'Pending',
      },
    ]);
    setInviteForm({ name: '', email: '', role: 'Viewer' });
    setInviting(false);
    addToast(`Invitation sent to ${inviteForm.email}`, 'success');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-display font-semibold text-fw-text">
              Team Members
            </h3>
            <HelpIcon
              text="Manage who can access FreightWare. Admins have full control. Operations Managers can run optimizations. Warehouse Leads access the tablet view. Viewers have read-only access."
              position="bottom-right"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInviting(true)}
          >
            <UserPlus size={14} />
            Invite User
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fw-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Name</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Email</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Role</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-fw-text-muted uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, i) => (
                <tr
                  key={member.id}
                  className={`border-b border-fw-border/50 ${i % 2 === 0 ? 'bg-fw-surface' : 'bg-fw-surface-2'}`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-fw-cyan/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-mono font-bold text-fw-cyan">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-fw-text font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-fw-text-dim font-mono text-xs">{member.email}</td>
                  <td className="py-3 px-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="bg-fw-bg border border-fw-border rounded-md px-2 py-1 text-xs text-fw-text"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>{r.value}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3">
                    <Badge color={member.status === 'active' ? 'green' : 'amber'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-xs text-fw-text-muted">{member.lastActive}</td>
                </tr>
              ))}

              {inviting && (
                <tr className="border-b border-fw-cyan/30 bg-fw-cyan/5">
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))}
                      className={`${inputCls} !py-1.5 text-xs`}
                      autoFocus
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="email"
                      placeholder="email@company.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                      className={`${inputCls} !py-1.5 text-xs`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value }))}
                      className="bg-fw-bg border border-fw-border rounded-md px-2 py-1 text-xs text-fw-text"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>{r.value}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={handleInvite}>
                        <Save size={12} />
                        Send Invite
                      </Button>
                      <button
                        onClick={() => setInviting(false)}
                        className="p-1.5 rounded-md hover:bg-fw-surface-2 text-fw-text-muted hover:text-fw-text"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => addToast('Team settings saved', 'success')}>
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-display font-semibold text-fw-text mb-3 uppercase tracking-wider">
          Role Permissions
        </h3>
        <div className="space-y-2">
          {roles.map((role) => (
            <div key={role.value} className="flex items-start gap-3 py-2">
              <Badge color="cyan" className="mt-0.5 min-w-[140px] justify-center">
                {role.value}
              </Badge>
              <p className="text-xs text-fw-text-dim leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
