import type { FormErrors } from "src/repositories/forms";

import * as yup from 'yup';
import { Form } from "@unform/web";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Box, Grid, Button, TextField, Typography, LinearProgress } from "@mui/material";

import { UseForm } from "src/repositories/forms";
import { DashboardContent } from "src/layouts/dashboard";

import { PeopleService } from "./PeopleService";



interface IFormData {
    id?: string;
    name: string;
    display_name: string;
    about: string;
    types_id: string;
    is_public: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    peopleImages: unknown[];
}

const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
    name: yup.string().required('Nome é obrigatório').min(5, 'O nome precisa ter pelo menos 5 caracteres'),
    display_name: yup.string().required('Display Name é obrigatório'),
    about: yup.string().required('Sobre é obrigatório'),
    types_id: yup.string().required('Tipo é obrigatório'),
    is_public: yup.boolean().required('Visibilidade é obrigatória'),
    created_at: yup.string().notRequired(),
    updated_at: yup.string().notRequired(),
    peopleImages: yup.array().of(yup.mixed()).required('As imagens são obrigatórias'),
});

export const PeopleDetail: React.FC = () => {
    const { id = 'novo' } = useParams<'id'>();
    const navigate = useNavigate();
    const { formRef, save } = UseForm();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        if (id !== 'novo') {
            setLoading(true);

            PeopleService.getById(id)
                .then((result) => {
                    setLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/user');
                    } else {
                        setName(result.data.name);
                        setDisplayName(result.data.display_name);
                    }
                });
        } else {
            formRef.current?.setData({
                name: '',
                display_name: '',
                about: '',
                types_id: '',
                is_public: false,
                peopleImages: [],
            });
            setName('');
        }
    }, [id, navigate, formRef]);

    const handleSave = (dados: IFormData) => {
        formValidationSchema
            .validate(dados, { abortEarly: false })
            .then((dadosValidados) => {
                setLoading(true);

                if (id === 'novo') {
                    PeopleService.create({
                        ...dadosValidados,
                        created_at: dadosValidados.created_at || '',
                        updated_at: dadosValidados.updated_at || ''
                    })
                        .then((result) => {
                            setLoading(false);

                            if (result instanceof Error) {
                                alert(result.message);
                            }
                            save();
                            navigate(`/user/${result}`);

                        });
                    PeopleService.updateById(id, {
                        ...dadosValidados, id,
                        created_at: dadosValidados.created_at || '',
                        updated_at: dadosValidados.updated_at || ''
                    })
                        .then((result) => {
                            setLoading(false);

                            if (result instanceof Error) {
                                alert(result.message);
                            }
                            save();
                            navigate('/user');
                        });
                }
            })
            .catch((errors: yup.ValidationError) => {
                const validationErrors: FormErrors = {};
                errors.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                });

                formRef.current?.setErrors(validationErrors);
            });
    };


    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" flexGrow={1}>
                    Cadastro Usuário
                </Typography>
                <Form ref={formRef} onSubmit={handleSave} initialData={{}} noValidate placeholder="" onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
                    <Button onClick={() => formRef.current?.submitForm()} variant="contained" color="inherit">
                        Salvar
                    </Button>
                </Form>
                <Button onClick={() => navigate(-1)} variant="outlined">
                    Voltar
                </Button>
            </Box>
            <Box>
                <Grid container direction="column" padding={2} spacing={2} sx={{ mb: 2 }} />
                {loading && (
                    <Grid item>
                        <LinearProgress variant="indeterminate" />
                    </Grid>
                )}
                <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nome"
                            name="name"
                            disabled={loading}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Display Nome"
                            name="display_name"
                            disabled={loading}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Sobre"
                            name="about"
                            disabled={loading}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Tipo"
                            name="types_id"
                            disabled={loading}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Público"
                            name="is_public"
                            disabled={loading}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>
        </DashboardContent>
    );
}; 