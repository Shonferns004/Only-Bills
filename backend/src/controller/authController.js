import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';

export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash, display_name: displayName })
      .select('id, email, display_name')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }

    res.status(201).json({
      user: {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, display_name')
      .eq('email', email)
      .maybeSingle();

    if (!user || error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, displayName, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id, email, display_name')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.json({
        user: {
          id: existing.id,
          email: existing.email,
          displayName: existing.display_name,
        },
      });
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        display_name: displayName || email?.split('@')[0],
        google_id: googleId,
      })
      .select('id, email, display_name')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Google signup failed' });
    }

    res.status(201).json({
      user: {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
