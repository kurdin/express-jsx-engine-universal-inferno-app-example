const { map } = require('lodash');

const Layout = require('../layouts/html');
const TestComp = require('../testcomp');
const Counter = require('apps-inferno/src/counter/Counter');

<Layout {...props}>
  <div id="counter-app" >
    <Counter {...props.shared.initProps} ssr={props.serverRender}/>
  </div>
	<TestComp title="Test component title" value="Test component value"/>
  <ul class="users">
    {map(props.users, user => <li key={user}>{user.name}</li>)}
  </ul>
</Layout>