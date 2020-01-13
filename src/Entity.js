import React, { Component } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import logo from './logo.svg';
import './App.css';


const data = [
  {
    name: 'Page A', uv: 590, pv: 800, amt: 1400,
  },
  {
    name: 'Page B', uv: 868, pv: 967, amt: 1506,
  },
  {
    name: 'Page C', uv: 1397, pv: 1098, amt: 989,
  },
  {
    name: 'Page D', uv: 1480, pv: 1200, amt: 1228,
  },
  {
    name: 'Page E', uv: 1520, pv: 1108, amt: 1100,
  },
  {
    name: 'Page F', uv: 1400, pv: 680, amt: 1700,
  },
];

export default class App extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      id: props.id,
      entity: undefined,
      error: undefined
    }
  }

  async componentDidMount() {

    const entityId = Number(this.props.match.params.entityId);
    const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || process.env.SERVER_PORT || 8000;

    try {
        /**
         * This is an API call to get the entity data.  The server has database/cache access.
         */
        const res = await window.fetch(`http://localhost:${SERVER_PORT}/api/entity/${entityId}`, {
            method: 'GET'
        });

        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }

        const response = await res.json();
        console.log('response', response);
        this.setState({
            id: entityId,
            entity: response.error ? undefined : response,
            error: response.error ? response.error : undefined
        })
    } catch (err) {
        this.setState({
            id: entityId,
            entity: undefined,
            error: (err.message || 'error') + `:${entityId}:${SERVER_PORT}`
        });
    }
}

  render() {
    const { entity, error } = this.state;

    return (
      <div className="App">
        <h2>{this.state.id}</h2>
        {(entity === undefined && error === undefined) &&
                <strong>loading ...</strong>
        }
        {error &&
            <div className='loaded'>
                <span><strong>error:</strong>{error}</span>
            </div>
        }
        {entity &&
            <div className='loaded' data-testid="entity">
                <strong>Name:</strong> { entity.name }
            </div>
        }
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="pv" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}
