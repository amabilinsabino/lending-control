import { TopMenu } from "@/components/TopMenu"
import {
    Box,
    Button,
    Chip,
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
} from 'material-react-table'; import { useEffect, useMemo, useState } from "react";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import axios from "axios";
import { isCPF } from 'validation-br'
const Acessos = () => {
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined | boolean>
    >({});


    const [data, setData]: any[] = useState([])

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
            },
            {
                accessorKey: 'name',
                header: 'Nome',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.name,
                    helperText: validationErrors.name
                }
            },
            {
                accessorKey: 'document',
                header: 'Documento',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.document,
                    helperText: validationErrors.document,
                }
            },
            {
                accessorKey: 'type',
                header: 'Tipo',
                editVariant: 'select',
                editSelectOptions: ['Usuário', 'Funcionário'],
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.type,
                    helperText: validationErrors.type,
                }
            },
            {
                accessorKey: 'deleted',
                header: 'Ativo',
                Cell(props) {
                    return !props.renderedCellValue ? <Chip label="Sim" color="success" /> : <Chip label='Não' color="error" />
                },
                editVariant: 'select',
                editSelectOptions: ['Sim', 'Não'],
                muiEditTextFieldProps: {
                    required: true,
                    select: true,
                    error: !!validationErrors.deleted,
                    helperText: validationErrors.deleted
                }
            },

        ],
        [validationErrors],
    );

    const validateUser = (user: { id?: number, name: string, document: string, deleted: string }) => {
        return {
            name: user.name.length > 0 ? '' : 'Nome é obrigatório',
            document: user.document.length > 0
                && isCPF(user.document)
                && user.document.includes('-')
                && user.document.includes('.')
                && !data.find((el): any => el.document === user.document && el.id !== user.id)
                ? '' : 'CPF inválido ou já existe - Formato 999.999.999-21',
            deleted: user.deleted === 'Sim' || user.deleted === 'Não' ? '' : 'Deve ser selecionado uma opção'
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
            const newValidationErros = validateUser(values as any)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/users', {
                name: values.name,
                document: values.document,
                deleted: values.deleted === 'Não',
                type: values.type
            })
            getUsers()
            return table.setCreatingRow(null)


        },
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: async ({ values }: any) => {

            const newValidationErros = validateUser(values as any)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/users', {
                id: values.id,
                name: values.name,
                document: values.document,
                deleted: values.deleted === 'Não',
                type: values.type
            })
            getUsers()
            return table.setEditingRow(null)

        },
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Criar novo usuário</DialogTitle>
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
                <DialogTitle variant="h3">Editar usuário</DialogTitle>
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
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Criar novo usuário
            </Button>
        ),

    });

    const getUsers = async () => {
        const response = await axios.get('/api/users')
        setData(response.data)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <TopMenu />
            <Box component={'div'} sx={{ margin: '1rem' }}>

                <p style={{ fontSize: 30, fontWeight: 600 }}>Controle de Acesso</p>

                <MaterialReactTable table={table} />

            </Box>

        </>
    )

}

export default Acessos