import type { VFormErrors } from "src/repositories/forms";

import * as yup from 'yup';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Box, Grid, Button, Checkbox, Typography, LinearProgress, FormControlLabel } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { VForm, UseVForm, TextFieldComponent } from "src/repositories/forms";

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
    const { id = 'novo' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { formRef } = UseVForm();

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [formData, setFormData] = useState<IFormData>({
        name: '',
        display_name: '',
        about: '',
        types_id: '',
        is_public: false,
        peopleImages: []
    });

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
                        formRef.current?.setData(result.data);
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
        console.log("Dados recebidos no handlesave:", dados);
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
                            console.log("Resposta da API (create:", result);

                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                alert("Usuário salvo com sucesso!");

                                formRef.current?.reset();
                                setFormData({
                                    name: '',
                                    display_name: '',
                                    about: '',
                                    types_id: '',
                                    is_public: false,
                                    peopleImages: []
                                });
                                navigate(`/user/${result}`);
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            alert(error.message);
                        });
                } else {
                    PeopleService.updateById(id, {
                        ...dadosValidados, id,
                        created_at: dadosValidados.created_at || '',
                        updated_at: dadosValidados.updated_at || ''
                    })
                        .then((result) => {
                            setLoading(false);

                            if (result instanceof Error) {
                                alert(result.message);
                            } else {
                                alert("Usuário atualizado com sucesso!");
                                formRef.current?.reset();
                                setFormData({
                                    name: '',
                                    display_name: '',
                                    about: '',
                                    types_id: '',
                                    is_public: false,
                                    peopleImages: []
                                });
                                navigate('/user');
                            };
                        });
                }
            })
            .catch((errors: yup.ValidationError) => {
                const validationErrors: VFormErrors = {};
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
                    {id === 'novo' ? 'Cadastro de Usuário' : `Editar Usuário: ${name}`}
                </Typography>
            </Box>
            {loading && <LinearProgress />}
            <VForm
                ref={formRef}
                onSubmit={handleSave}
                placeholder=""
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
            >
                <Box>
                    <Grid container direction="column" padding={2} spacing={2} sx={{ mb: 2 }} />
                    {/* {loading && (
                    <Grid item>
                    <LinearProgress variant="indeterminate" />
                    </Grid>
                    )} */}
                    <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextFieldComponent
                                fullWidth
                                label="Nome"
                                name="name"
                                value={formData.name}
                                disabled={loading}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextFieldComponent
                                fullWidth
                                label="Display Name"
                                name="display_name"
                                value={formData.display_name}
                                disabled={loading}
                                onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                            />
                            <Grid container item direction="row" spacing={2} sx={{ mt: 0.25 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextFieldComponent
                                        fullWidth
                                        label="Sobre"
                                        name="about"
                                        multiline
                                        rows={4}
                                        value={formData.about}
                                        disabled={loading}
                                        onChange={e => setFormData({ ...formData, about: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextFieldComponent
                                fullWidth
                                label="Tipo"
                                name="types_id"
                                value={formData.types_id}
                                disabled={loading}
                                onChange={e => setFormData({ ...formData, types_id: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="is_public"
                                        checked={formData.is_public}
                                        disabled={loading}
                                        onChange={e => setFormData({ ...formData, is_public: e.target.checked })}
                                    />
                                }
                                label="Público"
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Button sx={{ marginRight: 2 }} onClick={() => formRef.current?.submitForm()} variant="contained" color="primary" >
                    Salvar
                </Button>
                <Button onClick={() => navigate(-1)} variant="outlined">
                    Voltar
                </Button>
            </VForm>
        </DashboardContent >
    );
}; 