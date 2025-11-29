import { createContext, useCallback, useState } from 'react';

interface UserAuthData {
  registerUser: (username: string, password: string, email: string) => void,
  loginUser: (email: string, password: string) => void,
  username: string,
  email: string,
  password: string,
}

interface AuthContextProps {
  children: React.ReactNode
}

export const AuthContext = createContext<UserAuthData>({
  registerUser: (username: string, password: string, email: string) => {},
  loginUser: (email: string, password: string) => {},
  email: '',
  username: '',
  password: ''
})

export function AuthContextProvider({children}: AuthContextProps) {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')


  const loginUser = useCallback((email: string, password: string) => {
    const response = fetch('192.168.3.138', {
        method: 'POST',
        headers: {
          "Authorization": btoa(username + ':' + password)
        }
      }
    )
  }, [])

  const registerUser = useCallback((username: string, password: string, email: string) => {
    console.log(username, password, email)
    const response = fetch('http://192.168.3.138:8000/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        })
      }).then((value) => {
      console.log(value.status)

    })
  }, [])

  const authData: UserAuthData = {
    registerUser,
    loginUser,
    username,
    password,
    email,
  }

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  )
}