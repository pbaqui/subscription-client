import React, {useContext, useState} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Container, TextField, Button, InputAdornment } from "@material-ui/core";
// import Background from "assets/img/background.png"
import AuthService from "services/AuthService";
import AuthContext from "contexts/AuthContext";
import { toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
  // '@global': {
  //   body: {
  //     // backgroundImage: 'url(' + Background + ')'
  //     background: 'linear-gradient(45deg, #00a1c0 30%, #006174 90%)'
  //   },
  // },
  typography: {
    fontWeight: 'bold',
    fontSize: 90,
    fontFamily: 'Arial',
    color: 'white'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Signin(props) {
  const classes = useStyles();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const submit = async (e) => {
    e.preventDefault();
   
    if (email !== '' && password !== '') {
      setLoading(true);
      const response = await AuthService.signin(email, password);

      console.log(response)

      if (response.status === "OK") {
        authContext.updateUser();
        props.history.push(`/`);
      }else {
        setLoading(false);
        toast.error("Correo o password no válidos.");
      }
    } else {
        setLoading(false);
        toast.error("Ingrese un correo y password.");
    }
  }
  
  return (
    <>
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {loading ? 
            <CircularProgress/> 
            : <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
        }
        {/* <Typography>
          Subscription Client
        </Typography> */}
        <form className={classes.form} onSubmit={submit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
            autoFocus
            onChange={e => {
              setEmail(e.target.value);
            }}
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon />
                </InputAdornment>
              ),
            }}
            autoComplete="current-password"
            onChange={e => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled = {loading}
          >
            Ingresar
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
    </Container>
    </>
  );
}
