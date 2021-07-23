import React, {useState} from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Search from "@material-ui/icons/Search";
import {useForm} from 'react-hook-form';
import { toast } from "react-toastify";
import Button from "components/CustomButtons/Button.js";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogActions from '@material-ui/core/DialogActions';
import usuarioService from "services/UsuarioService";
import Alert from '@material-ui/lab/Alert';
import service from "services/ClaseService";

const styles = {
  root: {
    maxWidth: 345,
  },
  alert: {
    marginTop: '1rem',
  },
};

const useStyles = makeStyles(styles);

export default function ReservarDialog(props) {
  const classes = useStyles();
  const { onClose, data, open } = props;
  const [mensaje, setMensaje] = useState(null);
  const { register, handleSubmit, errors, getValues} = useForm({});

  const handleClose = () => {
    onClose(false);
  }

  const handleSearch = async () => {
    const ci= getValues("ci");
    if (ci) {
      try {
        const response = await usuarioService.getUserDisponibleByCi(ci, data);
        setMensaje(response);
      } catch (e){
        console.log(e)
        setMensaje({type: "error", data:"Ocurrió un error al obtener el socio"});
      }
    } else {
      setMensaje({type: "warning", data:"Debe ingresar la cedula del socio"});
    }
  }

  const onSubmitAdmin = async(ci) => {  
    if (mensaje && mensaje.type === "success"){
      const response = await service.saveReserva(data, mensaje.usuario);
      if (response.status === 'OK') {
        toast.success(response.message)
        handleClose();
      } else {
        toast.error(response.message)
      }
    } else {
      setMensaje({type: "warning", data:"El usuario no es valido"});
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Seleccione el Socio</DialogTitle>
        <form noValidate onSubmit={handleSubmit(onSubmitAdmin)}>
        <DialogContent>
          <TextField
            required
            id="ci"
            name="ci"
            label="Cédula de Identidad"
            fullWidth
            inputRef={register({ required: true })}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={handleSearch}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {errors.ci && <span style={{color:'red'}}>* Este campo es obligatorio</span>}
          {mensaje &&  <Alert className={classes.alert} severity={mensaje.type}>{mensaje.data}</Alert>}
        </DialogContent> 
        <DialogActions>
            <Button color="secondary" aria-label="guardar" onClick={handleClose}>
                Cancelar
              </Button>
              <Button color="primary" aria-label="guardar" type="submit">
                Guardar
              </Button>
        </DialogActions>
        </form>
    </Dialog>
  );
}

ReservarDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};
