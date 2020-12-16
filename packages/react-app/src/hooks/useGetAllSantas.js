import { useState, useEffect } from 'react'; 
import { useWeb3React } from '@web3-react/core'; 
import { abis, addresses } from "@project/contracts"

const useGetAllSantas =  () => {
    const { account, library, chainId } = useWeb3React();

    const [ Santas, SetSantas] = useState();
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            let Contract;

            if (chainId === 3 ) {
              Contract = new library.eth.Contract(abis.secretsanta, addresses.ropstenSanta);
              
            } else if (chainId === 42 ) {
              Contract = new library.eth.Contract(abis.secretsanta, addresses.kovanSanta);

            } else if (chainId === 4 ) {
              Contract = new library.eth.Contract(abis.secretsanta, addresses.rinkebySanta);
            }

            Contract.methods.getOverallSantas().call().then((Santas) =>{
                if (!stale) {
                    SetSantas(Santas)
                }
              })
              .catch(() => {
                if (!stale) {
                    SetSantas(null)
                }
              })
      
            return () => {
              stale = true
              SetSantas(undefined)
            }
          }
        }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

    return Santas;         

  }

export default useGetAllSantas; 