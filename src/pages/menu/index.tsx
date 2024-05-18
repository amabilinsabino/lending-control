import { TopMenu } from "@/components/TopMenu"
import { Box } from "@mui/material"
import { useRouter } from "next/router"

const Menu = () => {
    const MENU_ITEMS = [
        {
            name: 'Controle de estoque',
            id: 0,
            link: '/estoque',
        },
        {
            name: 'Controle de comodato',
            id: 0,
            link: '/comodatos'
        },
        {
            name: 'Controle de acesso',
            id: 0,
            link: '/acessos'
        }
    ]

    const router = useRouter()

    return (
        <Box component={'div'}
            sx={{
                width: '100vw',
                height: '100vh',
            }} >
            <TopMenu />
            <Box component={'div'}
                sx={{
                    display: 'flex',
                    gap: '10px',
                    margin: '1rem'
                }}
            >
                {MENU_ITEMS.map(item => (
                    <Box component={'div'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '200px',
                            padding: '1rem',
                            borderRadius: '10px',
                            textAlign: 'center',
                            border: '1px solid white',
                            cursor: 'pointer',
                            transition: 'border 0.2s',
                            background: 'white',
                            ':hover': {
                                border: '1px solid #fd0'
                            }
                        }}
                        onClick={() => router.push(item.link)}
                        key={item.id}
                    >
                        {item.name}

                    </Box>
                ))
                }

            </Box >

        </Box >
    )
}

export default Menu