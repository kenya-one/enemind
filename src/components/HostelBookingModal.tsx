import React, { useState } from 'react';
import {
  X,
  Home,
  Calendar,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  User,
  Mail,
  MapPin,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { HostelProperty, HostelBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface HostelBookingModalProps {
  isOpen: boolean;
  hostel: HostelProperty | null;
  onClose: () => void;
  onBookingSuccess: (booking: HostelBooking) => void;
}

export const HostelBookingModal: React.FC<HostelBookingModalProps> = ({
  isOpen,
  hostel,
  onClose,
  onBookingSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentPhone, setStudentPhone] = useState(user?.phone || '+254 700 000 000');
  const [moveInDate, setMoveInDate] = useState('2026-09-01');
  const [durationMonths, setDurationMonths] = useState(4);
  const [preferredViewingTime, setPreferredViewingTime] = useState('Morning (10:00 AM)');
  const [notes, setNotes] = useState('Interested in viewing the vacant units this week.');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !hostel) return null;

  const monthlyRent = hostel.rentKes;
  const landlordPhone = '+254712345678';

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello ${hostel.landlordName}, I saw your listing for "${hostel.title}" (Rent: KES ${monthlyRent.toLocaleString()}/mo) on Enemind. I would like to schedule a physical viewing for ${moveInDate}. My name is ${studentName || 'Student'} (${studentPhone}).`
    );
    window.open(`https://wa.me/${landlordPhone}?text=${text}`, '_blank');
    showToast(`Opening WhatsApp chat with ${hostel.landlordName}...`);
  };

  const handleDirectCall = () => {
    window.location.href = `tel:${landlordPhone}`;
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      showToast('Please provide your name and phone number');
      return;
    }

    setIsProcessing(true);

    const newInquiry: HostelBooking = {
      id: `inq_${Date.now()}`,
      hostelId: hostel.id,
      hostelTitle: hostel.title,
      landlordId: hostel.landlordId,
      landlordName: hostel.landlordName,
      studentId: user?.id || 'guest_student',
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      studentPhone: studentPhone.trim(),
      campusName: hostel.campusAffiliation || 'Campus Area',
      roomType: hostel.propertyType,
      unitNumber: 'Pending Viewing',
      moveInDate,
      durationMonths: Number(durationMonths),
      monthlyRentKes: monthlyRent,
      holdingDepositKes: 0,
      totalPaidKes: 0,
      status: 'confirmed_reserved',
      receiptNumber: `INQ-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
      setIsProcessing(false);
      onBookingSuccess(newInquiry);
      showToast(`Viewing request sent directly to ${hostel.landlordName}!`);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-5 relative">
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold uppercase tracking-wider">
                Direct Landlord Connection
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display text-white mt-0.5">
                Inquire & Book Free Viewing
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{hostel.campusAffiliation} • {hostel.title}</span>
          </p>
        </div>

        {/* Quick Contact Bar */}
        <div className="p-4 bg-teal-50 border-b border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-teal-950">Landlord: {hostel.landlordName}</p>
            <p className="text-[11px] text-teal-800">Rent: <b>KES {monthlyRent.toLocaleString()}/mo</b> (Pay direct to landlord on move-in)</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleDirectCall}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmitInquiry} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-[11px] text-slate-600">
              <b>Zero Middleman Fees:</b> Enemind does not hold your money. Viewings are 100% free, and rent payments are made directly between you and the verified landlord.
            </p>
          </div>

          {/* Student Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Your Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Kelvin Kimani"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phone Number (Calls/WhatsApp)
                </label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@ku.ac.ke"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>
          </div>

          {/* Viewing Preferences */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Viewing & Move-in Preference
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Intended Move-in Date
                </label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Preferred Time for Tour
                </label>
                <select
                  value={preferredViewingTime}
                  onChange={(e) => setPreferredViewingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
                >
                  <option value="Morning (10:00 AM)">Morning (10:00 AM)</option>
                  <option value="Afternoon (2:00 PM)">Afternoon (2:00 PM)</option>
                  <option value="Evening (4:30 PM)">Evening (4:30 PM)</option>
                  <option value="Weekend (Saturday)">Weekend (Saturday)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Message / Specific Questions for Landlord
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ask about water supply, Wi-Fi speed, electricity tokens..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="send-hostel-inquiry-btn"
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Send Free Viewing Request</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
