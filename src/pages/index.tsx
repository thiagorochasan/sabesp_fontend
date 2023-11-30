
import{FormEvent, useState} from 'react';

import Head from 'next/head';
import styles from '../../styles/home.module.scss';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import { setupAPIClient } from "../services/api";

export default function Home() {

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [contato, setContato] = useState('');

  const [loading, setLoading] = useState(false);


  async function handleServico(event: FormEvent){
    event.preventDefault();

      try {

        if(nome == '' || endereco == '' || contato == ''){
            toast.warn("Preencha todos os dados!");
            return;
        }

        
        
        setLoading(true);

        const apiClient = setupAPIClient();

        await apiClient.post('/servico', {
            nome: nome,
            endereco: endereco,
            contato: contato
        })
        toast.success("Enviado com sucesso!");

        setLoading(false);


    } catch (error) {
        console.log(error);
        toast.error("Ops erro ao cadastrar!");
        setLoading(false);
    }

    setNome('');
    setEndereco('');
    setContato('');
  
  }

  return (
    <>
    <Head>
      <title>*** Preencha os dados do serviço</title>
    </Head>

    <div className={styles.containerCenter}>
      <div className={styles.login}>
        <form onSubmit={handleServico}>
          <Input 
            placeholder="Digite o serviço" 
            type="text"
            value={nome}
            onChange={ (e) =>  setNome(e.target.value) }
          />

          <Input
            placeholder="Digite o Endereço" 
            type="text"
            value={endereco}
            onChange={ (e) =>  setEndereco(e.target.value) }
          />

          <Input
            placeholder="Digite o contato" 
            type="text"
            value={contato}
            onChange={ (e) =>  setContato(e.target.value) }
          />


          <Button type="submit" loading={loading}>Enviar</Button>

        </form>

      </div>
    </div>
    </>
  )
}


