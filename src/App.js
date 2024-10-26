import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './components/Home'
import './App.css'

const App = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route to="/" component={Home} />
      </Switch>
    </BrowserRouter>
  </div>
)

export default App
