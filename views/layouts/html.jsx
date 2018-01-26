const Layout = require(`./${props.layout || 'default'}`);
<html>
  <head>
    <meta charset="utf-8" />
    <title>{props.pageTitle}</title>
    <AppSharedData shared={props.shared} />
    {props.scripts.map((script) => <script src={script} />)}
    {props.styles.map((style) => <link rel="stylesheet" href={style} />)}
  </head>
  <body class={props.layout}>
    <Layout {...props} />
    {props.bundleScript && <script src={props.bundleScript} />}
  </body>
</html>