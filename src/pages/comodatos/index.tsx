import { TopMenu } from "@/components/TopMenu"
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    // createRow,
    type MRT_ColumnDef,
    useMaterialReactTable,
} from 'material-react-table'; import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import axios from "axios";
import { isCPF } from 'validation-br'
const Comodatos = () => {
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined | boolean>
    >({});

    const [users, setUsers] = useState<any[]>([])
    const [products, setProducts] = useState([])


    const [data, setData]: any[] = useState([])


    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
            },
            {
                accessorKey: 'productName',
                header: 'Produto',
                editVariant: 'select',
                editSelectOptions: products
                    .map(el => el.title),

                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.productName,
                    helperText: validationErrors.productName
                }
            },
            {
                accessorKey: 'userName',
                header: 'Beneficiário',

                editVariant: 'select',
                editSelectOptions: users
                    .filter(el => el.type === 'Usuário')
                    .map(el => el.name),

                muiEditTextFieldProps(props) {
                    return ({
                        required: true,
                        error: !!validationErrors.userName,
                        helperText: validationErrors.userName,
                    })

                },

            },
            {
                accessorKey: 'amount',
                header: 'Quantidade',

                muiEditTextFieldProps(props) {
                    return ({
                        required: true,
                        error: !!validationErrors.amount,
                        helperText: validationErrors.amount,
                    })

                },

            },
            {
                accessorKey: 'active',
                header: 'Ativo',
                Cell(props) {
                    return props.renderedCellValue === 'Sim' ? <Chip label="Sim" color="success" /> : <Chip label='Não' color="error" />
                },
                editVariant: 'select',
                editSelectOptions: ['Sim', 'Não'],
                muiEditTextFieldProps: {
                    required: true,
                    select: true,
                    error: !!validationErrors.active,
                    helperText: validationErrors.active
                }
            },
            {
                accessorKey: 'returnExpectation',
                header: 'Expectativa de devolução',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.returnExpectation,
                    helperText: validationErrors.returnExpectation
                }
            },

        ],
        [products, users, validationErrors.active, validationErrors.amount, validationErrors.productName, validationErrors.returnExpectation, validationErrors.userName],
    );

    const validateLending = (lending: { id?: number, amount: string, userName: string, productName: string, active: 'Sim' | 'Não', returnExpectation: string }, isEdit = false, IdEdit = 0) => {
        const product = products.find(el => el.title === lending.productName)


        const tocalculate = {
            isEdit,
            estoqueTotal: product.quantityInStock,
            quantidadeDoProdutoAtual: data.find(el => el.id === IdEdit)?.amount ?? 0,
            totalEmprestado: product.lendingAmount,

        }
        const resultToEdit = tocalculate.estoqueTotal - (tocalculate.totalEmprestado - tocalculate.quantidadeDoProdutoAtual)

        return {
            userName: lending.userName.length > 0 ? '' : 'Beneficiário é obrigatório',
            productName: lending.productName.length > 0 ? '' : 'Produto é obrigatório',
            active: lending.active === 'Sim' || lending.active === 'Não' ? '' : 'Deve ser selecionado uma opção',
            returnExpectation: /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/(20)\d{2}$/.test(lending.returnExpectation) ? '' : 'Data deve seguir padrão DD/MM/AAAA',
            amount: Number(lending.amount) > 0 && (isEdit ? Number(lending.amount) <= resultToEdit : lending.amount <= product.availableAmount) && lending.amount <= product.quantityInStock ? '' :
                `Quantidade precisa ser maior que 0 e até ${isEdit ? resultToEdit : product.availableAmount} que estão disponíveis`
        }
    }

    const table = useMaterialReactTable({
        columns,
        data,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: false
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: async ({ values }) => {
            const newValidationErros = validateLending(values as any)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/lending', {
                productId: products.find(el => el.title === values.productName)?.id,
                userId: users.find(el => el.name === values.userName)?.id,
                active: values.active === 'Sim',
                returnExpectation: values.returnExpectation,
                amount: Number(values.amount)
            })

            getProducts()
            getLendings()
            return table.setCreatingRow(null)


        },
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: async ({ values }: any) => {

            const newValidationErros = validateLending(values as any, true, values.id)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/lending', {
                id: values.id,
                productId: products.find(el => el.title === values.productName)?.id,
                userId: users.find(el => el.name === values.userName)?.id,
                active: values.active === 'Sim',
                returnExpectation: values.returnExpectation,
                amount: Number(values.amount)
            })
            getProducts()
            getLendings()

            return table.setEditingRow(null)

        },
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Criar novo comodato</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Editar comodato</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>

            </Box >
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                variant="contained"
                onClick={() => {
                    table.setCreatingRow(true);
                }}
            >
                Criar novo comodato
            </Button>
        ),

    });

    const getUsers = async () => {
        const response = await axios.get('/api/users')
        setUsers(response.data)
    }
    const getProducts = async () => {
        const response = await axios.get('/api/product')
        setProducts(response.data)
    }

    const getLendings = useCallback(async () => {
        const response = await axios.get('/api/lending')
        setData(response.data.map(el => ({
            ...el,
            userName: users.find(user => user.id === el.userId)?.name,
            productName: products.find(product => product.id === el.productId)?.title,
            active: el.active ? 'Sim' : 'Não'

        })))
    }, [products, users])



    useEffect(() => {
        if (products.length && users.length) {
            getLendings()
            return
        }
        getProducts()
        getUsers()
    }, [getLendings, products, products.length, users, users.length])

    if (!users.length || !products.length || !data.length) {
        <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </div>
    }

    return (
        <>
            <TopMenu />
            <Box component={'div'} sx={{ margin: '1rem' }}>

                <p style={{ fontSize: 30, fontWeight: 600 }}>Controle de Comodatos</p>

                <MaterialReactTable table={table} />

            </Box>

        </>
    )

}

export default Comodatos