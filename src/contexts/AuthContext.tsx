import { createContext, ReactNode, useState, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: signUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type signUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {

        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')

    } catch {
        console.log('erro ao deslogar')
        
    }
}


export function AuthProvider({children} : AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect( () => {

        const { '@nextauth.token' : token } = parseCookies();

        if(token){

            api.get('/me').then( response => {

                const {id, name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })

            })
            .catch(() => {
                //se deu erro desloga o user
                signOut();
            }) 

        }
        


    }, [])

    async function signIn({email, password}: SignInProps){
        
        try {
            
            const response = await api.post('/session', {
                email,
                password
            })

            const {id, name, token} = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //Expirar em 1 mês
                path: "/" //Quais caminhos terão acesso ao cookie - no caso  "/" todos.
            });


            setUser({
                id,
                name,
                email
            })

            // passar para as proximas requisições o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso!');

            // Redirecionar para a pagina dashboard
            Router.push('/dashboard');


        } catch (error) {
            toast.error('Erro ao acessar!');
            console.log('Erro ao acessar', error);
            
        }
    }

    async function signUp({name, email, password}: signUpProps) {

        try {

            const response = await api.post('/users', {
                name,
                email,
                password
            })

            
            toast.success('Conta criada com sucesso!');

            Router.push('/');

            
        } catch (error) {
            toast.error('erro ao cadastrar');
            console.log("erro ao cadastrar", error);
        }

    }

    

    return(
        <AuthContext.Provider value={{ user,isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}