import Component from 'inferno-component';

const CounterButtons = ({ count, on }) => {
	return (
  <div>
    <h1>counter { count }</h1>
    <button onClick={ on.substr }> - </button>
    <button onClick={ on.add }> + </button>
  </div>
	);
};

class Counter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			count: props.count
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