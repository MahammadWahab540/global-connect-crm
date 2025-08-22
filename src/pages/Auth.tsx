
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Users, Shield } from 'lucide-react';

const demoCredentials = {
  admin: {
    email: 'admin@buildabroad.com',
    password: 'admin123',
    role: 'admin'
  },
  counselor: {
    email: 'counselor@buildabroad.com',
    password: 'counselor123',
    role: 'counselor'
  }
};

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check demo credentials
    const user = Object.values(demoCredentials).find(
      cred => cred.email === email && cred.password === password
    );

    if (user) {
      // Store user info in localStorage (demo only)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/counselor');
      }
    } else {
      setError('Invalid credentials. Please use demo credentials.');
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = (type: 'admin' | 'counselor') => {
    const creds = demoCredentials[type];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Build Abroad CRM</h1>
          <p className="text-gray-600 mt-2">Your Study Abroad Management Platform</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-yellow-800">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Admin Account</p>
                  <p className="text-xs text-gray-600">Full system access</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fillDemoCredentials('admin')}
              >
                Use
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Counselor Account</p>
                  <p className="text-xs text-gray-600">Lead management access</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fillDemoCredentials('counselor')}
              >
                Use
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
