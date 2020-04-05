import React, { Component } from 'react'
import firebase from "./config";
import { Link } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Button
} from 'reactstrap';
import Loader from "react-loader-spinner";


export default class ShowProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            key: '',
            isLoading: true,
            loader: true
        }
    }
    componentDidMount() {
        const ref = firebase.firestore().collection("products").doc(this.props.match.params.id)
        ref.get().then(doc => {
            if (doc.exists) {
                this.setState({
                    products: doc.data(),
                    key: doc.id,
                    isLoading: false,
                    loader: false
                })
            }
            else {
                console.log("No such Documents find!!!")
            }
        })
    }

    delete(id) {
        this.setState({
            loader: true
        })
        var desireRef = firebase.storage().refFromURL(this.state.products.url)
        firebase.firestore().collection("products").doc(id).delete().then(() => {
            this.props.history.push("/")
            this.setState({
                loader: false
            })
        }).catch((err) => {
            console.error(err)
        })
        desireRef.delete().then(() => {
            console.log("file deleted")
        }).catch((err) => {
            console.error("Desire Ref Delete", err)
        })
    }

    render() {
        return (this.state.loader === true) ? <Loader className="loaderImg" type="ThreeDots" color="#2BAD60" height="100" width="100" /> : (
            <div>
                <React.Fragment>
                    <div className="container mt-3 ">
                        <h3 className="text-center bg-danger text-white  p-3 mt-3 ml-3"> Single Product </h3>
                        <Link to={'/'}>
                            <button className="btn btn-outline-danger ml-3">Show Product</button>
                        </Link>
                        <div className="col-lg-6 mt-3 col-md-6 col-12">
                            <Card>
                                <CardImg top width="50%" height="300px"
                                    src={this.state.products.url} alt="Card image cap" />
                                <CardBody>
                                    <CardTitle>{this.state.products.name}</CardTitle>
                                    <CardText>{this.state.products.description}</CardText>
                                    <Button color="danger" className="mr-2" onClick={() => { if (window.confirm('Are you sure you want to delete this item?')) this.delete(this.state.key) }} >Delete</Button>
                                    <Link to={`/edit/${this.state.key}`} className="btn btn-success mr-2">Edit </Link>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                </React.Fragment>
            </div>
        )
    }
}
