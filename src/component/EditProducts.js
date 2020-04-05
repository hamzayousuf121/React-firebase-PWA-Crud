import React, { Component } from 'react'
import firebase from "./config";
import { Link } from 'react-router-dom';
import Loader from "react-loader-spinner";




export default class EditProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: '',
            name: '',
            description: '',
            url: '',
            image: null,
            loading: true,
            loaderImg: false,
            loader: true
        }
    }
    componentDidMount() {
        const ref = firebase.firestore().collection("products").doc(this.props.match.params.id)
        ref.get().then(doc => {
            if (doc.exists) {
                const documents = doc.data();
                this.setState({
                    key: documents.id,
                    name: documents.name,
                    description: documents.description,
                    url: documents.url,
                    loader: false
                })
            }
            else {
                console.log("No such documents find!!!")
            }
        })
    }
    onChange = (e) => {
        //Yaha say Changes krni hain
        const state = this.state;
        state[e.target.name] = e.target.value;

        this.setState({ documents: state })
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
        const { name, description, url } = this.state;
        const UpdateRef = firebase.firestore().collection("products").doc(this.props.match.params.id)
        UpdateRef.set({
            name,
            description,
            url

        }).then(docRef => {
            console.log("documents Ref", docRef)
            this.setState({
                description: '',
                name: '',
                url: ''
            });
            this.props.history.push("/show/" + this.props.match.params.id)
        })
            .catch((err) => {
                console.log("Error Editing Documents", err)
            })
    }


    render() {

        const { description } = this.state;
        return (this.state.loader === true) ? <Loader className="loaderImg" type="ThreeDots" color="#2BAD60" height="100" width="100" /> : (

            <React.Fragment>
                <div className="container mt-3">
                    <h2 className="bg-info text-center text-white p-2">
                        Edit Products Page</h2>
                    <Link to={'/'}>
                        <button className="btn btn-outline-danger">Products</button>
                    </Link>

                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name"> Products Name  </label>
                                <input type="text" required className="form-control" placeholder="Enter Product Name" name="name" id="name" value={this.state.name} onChange={this.onChange}></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Product Description</label>
                                <textarea className="form-control" required placeholder="Enter Product Name" name="description" id="description" value={this.state.description} onChange={this.onChange} cols="80" rows="5" >{description}</textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Choose Image</label>
                                <input type="file" id="image" onChange={this.handleChange} />
                            </div>
                            <div className="form-group" >
                                {this.state.loaderImg ? <Loader /> : null}
                                <img src={this.state.url} height="200" width="200" alt="" />
                            </div>
                            <div className="form-group" >
                                <button className="btn btn-outline-primary btn-block " id={this.state.loading ? 'show' : 'hide'}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
