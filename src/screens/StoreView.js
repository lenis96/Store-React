import { Component } from 'react'
import axios from 'axios'

class StoreView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            selected_product: null,
            quantities: [1, 2, 3, 4, 5, 6],
            quantity: 1,
            shoping_car: [],
            input_name: '',
            show_alert_name: false,
            show_success: false,
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/products').then(res => {
            console.log("res", res)
            this.setState({ products: res.data })
        })
    }

    selectProduct = (product) => {
        console.log("selected_product", product)
        this.setState({ selected_product: product });
    }

    setQauntity = (quantity) => {
        console.log("set quantity", quantity.target.value)
        this.setState({ quantity: quantity.target.value })
    }

    addToShoppingCar = () => {
        let new_item = this.state.selected_product;
        new_item.quantity = this.state.quantity;
        let shoping_car = this.state.shoping_car;
        shoping_car.push(new_item);
        console.log("NEW SHOPING CAR", shoping_car);
        this.setState({ shoping_car: shoping_car, quantity: 1, selected_product: null })
    }

    totalPrice = () => {
        if (this.state.shoping_car.length > 0) {
            let total_per_product = this.state.shoping_car.map(item => item.price * item.quantity);
            console.log("TOTAL POR PRODUT", total_per_product);
            return total_per_product.reduce((a, b) => a + b, 0);
        }
        else {
            return 0;
        }
    }

    deleteItem = (index) => {
        let shoping_car = this.state.shoping_car;
        shoping_car.splice(index, 1)
        this.setState({ shoping_car: shoping_car });
    }

    changeName = (value) => {
        this.setState({ input_name: value.target.value, show_alert_name: false })
    }

    finishShopping = () => {
        if (this.state.input_name) {
            let data = { name: this.state.input_name, total: this.totalPrice() };
            data.products_list = this.state.shoping_car.map(product => {
                return {
                    product_id: product.id,
                    quantity: product.quantity,
                    price_unit: product.price
                }
            })
            axios.post('http://localhost:5000/orders', data).then(res => {
                console.log(res)
                this.setState({ show_success: true, shoping_car: [], input_name: '' });
            }).catch(err => {
                console.log("ERROR", err)
            })
        }
        else {
            this.setState({ show_alert_name: true })
        }
    }

    render() {
        console.log("STATE", this.state)
        return <div className="container">
            <h2>Store View</h2>
            <div className="row">


                {this.state.products.map(product => {
                    return <div className="col-3">
                        {/* <div className="card" style={{width: "18rem"}}> */}
                        <div className="card">
                            <img className="card-img-top" src={product.image_url} alt="Card image cap" />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">$ {product.price}</p>
                                <button onClick={() => { this.selectProduct(product) }} href="#" className="btn btn-primary">Comprar</button>
                            </div>
                        </div>
                    </div>
                })}


            </div>
            {this.state.selected_product ?
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="form-row">
                                <div className="col">

                                    <p>{this.state.selected_product.name}</p>
                                </div>
                                <div className="col">
                                    <p>Precio U: {this.state.selected_product.price}</p>
                                </div>
                                <div className="col">

                                    <select onChange={(val) => { this.setQauntity(val) }} className="form-control">
                                        {this.state.quantities.map(quantity => {
                                            return <option value={quantity}>{quantity}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col">
                                    <p>total: {this.state.selected_product.price * this.state.quantity}</p>
                                </div>
                                <div className="col">
                                    <button onClick={() => { this.addToShoppingCar() }} className="btn btn-primary">Añadir al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div><h2>Producto no seleccionado</h2></div>}
            <h2>Carrito de compras</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio Unitario</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Precio Total</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.shoping_car.map((item, index) => {

                        return <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price * item.quantity}</td>
                            <td><button onClick={() => { this.deleteItem(index) }} className="btn btn-danger">Eliminar</button></td>
                        </tr>
                    })}
                </tbody>
            </table>
            <h3>Total: {this.totalPrice()}</h3>

            {this.state.shoping_car.length > 0 ?
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="form-row">
                                <div className="col">

                                    <input value={this.state.input_name} onChange={(value) => { this.changeName(value) }} type="text"></input>
                                </div>
                                <div className="col">
                                    <button onClick={() => { this.finishShopping() }} className="btn btn-success">Finalizar Compra</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    {this.state.show_alert_name ? <div className="col-12">
                        <div class="alert alert-danger" role="alert">
                            El nombre del comprador es requerido
                        </div>
                    </div> : null}
                    {this.state.show_success ?
                        <div className="col-12">
                            <div class="alert alert-success" role="alert">
                                La compra ha sido exitosa
                    </div>
                        </div>
                        : null}
                </div>
                : <div><h2>Producto no seleccionado</h2></div>}

        </div>
    }
}

export default StoreView;