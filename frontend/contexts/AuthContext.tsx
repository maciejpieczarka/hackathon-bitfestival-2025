import { createContext, useCallback, useState } from 'react';

export const URL = 'http://192.168.3.134:8000/'

interface UserAuthData {
  registerUser: (
    username: string,
    password: string,
    email: string
  ) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  email: string;
  password: string;
  token: string;
}

interface AuthContextProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<UserAuthData>({
  registerUser: async (username: string, password: string, email: string) => {
    return false;
  },
  loginUser: async (email: string, password: string) => {
    return false;
  },
  email: '',
  password: '',
  token: ''
});

export function AuthContextProvider({ children }: AuthContextProps) {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const loginUser = useCallback(async (email: string, password: string) => {
    const response = await fetch('http://192.168.3.138:8000/login', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(email + ':' + password),
        'Content-Type': 'application/json'
      }
    });

    console.log(response);
    console.log(typeof response.status);
    if (response.status === 200) {
      setEmail(email);
      setPassword(password);
      setToken('Basic ' + btoa(email + ':' + password));
      return true;
    } else {
      console.log('dupa, zle');
      return false;
    }
  }, []);

  const registerUser = useCallback(
    async (username: string, password: string, email: string) => {
      console.log(username, password, email);
      const response = await fetch('http://192.168.3.138:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        })
      });

      console.log(response);
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    },
    []
  );

  const authData: UserAuthData = {
    registerUser,
    loginUser,
    password,
    email,
    token
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
