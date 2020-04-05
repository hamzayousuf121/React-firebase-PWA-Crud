import React, { Component } from 'react'
import "./App.css"
import firebase from "./component/config";
import { Link } from 'react-router-dom';
import Loader from "react-loader-spinner";

// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
// import Loader from '../node_modules/react-loader-spinner'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("products");
    this.unsubscribe = null;
    this.state = {
      products: [],
      loader: true
    };
  }
  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    this.setState({
      loader: true
    })
  }
  onCollectionUpdate = (querySnapShots) => {
    const products = []
    querySnapShots.forEach((doc) => {
      const { description, name, url } = doc.data();
      products.push({
        key: doc.id,
        doc,
        description,
        name,
        url
      })
    })
    this.setState({
      products: products,
      loader: false
    })
  }
  render() {
    return (this.state.loader === true) ? <Loader className="loaderImg" type="ThreeDots" color="#2BAD60" height="100" width="100" /> : (
      <>

        <div className="container">

          <h3 className="text-center bg-info text-white w-100 p-3 mt-3 ">Products Details</h3>
        </div>
        <div className="container">
          <div className="row">
            <Link to={'/create'}><button className="btn btn-success btn-block ml-3"> Create Products</button></Link>
          </div>

          <div className="mt-3 table-striped table-border">
            <table className="table ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>View Products</th>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map(product =>
                  <tr key={Math.random()}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    {(product.url) ? <td><img src={product.url} width="100" height="100" alt=""></img></td> : null}
                    <td><Link to={`/show/${product.key}`}><button className="btn btn-info w-100 btnHeight" >View Details</button></Link></td>
                  </tr>

                )}

              </tbody>
            </table>
          </div>

        </div>

       )
      </>
    )

  }
}
