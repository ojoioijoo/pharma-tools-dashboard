import { useState } from 'react';
import { login, TOKEN_KEY } from '../api.js';
import { LogoIcon } from './icons.jsx';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError('');
    try {
      const data = await login(password);
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin();
      } else {
        setError(data.error || 'Λάθος password');
        setPassword('');
      }
    } catch {
      setError('Σφάλμα σύνδεσης');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FB] px-4 font-sans">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-[20px] shadow-card p-8">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-[38px] h-[38px] rounded-xl bg-primary flex items-center justify-center shrink-0">
            <LogoIcon stroke="#FFFFFF" />
          </div>
          <div className="font-heading font-bold text-[16.5px] leading-tight text-[#1D2144]">
            Φαρμακείο
            <br />
            Μελενικίτσι
          </div>
        </div>

        <div className="text-[10px] tracking-wider font-semibold text-[#8A8FA3] mb-2">PASSWORD</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full box-border border border-[#E7E9F5] rounded-xl px-4 py-3 text-sm font-sans outline-none mb-3 text-[#1D2144]"
        />

        {error && <div className="text-danger text-xs font-semibold mb-3">{error}</div>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Σύνδεση...' : 'Σύνδεση'}
        </button>
      </form>
    </div>
  );
}
