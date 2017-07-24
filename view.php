<html >
<head>

  <meta charset="UTF-8">
  <title>Node Editor</title>


  <link rel='stylesheet prefetch' href='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>

      <link rel="stylesheet" href="css/view.css">


</head>

<body>
  <script type='text/javascript'>
// DEMO
// ========

function doStuff(){
  // wait until the node class is actually defined
  if (window.XG5 === undefined){
    setTimeout(doStuff, 50);
    return;
  }

  // Node 1
  var node = new XG5.GUINode({name: 'Another One'});
  node.addInput('Value1');
  node.addInput('Value2');
  node.addInput('Value3');


  // Node 2
  var node2 = new XG5.GUINode({name: 'Node 2'});
  node2.addInput('Text In');
  node2.addInput('Value 5');

  // Node 3
  var node3 = new XG5.GUINode({name: 'Something Else'});
  node3.addInput('Color4');
  node3.addInput('Position');
  node3.addInput('Noise Octaves');

  // Node 4
  var node4 = new XG5.GUINode({name: 'TextString'});
  node4.addInput('Value', 'input');

  // Node 5
  var node5 = new XG5.GUINode({name:"BestNode"});
  node5.addInput('bool isBest');

  // Move to initial positions
  node.moveTo({x: 300, y: 80});
  node2.moveTo({x: 20, y: 70});
  node3.moveTo({x:150, y:150});
  node4.moveTo({x:150, y:20});
  node5.moveTo({x:50, y:90});

  // Connect Nodes
  node.connectTo(node3.inputs[0]);
  node3.connectTo(node2.inputs[1]);
  node4.connectTo(node2.inputs[0]);

  // Add to DOM
  node.initUI();
  node2.initUI();
  node3.initUI();
  node4.initUI();
  node5.initUI();

  node4.inputs[0].value = 'Some String';

  window.guiNodes = [];
  window.guiNodes.push(node);
  window.guiNodes.push(node2);
  window.guiNodes.push(node3);
  window.guiNodes.push(node4);
}

doStuff();
</script>
  <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>

    <script src="js/view.js"></script>

</body>
</html>
