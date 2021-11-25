import './App.css';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { InputAdornment, Snackbar, Alert, Box, Button, Paper, Table, TableContainer, TablePagination, TableHead, TableCell, TableBody, TableRow, Modal, tableCellClasses, TextField } from '@mui/material';
import axios from 'axios';
import { Edit, Delete, Search } from '@mui/icons-material'
import { ModalFooter, ModalHeader } from 'reactstrap';
import { styled } from '@mui/material/styles';
import AddBoxIcon from '@mui/icons-material/AddBox';

function App() {

  const url = "https://619a902027827600174452b1.mockapi.io/productos/";

  const [productos, setProductos] = useState();
  const [grillaProductos, setGrillaProductos] = useState([]);
  const [insertarModal, setInsertarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [productoSelec, setProductoSelect] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio: ''
  })
  const [modalEliminar, setModalEliminar] = useState(false);
  const [colorAlerta, setColorAlerta] = useState();
  const [alerta, setAlerta] = useState(false);
  const [textoAlert, setTextoAlert] = useState();
  const [busqueda, setBusqueda] = useState("");

  {/*Peticiones Axios */ }
  const peticionGet = async () => {
    await axios.get(url)
      .then(response => {
        setProductos(response.data)
        setGrillaProductos(response.data)
      }
      )
  }

  useEffect(() => {
    peticionGet();
  }, [])

  const peticionPost = async () => {
    await axios.post(url, productoSelec)
      .then(response => {
        setProductos(productos.concat(response.data))
        cerrarModalInsertar()
        abrirAlerta()
        cambiarColorAlerta("success")
        cambiarTextoAlert("Agregado Correctamente")
      })
  }

  const peticionDelete = async (id) => {
    await axios.delete(url + productoSelec.id)
      .then(response => {
        setProductos(productos.filter(producto => producto.id !== productoSelec.id))
        cerrarModalEliminar()
        abrirAlerta()
        cambiarColorAlerta("error")
        cambiarTextoAlert("Producto eliminado correctamente")
      })
  }

  const peticionPut = async (id) => {
    await axios.put(url + productoSelec.id, productoSelec)
      .then(response => {
        var prodNuevo = productos;
        prodNuevo.map(producto => {
          if (productoSelec.id == producto.id) {
            producto.nombre = productoSelec.nombre;
            producto.descripcion = productoSelec.descripcion;
            producto.cantidad = productoSelec.cantidad;
            producto.precio = productoSelec.precio;
          }
        })
        setProductos(prodNuevo);
        cerrarModalEditar();
        abrirAlerta()
        cambiarColorAlerta("info")
        cambiarTextoAlert("Producto editado correctamente")
      })
  }

  {/*Funciones */ }

  const seleccionarProducto = (producto, caso) => {
    setProductoSelect(producto);
    var respuesta = (caso == "editar") ? setEditarModal(true) : ((caso == "eliminar") ? setModalEliminar(true) : "")
    console.log(producto);
  }

  const abrirAlerta = () => { setAlerta(true) };
  const cerrarAlerta = () => { setAlerta(false) };
  const cambiarColorAlerta = texto => { setColorAlerta(texto) };
  const cambiarTextoAlert = texto => { setTextoAlert(texto) };
  const abrirModalInsertar = () => { setInsertarModal(true) };
  const cerrarModalInsertar = () => { setInsertarModal(false) };
  const cerrarModalEditar = () => { setEditarModal(false) };
  const cerrarModalEliminar = () => { setModalEliminar(false) };

  const handleChange = e => {
    const { name, value } = e.target;
    setProductoSelect(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(productoSelec)
  }

  const handleChangeBusqueda = e => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
    console.log(e.target.value);
    console.log(productos);
  }

  const filtrar = (palabraBuscada) => {
    var resultadoBusqueda = grillaProductos.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(palabraBuscada.toLowerCase())
        || elemento.descripcion.toString().toLowerCase().includes(palabraBuscada.toLowerCase())
        || elemento.precio.toString().toLowerCase().includes(palabraBuscada.toLowerCase())
        || elemento.cantidad.toString().toLowerCase().includes(palabraBuscada.toLowerCase())
        || elemento.id.toString().toLowerCase().includes(palabraBuscada.toLowerCase())) {
        return elemento;
      }
    });
    setProductos(resultadoBusqueda);
  }

  {/*Estilos */ }
  const formatoCurrency = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const bodyInsertar = (
    <div>
      <h3>Agregar nuevo producto</h3>
      <br />
      <TextField name='nombre' fullWidth sx={{ m: 1 }} variant="standard" label="Nombre" onChange={handleChange} />
      <br />
      <TextField name='descripcion' fullWidth sx={{ m: 1 }} variant="standard" label="Descripción" onChange={handleChange} />
      <br />
      <TextField name='cantidad' fullWidth sx={{ m: 1 }} variant="standard" label="Cantidad" onChange={handleChange} />
      <br />
      <TextField name='precio' fullWidth sx={{ m: 1 }} variant="standard" label="Precio" onChange={handleChange} />
      <br />
      <div align="right">
        <Button onClick={() => peticionPost()} variant="contained" color="primary">Insertar</Button>
        <Button onClick={() => cerrarModalInsertar()} >Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar = (
    <div>
      <h3>Editar producto <b>{productoSelec.nombre} </b> </h3>
      <br />
      <TextField name='nombre' fullWidth sx={{ m: 1 }} variant="standard" label="Nombre" value={productoSelec && productoSelec.nombre} onChange={handleChange} />
      <br />
      <TextField name='descripcion' fullWidth sx={{ m: 1 }} variant="standard" label="Descripción" value={productoSelec && productoSelec.descripcion} onChange={handleChange} />
      <br />
      <TextField name='cantidad' fullWidth sx={{ m: 1 }} variant="standard" label="Cantidad" value={productoSelec && productoSelec.cantidad} onChange={handleChange} />
      <br />
      <TextField name='precio' fullWidth sx={{ m: 1 }} variant="standard" label="Precio" value={productoSelec && productoSelec.precio} onChange={handleChange} />
      <br />
      <div align="right">
        <Button onClick={() => peticionPut()} variant="contained" color="primary">Guardar</Button>
        <Button onClick={() => cerrarModalEditar()} >Cancelar</Button>
      </div>
    </div>
  )

  return (
    <div className="App">
      <div className="container principal">


        {/* Tabla */}
        <div className="nav row align-items-center" >
          <div className="col-md-6 col-12">
            <h1 className="text-center "> Listado de Productos </h1>
          </div>
          <div className="col-md-3 col-12 align-items-center">
            <Button startIcon={<AddBoxIcon />} variant="contained" color="success" onClick={() => abrirModalInsertar()} > Agregar Producto</Button>
          </div>
          <div className="col-md-3 col-12 align-items-center pb-1">
            <TextField
              onChange={(e) => handleChangeBusqueda(e)}
              id="buscar"
              value={busqueda}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              color="grey"
            />          </div>
        </div>
        <div className="">
          <TableContainer component={Paper} >
            <Table>
              <TableHead>
                <StyledTableRow className="text-center">

                  <StyledTableCell className="text-center">ID </StyledTableCell>
                  <StyledTableCell className="text-center">Nombre </StyledTableCell>
                  <StyledTableCell className="text-center">Descripción </StyledTableCell>
                  <StyledTableCell className="text-center">Cantidad </StyledTableCell>
                  <StyledTableCell className="text-center">Precio </StyledTableCell>
                  <StyledTableCell className="text-center">Acciones </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {!productos ? "Cargando" :
                  productos.map((producto) => {

                    return (
                      <StyledTableRow key={producto.id} hover={true}>
                        <StyledTableCell className="text-center">{producto.id}</StyledTableCell>
                        <StyledTableCell className="text-center">{producto.nombre}</StyledTableCell>
                        <StyledTableCell className="text-center">{producto.descripcion}</StyledTableCell>
                        <StyledTableCell className="text-center">{producto.cantidad}</StyledTableCell>
                        <StyledTableCell className="text-center">{formatoCurrency.format(producto.precio)}</StyledTableCell>
                        <StyledTableCell className="text-center">
                          <Button className="mt-1" size="small" variant="contained" color="warning" onClick={() => seleccionarProducto(producto, "editar")}><Edit /> </Button>
                          <Button className="mt-1" size="small" variant="contained" color="error" onClick={() => seleccionarProducto(producto, "eliminar")}><Delete /></Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })}

              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Modal Insertar */}
        <Modal
          open={insertarModal}
          onClose={cerrarModalInsertar}
        >
          <Box sx={style}>
            {bodyInsertar}
          </Box>
        </Modal>

        {/* Modal Editar */}
        <Modal
          open={editarModal}
          onClose={cerrarModalEditar}
        >
          <Box sx={style}>
            {bodyEditar}
          </Box>
        </Modal>

        {/*Snackbar*/}
        <Snackbar
          open={alerta}
          autoHideDuration={6000}
          onClose={cerrarAlerta}
        >
          <Alert variant="filled" severity={colorAlerta} >{textoAlert}</Alert>

        </Snackbar>


        {/* Modal Eliminar */}
        <Modal
          open={modalEliminar}
          onClose={cerrarModalEliminar}
        >
          <Box sx={style}>
            <ModalHeader>
              ¿Desea eliminar el producto <b> {productoSelec && productoSelec.nombre} </b>?
            </ModalHeader>
            <ModalFooter>
              <div align="right">
                <Button onClick={() => cerrarModalEliminar()} >Atrás</Button>
                <Button onClick={() => peticionDelete()} variant="contained" color="error">Eliminar</Button>
              </div>
            </ModalFooter>
          </Box>
        </Modal>
      </div>

    </div>


  );
}

export default App;
