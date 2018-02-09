import Component from 'inferno-component';
import { map } from 'lodash';

const CounterButtons = ({ count, hash, testArray, on, els }) => {
	return (
  <div ref={e => els.main = e} >
    <h2>counter { count }</h2>
    <button onClick={ on.substr }> - </button>
    <button onClick={ on.add }> + </button>
    <h2>Random Hash: { hash }</h2>
    <h2>Random Array with Lodash Map:</h2>
    <ul>
			{/* lets test external map method from lodash */}
			{map(testArray, a => <li>{a}</li>)}
    </ul>
  </div>
	);
};

class Counter extends Component {

	els = {}

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
			console.log(this.els);
			e.preventDefault();
			this.setState({ count: this.state.count + 1 });
		},
		substr: e => {
			console.log(this.els);
			e.preventDefault();
			this.setState({ count: this.state.count - 1 });
		}
	}

	render() {
		if (this.props.ssr === false) return null;
		return <CounterButtons {...this.state} on={this.on} els={this.els} />;
	}

}

export default Counter;