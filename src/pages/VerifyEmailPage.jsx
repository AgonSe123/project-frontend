import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const tokenFromUrl = searchParams.get('token') ?? '';

  const [token, setToken] = useState(tokenFromUrl);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authApi.verifyEmail(token);
      setMessage('Email verified successfully. You can now log in.');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Card title="Verify your email">
        <p className="text-muted">
          {emailFromState
            ? `We sent a confirmation link to ${emailFromState}. Paste the token below or open the link from your email.`
            : 'Enter the confirmation token from your email.'}
        </p>
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}
        <form className="form-stack mt-2" onSubmit={handleSubmit}>
          <Input
            label="Confirmation token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <Button type="submit" loading={loading}>
            Confirm email
          </Button>
        </form>
        <p className="mt-2">
          <Link to="/login">Back to login</Link>
        </p>
      </Card>
    </div>
  );
}
