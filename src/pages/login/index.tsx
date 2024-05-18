import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUser, getUserFromApi, resetUser } from '@/store/slices/user.slice';
import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie'

import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import InputMask from "react-input-mask";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const Login = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const selectUser = useSelector(getUser)
    const [document, setDocument] = useState('')

    const fetchData = async () => {
        const response = await dispatch(getUserFromApi(document))
        if (response.meta.requestStatus === 'fulfilled') {
            toast.success("Usuário encontrado")
            Cookies.set('document', document, { expires: 999999 })

            router.push('/menu')
        } else {
            toast.error("Usuário não encontrado")

        }

    }

    useEffect(() => {
        const documentFromCookie = Cookies.get('document')
        if (documentFromCookie) {
            setDocument(documentFromCookie)
        }
        dispatch(resetUser())
    }, [dispatch])


    return (
        <Box component="div" sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fd0' }}>
            <Box component={'form'} onSubmit={e => {
                e.preventDefault()
                fetchData()
            }} sx={{ display: 'flex', flexDirection: 'column', minWidth: '400px', background: 'white', padding: '2rem', borderRadius: '10px', gap: '10px' }}>
                <p>Digite seu CPF para acessar os sistema</p>

                <InputMask
                    mask="999.999.999-99"
                    maskChar=" "
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                >
                    {/* @ts-ignore */}
                    {() => <TextField />}
                </InputMask>
                <Button type='submit' variant='contained' fullWidth >Entrar</Button>
            </Box>
        </Box>)
}

export default Login