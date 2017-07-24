<html style="height: 100%">
<head>
  <?php
  include_once "/css/style.css";
  include_once "/js/index.js";
  ?>
  <meta charset="UTF-8">
  <title>Node++</title>


  <link rel='stylesheet prefetch' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css'>
  <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/cplusplus_view.css">

  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
</head>

<body>

  <div div id="menuView" class="topbar">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">node++</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a id='hierarchyView' href="#">hierarchy</a></li>
            <li><a id='classView' href="#">class</a></li>
            <li><a id='methodView' href="#">method</a></li>
            <li><a id='codeView' href="#">c++ code</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
  </div>

  <div class="addNode">
    <button type="button" class="btn addClass" onclick="addClass()">+ Add Class</button>
    <button type="button" class="btn addMethod" onclick="addMethod()">+ Add Method</button>
    <button type="button" class="btn addStatement" onclick="addStatement()">+ Add Statement</button>
    <div id="statementsDropdown" class="dropdown-content">
      <button type="button" class="statementOption" onclick="addIfStatement()">If Statement</button>
      <button type="button" class="statementOption" onclick="addFunctionCall()">Function Call</button>
      <button type="button" class="statementOption" onclick="addExecuteExpression()">Execute Expression</button>
      <button type="button" class="statementOption" onclick="addExecuteExpression()">Compare Expression</button>
      <button type="button" class="statementOption" onclick="addExecuteExpression()">Assign Statement</button>
      <button type="button" class="statementOption" onclick="addExecuteExpression()">More</button>

    </div>

    <script>
    function addMethod(){
      var methodNodeX = new NodePP.MethodNode({name: "newMethod", class: currentClass});
      var xCoord = Math.floor(100 + (Math.random() * 700));
      var yCoord = Math.floor(100 + (Math.random() * 400));
      methodNodeX.moveTo({x:xCoord, y: yCoord});
      methodNodeX.initUI();
      currentView.push(methodNodeX);
      currentClass.methods.push(methodNodeX);
    }

    function addClass(){
      var classNodeX = new NodePP.ClassNode({name: "NewClass"});
      var xCoord = Math.floor(100 + (Math.random() * 700));
      var yCoord = Math.floor(100 + (Math.random() * 400));
      classNodeX.moveTo({x:xCoord, y: yCoord});
      classNodeX.initUI();
      currentView.push(classNodeX);
    }

    function addStatement(){
      document.getElementById("statementsDropdown").classList.toggle("show");
    }

    function addIfStatement(){
   		var newStatement = new NodePP.IfStatementNode({name: "IF"});
		var xCoord = Math.floor(100 + (Math.random() * 700));
		var yCoord = Math.floor(100 + (Math.random() * 400));
		newStatement.moveTo({x:xCoord, y: yCoord});
		newStatement.initUI();
        currentView.push(newStatement);
        currentMethod.statements.push(newStatement);
    }


    function addSetStatement(){

    }

    function addBlockStatement(){


    }
    function addExecuteExpression(){
        alert("These nodes have not yet been finished being implemented!");
    }

    function addFunctionCall(){
      var functionList = document.createElement("div");
      functionList.classList.add("menuOverlay");
      functionList.id = "functionMenu";
      document.body.appendChild(functionList);
      var functions = currentClass.getAllMethods();
      for (var func in functions){
        var funcDiv = document.createElement("div");
        funcDiv.classList.add("statementOption");
        funcDiv.innerHTML = func;
        functionList.appendChild(funcDiv);
        funcDiv.onclick = function(){

        var functionList = document.createElement("div");
        functionList.classList.add("menuOverlay");
        functionList.id = "functionMenu";
        document.body.appendChild(functionList);
        var functions = currentClass.getAllMethods();
        for (var func in functions){
            var funcDiv = document.createElement("div");
            funcDiv.classList.add("statementOption");
            funcDiv.innerHTML = func;
            functionList.appendChild(funcDiv);
            funcDiv.onclick = function(){
                var menu = document.getElementById("functionMenu");
                if (menu){
                    document.body.removeChild(menu);
                }
                var newFunctionCall = new NodePP.FunctionCallExpressionNode({name: func});
                var xCoord = Math.floor(100 + (Math.random() * 700));
                var yCoord = Math.floor(100 + (Math.random() * 400));
                newFunctionCall.moveTo({x:xCoord, y: yCoord});
                newFunctionCall.initUI();
                currentView.push(newFunctionCall);
            }
        }
      }
    }
  }

    window.onclick = function(event) {
      if (!event.target.matches('.menuOverlay') && !event.target.matches('.statementOption')){
        var menu = document.getElementById("functionMenu");
        if (menu){
          document.body.removeChild(menu);
        }
      }
      if (!event.target.matches('.addStatement')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
    </script>
  </div>


  <div id="propertiesView" class="sidebar">
    <p style="display:inline" class="padding"><u>Name:</u></p>
    <p id="p1" class="padding" style="display:inline"></p><br>

    <p style="display:inline">&nbsp</p>

    <!-- Inline Form -->
    <form class="form-inline" role="form" id="setNameForm">
      <div class="form-group">
        <input type="newname" class="form-control" id="newName" placeholder="New Name">
      </div>
      <button type="button" class="btn btn-default" id="setName">Change</button>
    </form>


    <script>
    function updateDiv(name){
      document.getElementById("p1").innerHTML = "&nbsp &nbsp &nbsp" + name;
    }
    </script>
  </div>

  <div id="propViewTitle" class="sidebarPlus">
    <center><p style="color:#d5dfef;; font-size:20px">Properties</p></center>
  </div>


  <div class='class-view' id="node-window"></div>

  <div class='container code-view'>
    <div class='row'>
      <div class='col-lg-8'>
        <div class='file-status'><p id='activeFile'></p><button id="saveFile" class='btn btn-success'>Save File</button><p id="fileSaved">File saved.</p></div>
        <div id="editor">//Create a file to begin
        </div>
      </div>
      <div class='col-lg-4 file-div'>
        <div class="form-group">
          <label for="file-name">File name:</label>
          <input type="text" class="form-control" id="file-name" maxlength="25">
        </div>
        <button type="button" class='btn btn-primary' id='addFile'>Create file</button>
        <div id='fileButtonGroup'>
        </div>
      </div>
    </div>
  </div>





  <script type='text/javascript'>
  function doStuff(){
    // wait until the node class is actually defined
    if (window.NodePP === undefined){
      setTimeout(doStuff, 50);
      return;
    }

  var classNode1 = new NodePP.ClassNode({name: "Animal"});
  classNode1.moveTo({x:100, y: 80});
  classNode1.initUI();
  currentView.push(classNode1);

  var classNode2 = new NodePP.ClassNode({name: "Dog"});
  classNode2.moveTo({x:350, y: 80});
  classNode2.initUI();
  currentView.push(classNode2);

  var classNode3 = new NodePP.ClassNode({name: "Cat"});
  classNode3.moveTo({x:350, y: 180});
  classNode3.initUI();
  currentView.push(classNode3);

  var classNode4 = new NodePP.ClassNode({name: "Bird"});
  classNode4.moveTo({x:350, y: 280});
  classNode4.initUI();
  currentView.push(classNode4);


  var methodNode1 = new NodePP.MethodNode({name: "getName", class: classNode1});
  methodNode1.moveTo({x:200, y: 200});
  methodNode1.initUI();
  methodNode1.hideNode();

  classNode1.methods.push(methodNode1);

  /*var statementNode1 = new NodePP.StatementNode({name: "if"});
  statementNode1.moveTo({x:200, y: 320});
  statementNode1.initUI();
  statementNode1.hideNode();*/

  /*// Node 1
  var node = new NodePP.GUINode({name: 'Another One'});
  node.addInput('Value1');
  node.addInput('Value2');
  node.addInput('Value3');

  // Node 2
  var node2 = new NodePP.GUINode({name: 'Node 2'});
  node2.addInput('Text In');
  node2.addInput('Value 5');

  // Node 3
  var node3 = new NodePP.GUINode({name: 'Something Else'});
  node3.addInput('Color4');
  node3.addInput('Position');
  node3.addInput('Noise Octaves');

  // Node 4
  var node4 = new NodePP.GUINode({name: 'TextString'});
  node4.addInput('Value', 'input');

  // Move to initial positions
  node.moveTo({x: 300, y: 80});
  node2.moveTo({x: 20, y: 70});
  node3.moveTo({x:150, y:150});
  node4.moveTo({x:150, y:20});

  // Connect Nodes
  node.connectTo(node3.inputs[0]);
  node3.connectTo(node2.inputs[1]);
  node4.connectTo(node2.inputs[0]);

  // Add to DOM
  node.initUI();
  node2.initUI();
  node3.initUI();
  node4.initUI();

  node4.inputs[0].value = 'Some String';

  window.guiNodes = [];
  window.guiNodes.push(node);
  window.guiNodes.push(node2);
  window.guiNodes.push(node3);
  window.guiNodes.push(node4);*/
}

doStuff();
</script>
<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
<script src="bootstrap/js/bootstrap.min.js"></script>
<script src='js/index.js'></script>
<!--<script type="text/javascript" src="js/paper-full.js"></script>-->

<script src="ace-builds-master/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="cviewapp.js" type="text/javascript" charset="utf-8"></script>
<script>
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/c_cpp");


  $(document).ready(function(){
    $( "#classView").closest('li').hide();
    $( "#methodView").closest('li').hide();
    $( ".addMethod").hide();
    $( ".addStatement").hide();
    $( "#hierarchyView" ).click(function() {
      showHierarchy();
      $('.class-view').show();
      $('.code-view').hide();
      $('.addClass').show();
      $('.addMethod').hide();
      $('.addStatement').hide();
      $(this).closest('li').addClass("active");
      $( "#classView" ).closest('li').removeClass("active");
      $( "#methodView" ).closest('li').removeClass("active");
      $( "#codeView" ).closest('li').removeClass("active");
      $( "#classView").closest('li').hide();
      $( "#methodView").closest('li').hide();
    });
    $( "#classView" ).click(function() {
      showClass();
      $('.class-view').show();
      $('.code-view').hide();
      $('.addClass').hide();
      $('.addMethod').show();
      $('.addStatement').hide();
      $(this).closest('li').addClass("active");
      $( "#hierarchyView" ).closest('li').removeClass("active");
      $( "#methodView" ).closest('li').removeClass("active");
      $( "#codeView" ).closest('li').removeClass("active");
      $( "#methodView").closest('li').hide();
    });
    $( "#methodView" ).click(function() {
      $('.class-view').show();
      $('.code-view').hide();
      $('.addClass').hide();
      $('.addMethod').hide();
      $('.addStatement').show();
      $(this).closest('li').addClass("active");
      $( "#hierarchyView" ).closest('li').removeClass("active");
      $( "#classView" ).closest('li').removeClass("active");
      $( "#codeView" ).closest('li').removeClass("active");
    });
    $( "#codeView" ).click(function() {
      generateFiles();
      $('.code-view').show();
      $('.class-view').hide();
      $(this).closest('li').addClass("active");
      $( "#hierarchyView" ).closest('li').removeClass("active");
      $( "#methodView" ).closest('li').removeClass("active");
      $( "#classView" ).closest('li').removeClass("active");
    });

    $('#setName').click(function() {
      if ($('#newName').val()) {
        $("div[title='" + selectedNode.name + "']").find(".titleText").text($('#newName').val());
        $("div[title='" + selectedNode.name + "']").prop('title', $('#newName').val());
        selectedNode.name = $('#newName').val();
        $('#newName').val('');
      }
      else {
        alert("Please specify a name")
      }
    });

  });
  </script>

</body>
</html>
