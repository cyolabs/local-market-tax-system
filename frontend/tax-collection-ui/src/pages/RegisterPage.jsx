import { useState } from 'react';
import { register, storeTokens } from '../services/AuthService';

function RegisterPage() {
    const [formData, setFormData] = useState({ ... });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            storeTokens(response.data);
            alert('Registered successfully!');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields for username, email, password, etc. */}
        </form>
    );
}
