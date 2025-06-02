import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { loginUser, registerUser } from '../services/api';

export default function Login() {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(credentials);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Market Tax System Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}