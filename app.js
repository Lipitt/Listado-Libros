//defino clase libro y su constructor
class Libro {
  constructor(tituloLibro, nombreAutor, codigoISBN) {
    this.tituloLibro = tituloLibro;
    this.nombreAutor = nombreAutor;
    this.codigoISBN = codigoISBN;
  }
}

//defino clase interfaz usuario y el metodo para agregar libro
class UI {
  //este metodo usa otros metodos para agregar libros a la iterfaz y almacenamiento local.
  agregarLibro(unLibro) {
    if (this.validarCampos() === true) {
      this.mostrarLibro(unLibro);
      this.mostrarAlerta(true, "Libro ingresado correctamente");
      Almacenamiento.agregarLibros(unLibro);

      this.limpiarCampos();
    } else {
      this.mostrarAlerta(false, "Complete los campos correctamente");
    }
  }
  //muestra los libros en la interfaz a traves de crear un elementos del dom dinamicamente y guardar las propiedades del objeto libro en el elemento
  mostrarLibro(unLibro) {
    const lista = document.querySelector("#lista-libros"),
      listaFila = document.createElement("tr");
    listaFila.innerHTML = `
      <td>${unLibro.tituloLibro}</td>
      <td>${unLibro.nombreAutor}</td>
      <td>${unLibro.codigoISBN}</td>
      <td><a href="#" class="delete">X<a></td>`;

    lista.appendChild(listaFila);
  }

  //metodo para validar los campos. si alguno de los campos esta vacio se pedira que se completen
  validarCampos() {
    if (
      inputTitulo.value === "" ||
      inputAutor.value === "" ||
      inputISBN.value === ""
    ) {
      return false;
    } else {
      return true;
    }
  }
  //metodo para mostrar alertas. se usa un operador XXXXXXXXX para determninar el tipo de alerta, se crea un elemento div, se le agrega el mensake
  //que desaparece en 2 segundos
  mostrarAlerta(correcto, mensaje) {
    let tipoAlerta = "";
    correcto === true ? (tipoAlerta = "exito") : (tipoAlerta = "error");
    let msjAlerta = document.createElement("div");
    msjAlerta.className = tipoAlerta;
    msjAlerta.innerText = mensaje;
    formLibro.prepend(msjAlerta);
    setTimeout(function () {
      msjAlerta.remove();
    }, 2000);
  }
  //borra libros de la interfaz. se pregunta si el evento que llama a este metodo contiene la clase delete, y si lo tiene, borra al padre de ese evento.
  borrarLibro(e) {
    if (e.target.classList.contains("delete")) {
      e.target.parentElement.parentElement.remove();
    }
  }
  limpiarCampos() {
    inputTitulo.value = "";
    inputAutor.value = "";
    inputISBN.value = "";
  }
}
//esta clase maneja los metodos que interactuan con el almacenamiento local
class Almacenamiento {
  //este metodo pregunta si ya existen elementos cargados en el almacenamiento local. si existen los carga, y si no crea un array vacio.
  static cargarLibros() {
    let libros;

    if (localStorage.getItem("libros") === null) {
      libros = [];
    } else {
      libros = JSON.parse(localStorage.getItem("libros"));
    }
    return libros;
  }
  //este metodo agrega elementos al array de libros y luego lo guarda en almacenamiento local
  static agregarLibros(unLibro) {
    const libros = Almacenamiento.cargarLibros();
    libros.push(unLibro);
    localStorage.setItem("libros", JSON.stringify(libros));
  }

  //este metodo muestra los libros en la interfaz recorriendo el array de libros y reutilizando el metodo mostrarLibro de la clase ui
  static mostrarLibros() {
    const libros = Almacenamiento.cargarLibros();

    libros.forEach(function (libro) {
      const ui = new UI();
      ui.mostrarLibro(libro);
    });
  }
  //se borran los libros recorriendo el array y usando el codigo isbn para identificar el libro a borrar.
  static borrarLibros(ISBN) {
    const libros = Almacenamiento.cargarLibros();

    libros.forEach(function (libro, indice) {
      if (libro.codigoISBN === ISBN) {
        libros.splice(indice, 1);
      }
    });
    localStorage.setItem("libros", JSON.stringify(libros));
  }
}

//declaro elementos de la interfaz
const formLibro = document.querySelector("#formLibro"),
  inputTitulo = document.querySelector("#inputTitulo"),
  inputAutor = document.querySelector("#inputAutor"),
  inputISBN = document.querySelector("#inputISBN"),
  tbodyLista = document.querySelector("#lista-libros"),
  btnBorrar = document.querySelectorAll(".delete");

//declaro event listeners

//cuando el dom termine de cargar, se mostraran los libros que esten en el almacenamiento local
document.addEventListener("DOMContentLoaded", Almacenamiento.mostrarLibros);

formLibro.addEventListener("submit", function (e) {
  //creo un objeto libro y le paso los valores de la ui al constructor
  e.preventDefault();
  const unLibro = new Libro(
    inputTitulo.value,
    inputAutor.value,
    inputISBN.value
  );
  //creo obj UI y llamo al metodo para agregar libro, pasandole por parametro el objeto libro
  const ui = new UI();
  ui.agregarLibro(unLibro);
});

//evento para borrar libros. instancio la clase ui, borro el libro en la interfaz usando el evento como identificador.
//tambien borro el elemento en el almacenamiento local usando como identificador el codigo isbn, que es lo que paso por parametro
tbodyLista.addEventListener("click", function (e) {
  e.preventDefault();
  const ui = new UI();
  ui.borrarLibro(e);
  Almacenamiento.borrarLibros(
    e.target.parentElement.previousElementSibling.textContent
  );
  ui.mostrarAlerta(true, "Libro borrado correctamente");
});
