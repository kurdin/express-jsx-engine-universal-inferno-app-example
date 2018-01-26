class MySub extends Component {
  constructor(props) {
    super(props);
  }
  render({title, value}) {
    return (
      <div>
        <p>{title}</p>
        <p>{value}</p>
      </div>
    );
  }
}

<MySub {...props}/>
