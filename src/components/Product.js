import {Component} from 'react'


class Product extends Component{

    render(){
        return <div className="col-3">
            <div className="card">
                <img className="card-img-top" src={this.props.product.image_url} alt="Card cap" />
                <div className="card-body">
                    <h5 className="card-title">{this.props.product.name}</h5>
                    <p className="card-text">{this.props.product.description}</p>
                    <p className="card-text">$ {this.props.product.price}</p>
                    <button onClick={() => { this.props.addToShoppingCar(this.props.product) }} href="#" className="btn btn-primary">Comprar</button>
                </div>
            </div>
        </div>
    }
}


export default Product