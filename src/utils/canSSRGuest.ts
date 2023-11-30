import { parseCookies, setCookie } from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

// função para páginas que só podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        // Se tentar acessar a pagina tendo um login salvo no cookie - redirecionamos pra dashboard

        if (cookies['@nextauth.token']) {
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }   
            
        }
        return await fn(ctx);
    }

}

