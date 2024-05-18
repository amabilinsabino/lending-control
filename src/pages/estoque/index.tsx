import { TopMenu } from "@/components/TopMenu"
import {
    Box,
    Button,
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
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
} from 'material-react-table'; import { useEffect, useMemo, useState } from "react";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import axios from "axios";
import { url } from "inspector";

const Estoque = () => {
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string | undefined>
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
                accessorKey: 'title',
                header: 'Título',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.title,
                    helperText: validationErrors.title
                }
            },
            {
                accessorKey: 'description',
                header: 'Descrição',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.description,
                    helperText: validationErrors.description
                }
            },
            {
                accessorKey: 'availableAmount',
                header: 'Quantidade Disponível Para ações',
                enableEditing: false,

            },
            {
                accessorKey: 'lendingAmount',
                header: 'Quantidade em comodato',
                enableEditing: false,

            },
            {
                accessorKey: 'quantityInStock',
                header: 'Quantidade total',
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.quantityInStock,
                    helperText: validationErrors.quantityInStock
                }
            },
        ],
        [validationErrors],
    );

    const validateProduct = (product: { id?: number, title: string, description: string, quantityInStock: string, lendingAmount: number }) => {

        return {
            title: product.title.length > 0 ? '' : 'Título é obrigatório',
            description: product.title.length > 0 ? '' : 'Descrição é obrigatório',
            quantityInStock: product.quantityInStock && !isNaN(Number(product.quantityInStock)) && Number(product.quantityInStock) >= product.lendingAmount ? '' : 'Quantidade precisa ser maior ou igual ao número disponível'
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
            const newValidationErros = validateProduct(values as any)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/product', {
                title: values.title,
                description: values.description,
                quantityInStock: Number(values.quantityInStock)
            })
            getEstoque()
            return table.setCreatingRow(null)


        },
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: async ({ values }: any) => {

            const newValidationErros = validateProduct(values as any)

            if (Object.values(newValidationErros).some(error => error)) {
                setValidationErrors(newValidationErros)
                return
            }

            setValidationErrors({});

            await axios.post('/api/product', {
                id: values.id,
                title: values.title,
                description: values.description,
                quantityInStock: Number(values.quantityInStock)
            })
            getEstoque()
            return table.setEditingRow(null)

        },
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Criar novo item</DialogTitle>
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
                <DialogTitle variant="h3">Editar item</DialogTitle>
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
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={async () => {

                        await axios.delete(`/api/product/${row.original.id}`).then(() => {
                            getEstoque()

                        })
                    }}>
                        <DeleteIcon />
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
                Criar novo item
            </Button>
        ),

    });

    const getEstoque = async () => {
        const response = await axios.get('/api/product')
        setData(response.data)
    }

    useEffect(() => {
        getEstoque()
    }, [])

    return (
        <>
            <TopMenu />
            <Box component={'div'} sx={{ margin: '1rem' }}>

                <p style={{ fontSize: 30, fontWeight: 600 }}>Controle de estoque</p>

                <MaterialReactTable table={table} />

            </Box>

        </>
    )

}

export default Estoque