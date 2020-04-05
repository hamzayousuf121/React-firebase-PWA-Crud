import React, { Component } from 'react'
import firebase from "./config";
import Loader from "react-loader-spinner"
import { Link } from 'react-router-dom';

export default class AddProducts extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection("products")
        this.state = {
            name: '',
            description: '',
            url: '',
            image: '',
            loading: true,
            loaderImg: false,
            loader: false
        }
    }

    onChange = (e) => {
        const state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state)
    }
    handleChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                image: e.target.files[0],
                loading: false,
                loaderImg: true
            })

            setTimeout(() => {
                const { image } = this.state;
                const uploadTask = firebase.storage().ref(`images/${image.name}`).put(this.state.image)
                uploadTask.on("state_changed", (snapshot) => {

                    console.log('snapshots')
                },
                    (error) => { console.log(error) },
                    () => {
                        firebase.storage().ref('images').child(image.name).getDownloadURL()
                            .then(url => {
                                this.setState({
                                    url: url,
                                    loading: true,
                                    loaderImg: false
                                })

                            })
                    }
                )
            }, 100);
        }
        console.log(e.target.files[0])
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loader: true
        })
        const { name, description, url } = this.state;
        // this.setState({
        //    description:'',
        //      name:'',
        //     url:''
        // });
        this.ref.add({
            name,
            description,
            url

        }).then(docRef => {
            console.log(docRef)
            this.props.history.push("/")
            this.setState({
                loader: false
            })
        })
            .catch((err) => {
                console.log("Error adding Documents")
            })
    }

    render() {
        const { description } = this.state
        return (this.state.loader === true) ? <Loader className="loaderImg" type="ThreeDots" color="#2BAD60" height="100" width="100" /> : (

            <div className="">
                <div className="container mt-3 ">
                    <h2 className="bg-info text-center  p-3 text-white ">Create Products Page</h2>
                    <Link to={'/'}>
                        <button className="btn  btn-outline-danger">Show Products</button>
                    </Link>

                    <div className="content mt-3">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name"> <b>Products Name </b> </label>
                                <input type="text" required className="form-control" placeholder="Enter Product Name" name="name" id="name" value={this.state.name} onChange={this.onChange}></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description"><b>Product Description</b></label>
                                <textarea className="form-control" required placeholder="Enter Product Name" name="description" id="description" onChange={this.onChange} cols="80" rows="5" value={this.state.description} >{description}</textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="image"><b>Choose Image: &nbsp;</b></label>
                                <input type="file" id="image" onChange={this.handleChange} />
                            </div>
                            <div className="form-group" >
                                {this.state.loaderImg ? <Loader type="ThreeDots" /> : null}
                                <img src={this.state.url} height="200" width="200" alt="" />
                            </div>
                            <div className="form-group" >
                                <button className="btn btn-info btn-block " id={this.state.loading ? 'show' : 'hide'}>Add </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
