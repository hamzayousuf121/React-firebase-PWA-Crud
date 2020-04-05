import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddProducts from "./component/AddProducts";
import EditProducts from "./component/EditProducts";
import ShowProducts from "./component/ShowProducts";
import {BrowserRouter, Route} from "react-router-dom";

ReactDOM.render(<BrowserRouter>
<Route exact path="/" component={App}></Route>
<Route  path="/create" component={AddProducts}></Route>
<Route  path="/edit/:id" component={EditProducts}></Route>
<Route  path="/show/:id" component={ShowProducts}></Route>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
