import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from "./components/Navigation/Navigation";
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import { Component } from 'react';

const app = new Clarifai.App({
 apiKey: '03ecc1108a3442959b1c045faf44c9a8'
});

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '', 
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('input-image');
   const width = Number(image.width);
   const height = Number(image.height);
   console.log(width, height);
   return {
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol: width - (clarifaiFace.right_col * width),
     bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }

displayFaceBox = (box) => {
console.log(box);
this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(error => console.log(error));
       }

onRouteChange = (route) => {
  this.setState({route: route });
}

  render() {
    return (
    <div className="App">
      <Particles 
        className= 'particles'
        params={particlesOptions}
      />
      <Navigation onRouteChange={this.onRouteChange}/>
      { this.state.route === 'signin'
        ? <SignIn onRouteChange={this.onRouteChange}/>
        : <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
          </div>
          }
    </div>
  );
  }
}

export default App;
