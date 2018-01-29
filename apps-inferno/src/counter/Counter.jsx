import { Component } from 'inferno';

const CounterButtons = ({ count, hash, testArray, on }) => {
	return (
  <div>
    <h2>counter:<span>{ count }</span></h2>
    <button onClick={ on.substr }> - </button>
    <button onClick={ on.add }> + </button>
    <h2>Random Hash:<span>{ hash }</span></h2>
    <h2>Random Array with Lodash Map:</h2>
    <ul>
			{/* lets test external map method from lodash */}
			{testArray.map((a,i) => <li>{a}</li>)}
    </ul>
  </div>
	);
};

class Counter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			count: props.count,
			hash: props.testHash,
			testArray: props.randomArray
		};
	}

	on = {
		add: e => {
			e.preventDefault();
			this.setState({ count: this.state.count + 1 });
		},
		substr: e => {
			e.preventDefault();
			this.setState({ count: this.state.count - 1 });
		}
	}

	render() {
		if (this.props.ssr === false) return null;
		return <CounterButtons {...this.state} on={this.on}/>;
	}

}

export { Counter };