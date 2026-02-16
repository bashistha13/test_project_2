import { useState, useRef } from 'react';
import { Send, Loader2, Mail, Paperclip, X, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// ✅ FIXED: Updated to match your Swagger Port (5175)
const API_BASE_URL = "http://localhost:5175"; 

export const TestEmail = () => {
  const { token } = useAuth();
  
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string, detail?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('ToEmail', toEmail);
    formData.append('Subject', subject);
    formData.append('Message', message);
    if (attachment) {
      formData.append('Attachment', attachment);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/email/send`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus({ type: 'success', msg: 'Email sent successfully!' });
      
      // Reset Form
      setToEmail('');
      setSubject('');
      setMessage('');
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (err: any) {
      console.error("Full Email Error:", err);
      
      let errorMsg = "Failed to send email.";
      let detailMsg = "";

      if (err.response) {
        errorMsg = `Server Error (${err.response.status})`;
        detailMsg = err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err.request) {
        errorMsg = "Connection Refused (Network Error)";
        detailMsg = `Could not reach ${API_BASE_URL}. Please check if the Backend is running on Port 5175.`;
      } else {
        detailMsg = err.message;
      }

      setStatus({ type: 'error', msg: errorMsg, detail: detailMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <Mail size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Email System</h2>
          <p className="text-sm text-gray-500">
            Connected to: <span className="font-mono bg-gray-100 px-1 rounded">{API_BASE_URL}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status && (
          <div className={`p-4 rounded-lg text-sm flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {status.type === 'error' ? <AlertTriangle size={20} className="shrink-0" /> : <CheckCircle size={20} className="shrink-0" />}
            <div>
              <p className="font-bold">{status.msg}</p>
              {status.detail && <p className="mt-1 opacity-90">{status.detail}</p>}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Email</label>
          <input
            type="email"
            required
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            required
            rows={4}
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm"
            >
              <Paperclip size={16} />
              {attachment ? "Change File" : "Choose File"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            {attachment && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                {attachment.name}
                <button 
                  type="button" 
                  onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Send Email
        </button>
      </form>
    </div>
  );
};