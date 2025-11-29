import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../Common/Input';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/products');
    } catch (error) {
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whisper-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <Input
            type="text"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
            placeholder="johndoe"
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="you@example.com"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="John"
            />

            <Input
              type="text"
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>

          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            placeholder="••••••••"
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            placeholder="••••••••"
          />

          <div className="text-xs text-gray-600">
            Password must be at least 8 characters and contain:
            <ul className="list-disc list-inside mt-1">
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
            </ul>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
