import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, Calendar, IdCard, Save, X, Edit2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            updateProfile(formData);
            setSaving(false);
            setIsEditing(false);
        }, 1000);
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">My Profile</h1>
                    <p className="text-neutral-500 text-lg">Manage your personal and security information</p>
                </div>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary shadow-xl shadow-primary/20">
                        <Edit2 size={18} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button onClick={handleCancel} className="btn btn-secondary border-neutral-200">
                            <X size={18} /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <><Save size={18} /> Save Changes</>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Card: Summary */}
                <div className="lg:col-span-1">
                    <div className="card text-center flex flex-col items-center">
                        <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6 relative group overflow-hidden">
                            <span className="text-4xl font-bold">{user?.fullName?.charAt(0)}</span>
                            {isEditing && (
                                <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                                    <Edit2 size={24} />
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{user?.fullName}</h3>
                        <p className="text-neutral-400 font-medium mb-6">Patient Since March 2024</p>
                        <div className="w-full flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <ShieldCheck className="text-primary" size={20} />
                            <div className="text-left">
                                <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Account Security</div>
                                <div className="text-xs font-bold text-primary-dark">Verified Patient Account</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card: Details */}
                <div className="lg:col-span-2">
                    <div className="card grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
                        <ProfileField
                            label="Full Name"
                            value={formData.fullName}
                            isEditing={isEditing}
                            name="fullName"
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            icon={<User size={18} />}
                        />
                        <ProfileField
                            label="Date of Birth"
                            value={formData.dob}
                            isEditing={isEditing}
                            type="date"
                            name="dob"
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            icon={<Calendar size={18} />}
                        />
                        <ProfileField
                            label="National ID"
                            value={formData.nationalId}
                            readOnly={true} // National ID usually fixed
                            icon={<IdCard size={18} />}
                        />
                        <ProfileField
                            label="Gender"
                            value={formData.gender}
                            isEditing={isEditing}
                            type="select"
                            options={["Male", "Female", "Other"]}
                            name="gender"
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            icon={<User size={18} />}
                        />
                        <ProfileField
                            label="Phone Number"
                            value={formData.phone}
                            isEditing={isEditing}
                            name="phone"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            icon={<Phone size={18} />}
                        />
                        <ProfileField
                            label="Email Address"
                            value={formData.email}
                            isEditing={isEditing}
                            name="email"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            icon={<Mail size={18} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, value, isEditing, readOnly, type = "text", name, onChange, icon, options }) => (
    <div className="space-y-3">
        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-2">
            {icon} {label}
        </label>
        {isEditing && !readOnly ? (
            type === "select" ? (
                <select
                    className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                    value={value}
                    onChange={onChange}
                >
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                    value={value}
                    onChange={onChange}
                />
            )
        ) : (
            <div className={`p-4 rounded-xl bg-neutral-50/50 text-neutral-800 font-medium ${readOnly ? 'opacity-70 border-dashed border-2 border-neutral-200' : ''}`}>
                {value}
                {readOnly && <span className="ml-2 text-[10px] text-neutral-400">(Non-editable)</span>}
            </div>
        )}
    </div>
);

export default Profile;
