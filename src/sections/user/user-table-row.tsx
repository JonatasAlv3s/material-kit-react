import type { IPeople } from 'src/repositories/erp/private/people/peoples/Interface';

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

import { PeopleService } from 'src/repositories/erp/private/people/peoples/PeopleService';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------



type UserTableRowProps = {
  row: IPeople;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function UserTableRow({ row, selected, onSelectRow, onEdit, onDelete }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setTimeout(() => {
      setOpenPopover(null);
    }, 100);
  }, []);

  const handleEdit = () => {
    navigate(`/edit/${row.id}`);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setOpenDialog(false);
      const result = await PeopleService.deleteById(row.id);

      if (result instanceof Error) {
        alert(result.message);
      } else {
        alert('Registro deletado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Ocorreu um erro ao deletar o registro.');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={Array.isArray(row.peopleImages) ? row.peopleImages[0] as string : ''} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.display_name}</TableCell>

        <TableCell>{row.about}</TableCell>

        <TableCell align="center">
          {row.types_id ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          <Label color={row.created_at ? 'primary' : 'default'}>{row.created_at}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow >

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Deletar
          </MenuItem>
        </MenuList>
      </Popover>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja deletar o usuário <strong>{row.name}</strong>? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color='inherit'>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color='error' variant='contained'>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
