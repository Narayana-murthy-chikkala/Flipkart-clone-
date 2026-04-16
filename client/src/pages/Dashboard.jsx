import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout, getMe, updateProfile } from '../redux/authSlice';
import apiClient from '../services/api';
import addressService from '../services/addressService';
import accountService from '../services/accountService';
import wishlistService from '../services/wishlistService';
import './Dashboard.css';

/* ─────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────── */
const BoxIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const WalletIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const FolderIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const PowerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const AdminIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>;
const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const CopyIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;

/* ─────────────────────────────────────────────────────────────────
   PROFILE TAB
───────────────────────────────────────────────────────────────── */
const ProfileTab = ({ user }) => {
  const dispatch = useDispatch();
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');

  useEffect(() => {
    if (user) {
      const names = user.name ? user.name.split(' ') : ['', ''];
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setPhone(user.phone || '');
      setGender(user.gender || 'Male');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await dispatch(updateProfile({ name: fullName, phone, gender })).unwrap();
      setIsEditingNames(false);
      setIsEditingPhone(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err || 'Failed to update profile');
    }
  };

  return (
    <div className="fk-main-card">
      <div className="fk-card-header">
        <h2 className="fk-card-title">Personal Information</h2>
        {!isEditingNames && <span className="fk-edit-btn" onClick={() => setIsEditingNames(true)}>Edit</span>}
        {isEditingNames && <span className="fk-cancel-btn" onClick={() => setIsEditingNames(false)}>Cancel</span>}
      </div>
      <div className="fk-form-area">
        <div className="fk-input-row">
          <div className="fk-input-group">
            <input type="text" disabled={!isEditingNames} value={firstName} onChange={(e) => setFirstName(e.target.value)} className={isEditingNames ? 'fk-input active' : 'fk-input disabled'} />
            <label className="fk-floating-label">First Name</label>
          </div>
          <div className="fk-input-group">
            <input type="text" disabled={!isEditingNames} value={lastName} onChange={(e) => setLastName(e.target.value)} className={isEditingNames ? 'fk-input active' : 'fk-input disabled'} />
            <label className="fk-floating-label">Last Name</label>
          </div>
          {isEditingNames && <button className="fk-btn-save" onClick={handleSave}>SAVE</button>}
        </div>
        <div className="fk-gender-section">
          <label className="fk-section-label">Your Gender</label>
          <div className="fk-radio-group">
            <label className={`fk-radio-label ${gender === 'Male' && !isEditingNames ? 'selected-disabled' : ''}`}>
              <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={(e) => setGender(e.target.value)} disabled={!isEditingNames} />
              <span className="fk-custom-radio"></span> Male
            </label>
            <label className={`fk-radio-label ${gender === 'Female' && !isEditingNames ? 'selected-disabled' : ''}`}>
              <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={(e) => setGender(e.target.value)} disabled={!isEditingNames} />
              <span className="fk-custom-radio"></span> Female
            </label>
          </div>
        </div>
      </div>
      <div className="fk-card-header mt-8">
        <h2 className="fk-card-title">Email Address</h2>
        <span className="text-xs text-gray-400 ml-4">(Email cannot be changed directly)</span>
      </div>
      <div className="fk-form-area">
        <div className="fk-input-row single">
          <div className="fk-input-group">
            <input type="email" disabled defaultValue={user?.email} className="fk-input disabled" />
            <label className="fk-floating-label">Email Address</label>
          </div>
        </div>
      </div>
      <div className="fk-card-header mt-8">
        <h2 className="fk-card-title">Mobile Number</h2>
        {!isEditingPhone && <span className="fk-edit-btn" onClick={() => setIsEditingPhone(true)}>Edit</span>}
        {isEditingPhone && <span className="fk-cancel-btn" onClick={() => setIsEditingPhone(false)}>Cancel</span>}
      </div>
      <div className="fk-form-area">
        <div className="fk-input-row single">
          <div className="fk-input-group">
            <input type="text" disabled={!isEditingPhone} value={phone} onChange={(e) => setPhone(e.target.value)} className={isEditingPhone ? 'fk-input active' : 'fk-input disabled'} placeholder=" " />
            <label className="fk-floating-label">Mobile Number</label>
          </div>
          {isEditingPhone && <button className="fk-btn-save" onClick={handleSave}>SAVE</button>}
        </div>
      </div>
      <div className="fk-faq-section mt-8">
        <h3>FAQs</h3>
        <div className="fk-faq-item">
          <strong>What happens when I update my email address (or mobile number)?</strong>
          <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
        </div>
        <div className="fk-faq-item">
          <strong>When will my Flipkart account be updated with the new email address (or mobile number)?</strong>
          <p>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-100 mb-8">
        <span className="text-sm font-medium text-[#2874f0] cursor-pointer hover:underline">Deactivate Account</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SAVED ADDRESSES TAB — upgraded edit/delete UX
───────────────────────────────────────────────────────────────── */
const EMPTY_ADDR = { name: '', phone: '', address: '', city: '', pincode: '', type: 'Home' };

const SavedAddressesTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDR);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // id awaiting confirm
  const [toast, setToast] = useState(null);           // { msg, type }
  const [formError, setFormError] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getMyAddresses();
      if (res.success) setAddresses(res.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const validateForm = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) return 'Enter a valid 10-digit mobile number.';
    if (!/^\d{6}$/.test(form.pincode.trim())) return 'Enter a valid 6-digit pincode.';
    if (!form.city.trim()) return 'City / District is required.';
    if (!form.address.trim()) return 'Address (area & street) is required.';
    return '';
  };

  const openAddForm = () => {
    setForm(EMPTY_ADDR);
    setIsEdit(false);
    setCurrentId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setForm({ name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, pincode: addr.pincode, type: addr.type });
    setCurrentId(addr.id);
    setIsEdit(true);
    setFormError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setCurrentId(null);
    setForm(EMPTY_ADDR);
    setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError('');
    try {
      setSaving(true);
      if (isEdit) {
        const res = await addressService.updateAddress(currentId, form);
        if (res.success) {
          setAddresses(prev => prev.map(a => a.id === currentId ? res.data : a));
          showToast('Address updated successfully!');
        }
      } else {
        const res = await addressService.addAddress(form);
        if (res.success) {
          setAddresses(prev => [res.data, ...prev]);
          showToast('New address added!');
        }
      }
      closeForm();
    } catch (err) {
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      const res = await addressService.deleteAddress(deletingId);
      if (res.success) {
        setAddresses(prev => prev.filter(a => a.id !== deletingId));
        showToast('Address removed.');
      }
    } catch {
      showToast('Failed to remove address.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fk-main-card no-pad" style={{ position: 'relative' }}>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 9999,
          background: toast.type === 'success' ? '#2e7d32' : '#c62828',
          color: '#fff', padding: '12px 20px', borderRadius: '4px',
          fontSize: '13px', fontWeight: '500', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px'
        }}>
          {toast.type === 'success' ? '✓' : '✕'}&nbsp;{toast.msg}
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deletingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '4px', padding: '32px', width: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#212121' }}>Remove Address?</h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
              This address will be permanently deleted from your account.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '10px 24px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#555', borderRadius: '2px' }}>
                CANCEL
              </button>
              <button onClick={handleDeleteConfirm} style={{ padding: '10px 24px', background: '#2874f0', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', borderRadius: '2px' }}>
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fk-card-header sticky" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="fk-card-title">Manage Addresses</h2>
        {showForm && <span className="fk-cancel-btn" style={{ cursor: 'pointer' }} onClick={closeForm}>✕ Close</span>}
      </div>

      <div className="fk-content-pad">
        {/* Add button — always visible above list */}
        {!showForm && (
          <div className="fk-add-new-address" onClick={openAddForm}>
            <span className="plus">+</span> ADD A NEW ADDRESS
          </div>
        )}

        {/* ── Address Form ── */}
        {showForm && (
          <div className="fk-address-form-box">
            <h3 className="form-title">{isEdit ? 'EDIT ADDRESS' : 'ADD A NEW ADDRESS'}</h3>
            {formError && (
              <div style={{ background: '#fff3f3', border: '1px solid #ffb3b3', color: '#c0392b', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px' }}>
                ⚠&nbsp;{formError}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div className="fk-form-row">
                <div className="fk-input-group bg-white">
                  <input type="text" className="fk-input active" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder=" " />
                  <label className="fk-floating-label">Name</label>
                </div>
                <div className="fk-input-group bg-white">
                  <input type="tel" className="fk-input active" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder=" " maxLength={10} />
                  <label className="fk-floating-label">10-digit mobile number</label>
                </div>
              </div>
              <div className="fk-form-row">
                <div className="fk-input-group bg-white">
                  <input type="text" className="fk-input active" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder=" " maxLength={6} />
                  <label className="fk-floating-label">Pincode</label>
                </div>
                <div className="fk-input-group bg-white">
                  <input type="text" className="fk-input active" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder=" " />
                  <label className="fk-floating-label">City / District / Town</label>
                </div>
              </div>
              <div className="fk-input-group bg-white full-w mt-4">
                <textarea className="fk-input active textarea" rows="3" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder=" "></textarea>
                <label className="fk-floating-label">Address (Area and Street)</label>
              </div>
              <div className="fk-address-type-select">
                <p className="type-label">Address Type</p>
                <div className="type-radios">
                  <label className="fk-radio-label">
                    <input type="radio" name="addtype" value="Home" checked={form.type === 'Home'} onChange={e => setForm({ ...form, type: e.target.value })} />
                    <span className="fk-custom-radio"></span> Home
                  </label>
                  <label className="fk-radio-label">
                    <input type="radio" name="addtype" value="Work" checked={form.type === 'Work'} onChange={e => setForm({ ...form, type: e.target.value })} />
                    <span className="fk-custom-radio"></span> Work
                  </label>
                </div>
              </div>
              <div className="fk-form-actions">
                <button type="submit" className="fk-btn-save big text-white bg-blue" disabled={saving} style={{ opacity: saving ? 0.7 : 1, minWidth: '160px' }}>
                  {saving ? 'SAVING...' : isEdit ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                </button>
                <button type="button" className="fk-cancel-btn ml-4" onClick={closeForm}>CANCEL</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Addresses list ── */}
        {loading ? (
          <div className="fk-spinner-container" style={{ minHeight: '200px' }}><div className="fk-circ-spinner"></div></div>
        ) : (
          <div className="fk-addresses-list">
            {addresses.length === 0 && !showForm && (
              <div style={{ textAlign: 'center', padding: '56px 0', color: '#aaa' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ margin: '0 auto 12px', display: 'block' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <p style={{ fontSize: '14px' }}>No saved addresses. Add one to get started!</p>
              </div>
            )}
            {addresses.map(addr => (
              <div key={addr.id} className="fk-saved-address-card">
                <div className="addr-top-row" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="addr-type">{addr.type}</span>
                  {/* Action buttons — replace old dot menu */}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditForm(addr)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '5px 14px', fontSize: '12px', fontWeight: '600',
                        border: '1px solid #2874f0', color: '#2874f0', background: 'none',
                        cursor: 'pointer', borderRadius: '2px', letterSpacing: '0.4px'
                      }}
                    >
                      <EditIcon /> EDIT
                    </button>
                    <button
                      onClick={() => setDeletingId(addr.id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '5px 14px', fontSize: '12px', fontWeight: '600',
                        border: '1px solid #ddd', color: '#888', background: 'none',
                        cursor: 'pointer', borderRadius: '2px', letterSpacing: '0.4px',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#d32f2f'; e.currentTarget.style.color = '#d32f2f'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#888'; }}
                    >
                      <TrashIcon /> REMOVE
                    </button>
                  </div>
                </div>
                <div className="addr-details-box">
                  <div className="addr-name-phone">
                    <span className="bold">{addr.name}</span>
                    <span className="bold">{addr.phone}</span>
                  </div>
                  <div className="addr-full-text">
                    {addr.address}, {addr.city} - <span className="bold">{addr.pincode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   ORDERS TAB — search + status filter FIXED
───────────────────────────────────────────────────────────────── */
const OrdersTab = ({ orders, ordersLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // ── Apply both text search and status filter ──
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || (
      String(order.id).toLowerCase().includes(term) ||
      (order.status || '').toLowerCase().includes(term) ||
      String(order.total_amount).includes(term) ||
      new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase().includes(term)
    );
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const statusColor = { pending: '#f57c00', confirmed: '#1976d2', shipped: '#7b1fa2', delivered: '#2e7d32', cancelled: '#d32f2f' };
  const statusMsg = { pending: 'Order placed successfully', confirmed: 'Confirmed by seller', shipped: 'Your order is on the way', delivered: 'Delivered', cancelled: 'Order was cancelled' };

  return (
    <div className="fk-main-card no-pad h-full" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>

      {/* ── Search bar ── */}
      <div className="fk-orders-search-bar mb-4 bg-white p-4 shadow-sm rounded-sm flex">
        <input
          type="text"
          placeholder="Search by Order ID, status, amount or date…"
          className="flex-1 outline-none border border-gray-200 px-4 py-2 text-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')}
            style={{ padding: '0 12px', background: 'none', border: '1px solid #ddd', borderLeft: 'none', cursor: 'pointer', color: '#aaa', fontSize: '18px' }}
            title="Clear">×</button>
        )}
        <button className="bg-[#2874f0] text-white px-8 py-2 font-medium flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M14.5 14.5L10 10M11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5C9.03757 0.5 11.5 2.96243 11.5 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Search Orders
        </button>
      </div>

      {/* ── Status filter tabs ── */}
      <div style={{ display: 'flex', background: '#fff', marginBottom: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderRadius: '2px', overflowX: 'auto' }}>
        {STATUS_TABS.map(tab => {
          const count = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length;
          const active = filterStatus === tab.key;
          return (
            <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '12px 18px', fontSize: '13px', fontWeight: active ? '600' : '400',
                color: active ? '#2874f0' : '#666', background: 'none', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid #2874f0' : '2px solid transparent',
                transition: 'all 0.15s'
              }}>
              {tab.label}
              {count > 0 && (
                <span style={{ marginLeft: '5px', fontSize: '10px', fontWeight: '700', background: active ? '#2874f0' : '#eee', color: active ? '#fff' : '#666', borderRadius: '10px', padding: '1px 6px' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Orders list ── */}
      <div className="bg-white shadow-sm rounded-sm">
        {ordersLoading ? (
          <div className="fk-spinner-container"><div className="fk-circ-spinner"></div></div>
        ) : filteredOrders.length === 0 ? (
          <div className="fk-empty-box stretch" style={{ padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {orders.length === 0 ? (
              <>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders_empty_3b110a.png" alt="No Orders" style={{ width: '200px', opacity: 0.7 }} />
                <p className="generic-title font-medium text-lg mt-4">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">You haven't placed any orders.</p>
              </>
            ) : (
              <>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" style={{ marginBottom: '12px' }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p style={{ fontSize: '15px', color: '#555', fontWeight: '500' }}>
                  No results for "<span style={{ color: '#2874f0' }}>{searchTerm || filterStatus}</span>"
                </p>
                <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                  style={{ marginTop: '10px', color: '#2874f0', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {(searchTerm || filterStatus !== 'all') && (
              <div style={{ padding: '8px 24px', fontSize: '12px', color: '#999', borderBottom: '1px solid #f5f5f5' }}>
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            )}
            {filteredOrders.map(order => (
              <div key={order.id} className="fk-order-card-wrapper border-b border-gray-100 last:border-b-0">
                <div style={{ padding: '8px 24px', background: '#f9f9f9', fontSize: '11px', color: '#555', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-semibold text-gray-700">Order ID - {String(order.id).toUpperCase()}</span>
                  <span>Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="fk-order-rowcard hover-card flex px-6 py-6 cursor-pointer border-b border-gray-50 last:border-b-0">
                      <div className="order-item-img mr-6" style={{ width: '75px', height: '75px', flexShrink: 0 }}>
                        <img 
                          src={(item.images && item.images.length > 0) ? item.images[0] : 'https://placehold.co/100x100?text=No+Image'} 
                          alt={item.name} 
                          className="object-contain w-full h-full" 
                        />
                      </div>
                      <div className="order-item-details mr-6 flex-1" style={{ minWidth: 0 }}>
                        <p className="order-title font-medium text-sm text-[#212121] hover:text-[#2874f0] line-clamp-2 pr-4">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Qty: {item.quantity}</p>
                      </div>
                      <div className="order-item-price mr-12 font-medium text-sm text-[#212121]" style={{ flexShrink: 0 }}>
                        ₹{parseFloat(item.price).toLocaleString('en-IN')}
                      </div>
                      <div className="order-item-status w-64" style={{ flexShrink: 0 }}>
                        <p className="bold flex items-center gap-2 text-sm">
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: statusColor[order.status] || '#999', flexShrink: 0 }}></span>
                          <span style={{ color: statusColor[order.status] || '#212121', fontWeight: '600', textTransform: 'capitalize' }}>{order.status}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {statusMsg[order.status] || 'Processing'}{' '}
                          {(order.status === 'delivered' || order.status === 'cancelled') && new Date(order.updated_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[#2874f0] font-medium text-xs mt-4 uppercase cursor-pointer flex items-center gap-1 hover:underline">
                          <span className="text-lg leading-none">★</span> Rate & Review Product
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="fk-order-rowcard hover-card flex px-6 py-6 cursor-pointer">
                    <div className="order-item-img mr-6" style={{ width: '75px', height: '75px', flexShrink: 0 }}>
                      <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders_empty_3b110a.png" alt="Order" className="object-contain w-full h-full" style={{ filter: 'grayscale(0.3)' }} />
                    </div>
                    <div className="order-item-details mr-6 flex-1" style={{ minWidth: 0 }}>
                      <p className="order-title font-medium text-sm text-[#212121]">Raw Order Record</p>
                      <p className="text-xs text-gray-500 mt-2">Placed recently</p>
                    </div>
                    <div className="order-item-price mr-12 font-medium text-sm text-[#212121]" style={{ flexShrink: 0 }}>
                      ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                    </div>
                    <div className="order-item-status w-64" style={{ flexShrink: 0 }}>
                      <p className="bold flex items-center gap-2 text-sm">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: statusColor[order.status] || '#999', flexShrink: 0 }}></span>
                        <span style={{ color: statusColor[order.status] || '#212121', fontWeight: '600', textTransform: 'capitalize' }}>{order.status}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   WISHLIST TAB
───────────────────────────────────────────────────────────────── */
const WishlistTab = ({ navigate }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await wishlistService.getMyWishlist();
        if (res.success) setWishlist(res.data);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="fk-main-card no-pad h-full">
      <div className="fk-card-header sticky border-bot">
        <h2 className="fk-card-title">My Wishlist ({wishlist.length})</h2>
      </div>
      {loading ? (
        <div className="fk-spinner-container"><div className="fk-circ-spinner"></div></div>
      ) : wishlist.length === 0 ? (
        <div className="fk-empty-box">
          <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png" alt="Empty Wishlist" />
          <p>Empty Wishlist</p>
          <p className="text-xs text-gray-400 mt-2">You have no items in your wishlist. Start adding!</p>
        </div>
      ) : (
        <div className="fk-wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="fk-wishlist-item" onClick={() => navigate(`/product/${item.product_id}`)}>
              <div className="w-img-box">
                <img src={item.images?.[0] || 'https://placehold.co/150'} alt={item.name} />
              </div>
              <div className="w-details">
                <p className="w-name truncate">{item.name}</p>
                <div className="w-rating"><span className="fk-green-tag">4.2 ★</span> (112)</div>
                <div className="w-price-row">
                  <span className="w-price">₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                  <span className="w-strike">₹{Math.round(parseFloat(item.price) * 1.5).toLocaleString('en-IN')}</span>
                  <span className="w-off">50% off</span>
                </div>
              </div>
              <div className="w-trash-icon" onClick={e => { e.stopPropagation(); wishlistService.removeFromWishlist(item.product_id); setWishlist(wishlist.filter(w => w.id !== item.id)); }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="#878787"><path d="M4 4h8v1H4zm1 2h6v8H5zM2 3h12v1H2z"></path></svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   PAN CARD TAB — isUploading fixed + preview persistence fixed
───────────────────────────────────────────────────────────────── */
const PanCardTab = ({ user }) => {
  const dispatch = useDispatch();
  const [panNumber, setPanNumber] = useState(user?.pan_card || '');
  const [panName, setPanName] = useState(user?.name || '');
  const [isAgreed, setIsAgreed] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // ← was missing before
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Initialize preview from server path if available
  const [preview, setPreview] = useState(
    user?.pan_image ? `http://localhost:5000${user.pan_image}` : null
  );

  // Re-sync whenever Redux user updates (covers page refresh after getMe resolves)
  useEffect(() => {
    if (user) {
      setPanNumber(user.pan_card || '');
      setPanName(user.name || '');
      // Only pull server image if user hasn't selected a new local file
      if (user.pan_image && !file) {
        setPreview(`http://localhost:5000${user.pan_image}?t=${Date.now()}`);
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) { alert('Please select an image file'); return; }
    setFile(selected);
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selected));
  };

  const handlePanUpload = async () => {
    if (!panNumber || panNumber.length !== 10) return alert('Enter a valid 10-digit PAN number');
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) return alert('PAN format should be like ABCDE1234F');
    if (!isAgreed) return alert('Please agree to the declaration');
    try {
      setIsUploading(true);
      setSaveSuccess(false);
      const formData = new FormData();
      formData.append('pan_card', panNumber);
      if (file) formData.append('pan_image', file);
      const res = await accountService.updateProfileWithPan(formData);
      if (res.success) {
        dispatch(getMe()); // re-fetch so pan_image is updated in Redux
        setFile(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update PAN card');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fk-main-card">
      <div className="fk-card-header">
        <h2 className="fk-card-title">PAN Card Information</h2>
        {user?.pan_card && (
          <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            ✓ PAN on file
          </span>
        )}
      </div>

      {saveSuccess && (
        <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', color: '#2e7d32', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', fontWeight: '500' }}>
          ✓ PAN Card details saved successfully!
        </div>
      )}

      <div className="fk-form-area mt-4">
        <div className="fk-input-row single">
          <div className="fk-input-group">
            <input type="text" className="fk-input active uppercase" placeholder=" " value={panNumber} onChange={e => setPanNumber(e.target.value.toUpperCase())} maxLength={10} />
            <label className="fk-floating-label">PAN Card Number</label>
          </div>
        </div>
        <div className="fk-input-row single">
          <div className="fk-input-group">
            <input type="text" className="fk-input active" placeholder=" " value={panName} readOnly />
            <label className="fk-floating-label">Full Name</label>
          </div>
        </div>

        {/* Preview */}
        <div className="fk-pan-preview-area mt-4 mb-4">
          {preview ? (
            <div className="fk-pan-preview-box w-full max-w-sm rounded border border-gray-200 overflow-hidden shadow-sm relative group bg-gray-50 flex items-center justify-center" style={{ height: '200px' }}>
              <img
                src={preview}
                alt="PAN card preview"
                className="max-h-full max-w-full object-contain"
                onError={() => { if (!file) setPreview(null); }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase">
                {file ? 'NEW — NOT SAVED YET' : 'CURRENT DOCUMENT'}
              </div>
            </div>
          ) : (
            <div style={{ width: '320px', height: '180px', border: '2px dashed #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ccc', gap: '8px', background: '#fafafa' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
              <p style={{ fontSize: '12px' }}>No PAN card image uploaded</p>
            </div>
          )}
        </div>

        {/* File upload */}
        <div className="fk-input-row single mt-6">
          <div className="fk-upload-box">
            <label className="upload-label text-sm text-[#2874f0] font-medium cursor-pointer flex items-center justify-center border-dashed border-2 border-gray-300 rounded h-14 hover:border-[#2874f0] transition-colors gap-3 bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              <span>{file ? `✓ ${file.name}` : 'Choose PAN Card Image (JPG / PNG)'}</span>
            </label>
          </div>
        </div>

        {/* Declaration checkbox */}
        <div className="fk-input-row mt-6">
          <label className="fk-checkbox-container text-sm text-gray-500 flex gap-4 cursor-pointer items-start">
            <input type="checkbox" className="mt-1" checked={isAgreed} onChange={e => setIsAgreed(e.target.checked)} />
            <span>I do hereby declare that PAN furnished/stated above is correct and belongs to me, understood that I shall be held liable for any damages/claims by the regulatory authorities.</span>
          </label>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <button
            className={`fk-btn-save ${isUploading || !isAgreed ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePanUpload}
            disabled={isUploading || !isAgreed}
            style={{ width: '200px' }}
          >
            {isUploading ? 'SAVING...' : 'SAVE DETAILS'}
          </button>
        </div>

        <div className="fk-faq-section mt-10 border-t border-gray-200 pt-8">
          <h3 className="font-bold text-gray-800 mb-4 font-inherit text-base">Read FAQs</h3>
          <div className="fk-faq-item space-y-4">
            <div>
              <strong className="text-sm block mb-1">Why do I need to share my PAN Card details?</strong>
              <p className="text-sm text-gray-500">For any single transaction above ₹2,00,000, sharing your PAN Card details is mandatory.</p>
            </div>
            <div>
              <strong className="text-sm block mb-1">Is my PAN information safe?</strong>
              <p className="text-sm text-gray-500">Yes. Your PAN information is encrypted and stored securely. It is only used for regulatory compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   GIFT CARDS TAB
───────────────────────────────────────────────────────────────── */
const GiftCardsTab = ({ user }) => {
  const [giftCards, setGiftCards] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const [buyForm, setBuyForm] = useState({ email: '', name: '', value: 100, count: 1 });

  const fetchGiftCards = async () => {
    try {
      const res = await accountService.getGiftCards();
      if (res.success) setGiftCards(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchGiftCards(); }, []);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!buyForm.email || !buyForm.name) return alert('Fill required fields');
    try {
      setIsAdding(true);
      const cardNumber = Math.random().toString().slice(2, 14);
      const pin = Math.random().toString().slice(2, 8);
      const res = await accountService.addGiftCard({ card_number: cardNumber, pin, amount: buyForm.value * buyForm.count });
      if (res.success) {
        alert(`Gift Card Purchased! Number: ${cardNumber}`);
        dispatch(getMe());
        fetchGiftCards();
        setBuyForm({ email: '', name: '', value: 100, count: 1 });
      }
    } catch { alert('Purchase failed'); }
    finally { setIsAdding(false); }
  };

  const totalBalance = giftCards.reduce((acc, card) => acc + parseFloat(card.amount), 0);

  return (
    <div className="fk-main-card no-pad border-transparent">
      <div className="flex justify-between items-center mb-6 pl-8 pr-8 pt-8">
        <h2 className="text-xl font-medium text-[#212121]">Flipkart Gift Card</h2>
        <div className="flex gap-6 text-sm font-medium text-[#2874f0] cursor-pointer"><span>Check Status</span><span>Terms & Conditions</span></div>
      </div>
      <div className="ml-8 mr-8 mb-6 p-6 bg-[#f1f3f6] rounded flex items-center justify-between shadow-inner">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Your Total Balance</p>
          <h3 className="text-2xl font-bold text-[#212121]">₹{totalBalance.toLocaleString('en-IN')}</h3>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2"><path d="M1 4h22v16H1z" /><path d="M1 10h22" /></svg>
        </div>
      </div>
      <div className="ml-8 mr-8">
        <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Your Gift Cards ({giftCards.length})</h3>
        {giftCards.length === 0 ? (
          <p className="text-sm text-gray-500 italic mb-8">No gift cards found.</p>
        ) : (
          <div className="space-y-3 mb-8">
            {giftCards.map(card => (
              <div key={card.id} className="bg-white border border-gray-100 p-4 rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-gray-800">Card: {card.card_number.replace(/\d(?=\d{4})/g, "*")}</p>
                  <p className="text-xs text-gray-500">Balance: ₹{parseFloat(card.amount).toLocaleString('en-IN')}</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">ACTIVE</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pl-8 pr-8 pb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-medium text-[#212121]">Buy a Flipkart Gift Card</h2>
          <div className="text-xs text-gray-500">Fast & Secure delivery via Email</div>
        </div>
        <div className="border border-gray-300 bg-white p-6 shadow-sm rounded-sm">
          <form onSubmit={handleBuy} className="flex flex-col gap-4">
            <input type="email" placeholder="Receiver's Email ID *" required className="fk-input active p-3 border border-gray-300 rounded-sm text-sm" value={buyForm.email} onChange={e => setBuyForm({ ...buyForm, email: e.target.value })} />
            <input type="text" placeholder="Receiver's Name *" required className="fk-input active p-3 border border-gray-300 rounded-sm text-sm" value={buyForm.name} onChange={e => setBuyForm({ ...buyForm, name: e.target.value })} />
            <div className="flex gap-4">
              <select className="fk-input active p-3 border border-gray-300 rounded-sm text-sm flex-1 bg-white" value={buyForm.value} onChange={e => setBuyForm({ ...buyForm, value: parseInt(e.target.value) })}>
                {[100, 250, 500, 1000, 5000].map(v => <option key={v} value={v}>₹{v}</option>)}
              </select>
              <input type="number" min="1" max="10" placeholder="Qty" className="w-24 p-3 border border-gray-300 rounded-sm text-sm" value={buyForm.count} onChange={e => setBuyForm({ ...buyForm, count: parseInt(e.target.value) })} />
            </div>
            <button type="submit" disabled={isAdding} className="bg-[#fb641b] text-white font-bold py-3 uppercase shadow-md hover:bg-[#e65a16] transition-all disabled:opacity-50">
              {isAdding ? 'Sourcing Card...' : `Purchase for ₹${buyForm.value * buyForm.count}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SAVED UPI TAB
───────────────────────────────────────────────────────────────── */
const SavedUpiTab = () => {
  const [upiHandles, setUpiHandles] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newHandle, setNewHandle] = useState('');

  const fetchUpi = async () => {
    try {
      const res = await accountService.getSavedUpi();
      if (res.success) setUpiHandles(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchUpi(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHandle.includes('@')) return alert('Invalid UPI ID');
    try {
      const res = await accountService.addSavedUpi({ upi_id: newHandle, label: 'Secondary' });
      if (res.success) { setNewHandle(''); setShowAdd(false); fetchUpi(); }
    } catch { alert('Failed to add UPI'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this UPI handle?')) return;
    try {
      const res = await accountService.deleteSavedUpi(id);
      if (res.success) fetchUpi();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fk-main-card no-pad h-full">
      <div className="fk-card-header sticky border-bot flex justify-between items-center pr-8">
        <h2 className="fk-card-title">Manage Saved UPI</h2>
        {!showAdd && <button className="text-[#2874f0] font-medium text-sm" onClick={() => setShowAdd(true)}>+ ADD NEW</button>}
      </div>
      {showAdd && (
        <div className="px-8 pt-6 pb-6 bg-gray-50 border-b border-gray-100">
          <form className="flex gap-4" onSubmit={handleAdd}>
            <input type="text" placeholder="Enter UPI ID (e.g. user@bank)" className="flex-1 p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-[#2874f0]" value={newHandle} onChange={e => setNewHandle(e.target.value)} required />
            <button type="submit" className="bg-[#fb641b] text-white px-8 py-2 font-bold uppercase text-sm rounded-sm">SAVE</button>
            <button type="button" className="text-gray-500 text-sm" onClick={() => setShowAdd(false)}>CANCEL</button>
          </form>
        </div>
      )}
      {upiHandles.length === 0 ? (
        <div className="fk-empty-box stretch py-20 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <p className="text-base text-gray-400">You have not saved any UPI handles yet.</p>
        </div>
      ) : (
        <div className="p-8 space-y-4">
          {upiHandles.map(handle => (
            <div key={handle.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-md bg-white shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f1f3f6] rounded flex items-center justify-center text-[#2874f0] font-bold text-xs">UPI</div>
                <div>
                  <p className="font-bold text-[#212121]">{handle.upi_id}</p>
                  <p className="text-xs text-green-600 font-medium">Verified Handle</p>
                </div>
              </div>
              <button onClick={() => handleDelete(handle.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="px-8 pb-8 mt-4">
        <h3 className="font-medium text-sm mb-4">FAQs</h3>
        <p className="font-medium text-sm mb-1">What handles can I save?</p>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">You can save handles of any bank or UPI app like PhonePe, Google Pay, BHIM, etc.</p>
        <p className="font-medium text-sm mb-1">Where can I use my saved UPI handles?</p>
        <p className="text-xs text-gray-500 leading-relaxed">You can use your saved UPI handles to pay for orders across Flipkart platforms.</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SAVED CARDS TAB
───────────────────────────────────────────────────────────────── */
const SavedCardsTab = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    accountService.getSavedCards().then(res => { if (res.success) setCards(res.data); }).catch(console.error);
  }, []);

  return (
    <div className="fk-main-card no-pad h-full">
      <div className="fk-card-header sticky border-bot"><h2 className="fk-card-title">Manage Saved Cards</h2></div>
      {cards.length === 0 ? (
        <div className="fk-empty-box stretch py-20 flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          </div>
          <p className="text-base text-gray-400 text-center px-8">Save your credit/debit cards during payment for a faster checkout.</p>
        </div>
      ) : (
        <div className="p-8 space-y-4">
          {cards.map(card => (
            <div key={card.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-md bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#2874f0] rounded flex items-center justify-center text-white font-bold text-[10px]">{card.card_network}</div>
                <div>
                  <p className="font-bold text-[#212121]">{card.card_number.replace(/\d(?=\d{4})/g, "*")}</p>
                  <p className="text-xs text-gray-500">{card.card_name} | Expires {card.expiry}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   COUPONS TAB — fully dynamic: copy code, tabs, category filter
───────────────────────────────────────────────────────────────── */
const CouponsTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true); setError(null);
        const res = await accountService.getCoupons();
        if (res.success) setCoupons(res.data);
      } catch (err) {
        setError('Failed to load coupons. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const now = new Date();
  const active = coupons.filter(c => c.is_active && new Date(c.expiry || '2099-01-01') >= now);
  const expired = coupons.filter(c => !c.is_active || new Date(c.expiry || '2099-01-01') < now);
  const list = activeTab === 'active' ? active : expired;

  const categories = ['all', ...new Set(coupons.map(c => c.category).filter(Boolean))];
  const displayed = selectedCategory === 'all' ? list : list.filter(c => c.category === selectedCategory);

  const CAT_COLORS = { Electronics: '#1565c0', Fashion: '#6a1b9a', Grocery: '#2e7d32', Travel: '#e65100', Beauty: '#880e4f' };
  const getColor = (cat) => CAT_COLORS[cat] || '#2874f0';

  return (
    <div className="fk-main-card no-pad h-full">
      {/* Header */}
      <div className="fk-card-header sticky pb-0 pr-8 flex justify-between items-center">
        <h2 className="fk-card-title pb-4 border-b-2 border-transparent">My Coupons</h2>
        <span className="text-xs text-gray-500 font-medium">{active.length} active offer{active.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Active / Expired tabs */}
      <div className="flex border-b border-gray-200 px-8">
        {[{ key: 'active', label: 'Active', count: active.length }, { key: 'expired', label: 'Expired', count: expired.length }].map(t => (
          <div key={t.key}
            className={`pb-4 font-medium mr-8 cursor-pointer text-sm ${activeTab === t.key ? 'text-[#2874f0] border-b-2 border-[#2874f0]' : 'text-gray-500'}`}
            onClick={() => { setActiveTab(t.key); setSelectedCategory('all'); }}>
            {t.label} ({t.count})
          </div>
        ))}
      </div>

      {/* Category pills */}
      {categories.length > 2 && (
        <div style={{ padding: '10px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #f1f3f6' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '4px 14px', fontSize: '12px', fontWeight: '600', borderRadius: '20px', cursor: 'pointer',
                border: `1px solid ${selectedCategory === cat ? '#2874f0' : '#ddd'}`,
                background: selectedCategory === cat ? '#e8f0fe' : '#fff',
                color: selectedCategory === cat ? '#2874f0' : '#666', transition: 'all 0.15s', textTransform: 'capitalize'
              }}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="fk-content-pad space-y-3" style={{ background: '#f1f3f6', minHeight: '400px' }}>
        {loading && <div className="fk-spinner-container" style={{ minHeight: '200px' }}><div className="fk-circ-spinner"></div></div>}

        {error && <div style={{ background: '#fff3f3', border: '1px solid #ffb3b3', color: '#c0392b', padding: '16px', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }}>{error}</div>}

        {!loading && !error && displayed.length === 0 && (
          <div className="bg-white p-12 text-center rounded flex flex-col items-center gap-3">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <p className="text-sm font-medium text-gray-400">{activeTab === 'active' ? 'No active coupons right now.' : 'No expired coupons.'}</p>
          </div>
        )}

        {!loading && !error && displayed.map(coupon => {
          const isExpired = activeTab === 'expired';
          const color = getColor(coupon.category);
          const copied = copiedCode === coupon.code;
          return (
            <div key={coupon.id} style={{
              background: '#fff', borderRadius: '4px', overflow: 'hidden', display: 'flex',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)', opacity: isExpired ? 0.65 : 1,
              borderLeft: `4px solid ${color}`, transition: 'transform 0.1s, box-shadow 0.1s'
            }}
              onMouseEnter={e => { if (!isExpired) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'; }}>

              {/* Discount badge */}
              <div style={{ background: color, color: '#fff', width: '88px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 6px', textAlign: 'center' }}>
                <span style={{ fontSize: '19px', fontWeight: '800', lineHeight: 1 }}>
                  {coupon.discount_type === 'Percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', marginTop: '2px', opacity: 0.85 }}>OFF</span>
                {coupon.category && (
                  <span style={{ fontSize: '9px', marginTop: '6px', background: 'rgba(255,255,255,0.2)', padding: '2px 5px', borderRadius: '10px', textTransform: 'uppercase' }}>
                    {coupon.category}
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '800', color: '#212121', letterSpacing: '1px', background: '#f1f3f6', padding: '3px 10px', borderRadius: '3px', border: '1.5px dashed #bbb' }}>
                    {coupon.code}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#555', margin: '6px 0', lineHeight: '1.5' }}>{coupon.description}</p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {coupon.min_order_value > 0 && (
                    <span style={{ fontSize: '11px', color: '#888' }}>Min. order: <strong>₹{parseFloat(coupon.min_order_value).toLocaleString('en-IN')}</strong></span>
                  )}
                  {coupon.max_discount > 0 && coupon.discount_type === 'Percentage' && (
                    <span style={{ fontSize: '11px', color: '#888' }}>Max off: <strong>₹{parseFloat(coupon.max_discount).toLocaleString('en-IN')}</strong></span>
                  )}
                  <span style={{ fontSize: '11px', color: isExpired ? '#d32f2f' : '#888' }}>
                    {isExpired ? 'Expired' : 'Valid'} till <strong>{new Date(coupon.expiry || Date.now() + 864000000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </span>
                </div>
              </div>

              {/* Copy button */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
                {!isExpired ? (
                  <button onClick={() => handleCopy(coupon.code)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
                    fontSize: '12px', fontWeight: '700', letterSpacing: '0.4px',
                    border: `1.5px solid ${copied ? '#2e7d32' : color}`,
                    color: copied ? '#2e7d32' : color, background: copied ? '#e8f5e9' : 'transparent',
                    borderRadius: '2px', cursor: 'pointer', transition: 'all 0.2s'
                  }}>
                    <CopyIcon />{copied ? 'COPIED!' : 'COPY'}
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: '#d32f2f', fontWeight: '600', padding: '6px 12px', border: '1px solid #ffcdd2', borderRadius: '2px', background: '#fff3f3' }}>EXPIRED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewsTab = () => (
  <div className="fk-main-card no-pad h-full">
    <div className="fk-empty-box stretch py-20 flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
      </div>
      <p className="generic-title text-xl font-medium" style={{ color: '#000' }}>No Reviews & Ratings</p>
      <p className="text-sm text-gray-500 mt-2">You have not rated or reviewed any product yet!</p>
    </div>
  </div>
);

const NotificationsTab = () => (
  <div className="fk-main-card no-pad h-full">
    <div className="fk-empty-box stretch py-20 flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /><path d="M18 10h4M18 6h3" /></svg>
      </div>
      <p className="generic-title text-xl font-medium mt-4">All caught up!</p>
      <p className="text-sm text-gray-500 mt-2">There are no new notifications for you.</p>
    </div>
  </div>
);

const AdminStatsTab = ({ stats }) => (
  <div className="fk-main-card">
    <div className="fk-card-header mb-6"><h2 className="fk-card-title">Admin Dashboard Overview</h2></div>
    {stats ? (
      <div className="fk-admin-grid">
        <div className="fk-admin-box"><p className="a-label">Total Revenue</p><p className="a-val">₹{stats.totalRevenue.toLocaleString('en-IN')}</p></div>
        <div className="fk-admin-box"><p className="a-label">Total Orders</p><p className="a-val">{stats.totalOrders}</p></div>
        <div className="fk-admin-box"><p className="a-label">Unique Customers</p><p className="a-val">{stats.totalCustomers}</p></div>
      </div>
    ) : <div className="fk-circ-spinner"></div>}
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!user && token) dispatch(getMe());
  }, [isAuthenticated, user, token, dispatch, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setOrdersLoading(true);
        if (user.role === 'admin') {
          const res = await apiClient.get('/orders');
          const allOrders = res.data.data;
          setOrders(allOrders);
          setStats({
            totalOrders: allOrders.length,
            totalRevenue: allOrders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
            totalCustomers: [...new Set(allOrders.map((o) => o.user_id).filter(Boolean))].length,
          });
        } else {
          const res = await apiClient.get('/orders/my-orders');
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };
  const setTab = (tab) => setSearchParams({ tab });

  if (!isAuthenticated || !user) return null;

  return (
    <div className="fk-dashboard-page">
      <div className="fk-dashboard-wrapper">

        {/* SIDEBAR */}
        <div className="fk-dashboard-sidebar">
          <div className="fk-sidebar-user">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="User" className="user-avi" />
            <div className="user-txt">
              <p className="hello">Hello,</p>
              <p className="name">{user.name}</p>
            </div>
          </div>

          <div className="fk-sidebar-menu">
            <div className={`fk-menu-group-parent hoverable ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              <div className="svg-icon-wrap"><BoxIcon /></div>
              <div className="parent-label active-text space-between">MY ORDERS <span className="chev">&gt;</span></div>
            </div>

            <div className="fk-menu-group-parent">
              <div className="svg-icon-wrap"><UserIcon /></div>
              <div className="parent-label">ACCOUNT SETTINGS</div>
            </div>
            <div className="fk-menu-children">
              <div className={`fk-child-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile Information</div>
              <div className={`fk-child-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setTab('addresses')}>Manage Addresses</div>
              <div className={`fk-child-item ${activeTab === 'pan' ? 'active' : ''}`} onClick={() => setTab('pan')}>PAN Card Information</div>
            </div>

            <div className="fk-menu-group-parent">
              <div className="svg-icon-wrap"><WalletIcon /></div>
              <div className="parent-label">PAYMENTS</div>
            </div>
            <div className="fk-menu-children line-above">
              <div className={`fk-child-item ${activeTab === 'giftcards' ? 'active' : ''}`} onClick={() => setTab('giftcards')}>
                Gift Cards <span className="text-[#212121] font-bold ml-2">₹{parseFloat(user?.gift_card_balance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className={`fk-child-item ${activeTab === 'upi' ? 'active' : ''}`} onClick={() => setTab('upi')}>Saved UPI</div>
              <div className={`fk-child-item ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setTab('cards')}>Saved Cards</div>
            </div>

            <div className="fk-menu-group-parent">
              <div className="svg-icon-wrap"><FolderIcon /></div>
              <div className="parent-label">MY STUFF</div>
            </div>
            <div className="fk-menu-children line-above">
              <div className={`fk-child-item ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setTab('coupons')}>My Coupons</div>
              <div className={`fk-child-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>My Reviews & Ratings</div>
              <div className={`fk-child-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setTab('notifications')}>All Notifications</div>
              <div className={`fk-child-item ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setTab('wishlist')}>My Wishlist</div>
            </div>

            {user.role === 'admin' && (
              <>
                <div className="fk-menu-group-parent">
                  <div className="svg-icon-wrap"><AdminIcon /></div>
                  <div className="parent-label">ADMIN</div>
                </div>
                <div className="fk-menu-children line-above">
                  <div className={`fk-child-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>Admin Stats</div>
                </div>
              </>
            )}

            <div className="fk-menu-group-parent hoverable border-top" onClick={handleLogout}>
              <div className="svg-icon-wrap"><PowerIcon /></div>
              <div className="parent-label">Logout</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="fk-dashboard-main">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'addresses' && <SavedAddressesTab />}
          {activeTab === 'orders' && <OrdersTab orders={orders} ordersLoading={ordersLoading} />}
          {activeTab === 'wishlist' && <WishlistTab navigate={navigate} />}
          {activeTab === 'admin' && user.role === 'admin' && <AdminStatsTab stats={stats} />}
          {activeTab === 'pan' && <PanCardTab user={user} />}
          {activeTab === 'giftcards' && <GiftCardsTab user={user} />}
          {activeTab === 'upi' && <SavedUpiTab />}
          {activeTab === 'cards' && <SavedCardsTab />}
          {activeTab === 'coupons' && <CouponsTab />}
          {activeTab === 'reviews' && <ReviewsTab user={user} />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;