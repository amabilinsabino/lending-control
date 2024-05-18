import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUser, getUserFromApi, resetUser } from "@/store/slices/user.slice";
import { Avatar, Box, CircularProgress, IconButton, Tooltip } from "@mui/material"
import React, { useEffect } from "react"
import { useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
import Link from "next/link";

export const TopMenu = () => {
    const dispatch = useAppDispatch()

    const router = useRouter()
    const selectedUser = useAppSelector(getUser)



    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')?.[1]?.[0] ?? ''}`,
        };
    }

    useEffect(() => {
        if (!selectedUser) {
            const documentFromCookie = Cookies.get('document')
            if (!documentFromCookie) {
                router.push('/login')
            }


            dispatch(getUserFromApi(documentFromCookie as string))
        }
    }, [selectedUser])

    if (!selectedUser) {
        return <CircularProgress />
    }

    return (
        <Box component={'div'}
            sx={{

                display: 'flex',
                width: '100vw',
                justifyContent: 'space-between',
                padding: '0.5rem',
                boxShadow: '2px 4px 5px -1px rgba(0,0,0,0.24)',
                alignItems: 'center',
                background: 'white'
            }}
        >
            <Link href={'/menu'} style={{ fontSize: '20px', fontWeight: 700, textDecoration: 'none', color: 'black' }} >SCC</Link>

            <Box component={'div'} sx={{ display: 'flex', alignItems: 'center' }}><p style={{ fontSize: '20px', color: '#fd0', fontWeight: 700 }} >Bee</p> <p style={{ fontSize: '20px', fontWeight: 700 }}>Delivery</p></Box>

            <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                <Avatar {...stringAvatar(selectedUser?.name)} />
                <p>{selectedUser?.name!}</p>
                <Tooltip title="Sair">
                    <IconButton onClick={() => {
                        Cookies.remove('document')

                        router.push('/login')
                    }}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>



        </Box>
    )
}