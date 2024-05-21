
const productsContainer = document.getElementById( 'products-container' );


function postData ( event ) {
    event.preventDefault(); 
   
    const nombre = document.getElementById( 'nombreInput' ).value;
    const precio = document.getElementById( 'precioInput' ).value;
    const imgSrc = document.getElementById( 'imagenInput' ).value;

    
    const data = {
        nombre: nombre,
        precio: precio,
        imgSrc: imgSrc,
    };

    
    fetch( 'http://localhost:3000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    } )
        .then( response => response.json() )
        .then( data => {
            console.log( 'Solicitud POST exitosa:', data );
            
            createCard( data.nombre, data.precio, data.imgSrc, data.id );
        } )
        .catch( error => {
            console.error( 'Error en la solicitud POST:', error );
        } );

    event.target.reset();
}

function createCard ( nombre, precio, imgSrc, id ) {
    const card = document.createElement( 'div' );
    card.classList.add( 'card' );

    card.innerHTML = `
        <div class="img-container">
            <img src="${imgSrc}" alt="${nombre}">
        </div>
        <div class="card-container--info">
            <p>${nombre}</p>
            <div class="card-container--value">
                <p>$ ${precio}</p>
                <button class="delete-button" data-id="${id}">
                    <img src="./img/trashIcon.svg" alt="Eliminar">
                </button>
            </div>
        </div>
    `;

    productsContainer.appendChild( card );
    card.dataset.id = id;


    const deleteButton = card.querySelector( '.delete-button' );
    deleteButton.addEventListener( 'click', () => deleteProduct( id ) );

    return card;
}


const listaProductos = async () => {
    const fetchProducts = await fetch( "http://localhost:3000/productos" )
        .then( ( res ) => res.json() )
        .catch( ( err ) => console.log( err ) );

    return fetchProducts;
};

const deleteProduct = async ( productId ) => {
    try {
        await fetch( `http://localhost:3000/productos/${productId}`, {
            method: 'DELETE',
        } );

    
        console.log( `Eliminando producto con ID: ${productId}` );
        const cardToRemove = document.querySelector( `[data-id="${productId}"]` );

        if ( cardToRemove ) {
            cardToRemove.remove();
        }
    } catch ( error ) {

        console.error( 'Error al eliminar el producto:', error );
    }
};


const render = async () => {
    try {
        const listarProductos = await listaProductos();

        if ( listarProductos.length === 0 ) {
            const noProductsMessage = document.createElement( 'p' );
            noProductsMessage.textContent = 'No hay productos agregados';
            noProductsMessage.classList.add( 'no-products-message' );
            productsContainer.appendChild( noProductsMessage );
        } else {
            listarProductos.forEach( ( products ) => {
                productsContainer.appendChild(
                    createCard( products.nombre, products.precio, products.imgSrc, products.id )
                );
            } );
        }
    } catch ( error ) {
        console.log( error );
    }
};

document.getElementById( 'productForm' ).addEventListener( 'submit', postData );

render()
