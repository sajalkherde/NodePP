function hitch(ctx, func)
{
	var ctx = ctx;
    var func = func;
	var args = Array.prototype.slice.call(arguments, 2);
    function f()
    {
		if (Object.getPrototypeOf(func) === String.prototype)
        {
        	return ctx[func].apply(ctx, Array.prototype.concat(args, Array.from(arguments)));
        }
        else
        {
	        return func.apply(ctx, Array.prototype.concat(args, Array.from(arguments)));
        }
    }
    return f;
}

var selectedNode = null;
classNodes = [];
var NodePP = window.NodePP || {};
currentClass = null;
currentMethod = null;
currentView = [];

function hideViewedNodes(){
    for (var i = 0; i < currentView.length; i++){
        currentView[i].hideNode();
    }
    currentView = [];
}

function showHierarchy(){
    hideViewedNodes();
    for (var i = 0; i < classNodes.length; i++){
        classNodes[i].showNode();
        currentView.push(classNodes[i]);
    }
}

function showClass(){
    hideViewedNodes();
    if (currentClass){
        for (var i = 0; i < currentClass.methods.length; i++){
            currentClass.methods[i].showNode();
            currentView.push(currentClass.methods[i]);
        }
    }
}

(function(sys, _$){
  if (sys.GUINode) return;

  // SVG Setup
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'node-graph';
  svg.ns = svg.namespaceURI;
  document.getElementById("node-window").appendChild(svg);

  function createPath(a, b){
    var diff = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    var pathStr = [
      'M' + a.x + ',' + a.y + ' C',
      a.x + diff.x / 3 * 2 + ',' + a.y + ' ',
      a.x + diff.x / 3 + ',' + b.y + ' ',
      b.x + ',' + b.y
    ].join('');

    return pathStr;
  }

  var mouse = {
    currentConnection: undefined
  };

  document.getElementById("node-window").onmousemove = function(e){
      if (mouse.currentConnection){
        var path = mouse.currentConnection.path;
        if (mouse.currentConnection.start){
            var inputPt = mouse.currentConnection.start.getAttachPoint();
            var outputPt = {x: e.pageX, y: e.pageY};
            var val = createPath(inputPt, outputPt);
            path.setAttributeNS(null, 'd', val);
        }
        else {
            var inputPt = {x: e.pageX, y: e.pageY};
            var outputPt = mouse.currentConnection.end.getAttachPoint();
            var val = createPath(inputPt, outputPt);
            path.setAttributeNS(null, 'd', val);
        }

    }
  };

  document.documentElement.onclick = function(e){
    if (mouse.currentConnection){
      /*mouse.currentConnector.path.removeAttribute('d');

      if (mouse.currentInput.node)
        mouse.currentInput.node.detachInput(mouse.currentInput);

      mouse.currentInput = undefined;*/
        mouse.currentConnection.path.removeAttribute('d');
        mouse.currentConnection.remove();
        mouse.currentConnection = null;
    }
  };

  var getFullOffset = function(e){
    var offset = {
      top: e.offsetTop,
      left: e.offsetLeft
    };

    if (e.offsetParent){
      var parentOff = getFullOffset(e.offsetParent);
      offset.top += parentOff.top;
      offset.left += parentOff.left;
    }

    return offset;
  };

  function Node(options){
    this.name = ' ';
    this.value = '';
    this.isRoot = false;
    this.hidden = false;
    this.noDelete = false;
    //this.connections = [];

    this.connectors = [];

    var timer;

    for (var prop in options)
      if (this.hasOwnProperty(prop))
        this[prop] = options[prop];


    this.domElement = document.createElement('div');
    this.domElement.classList.add('x-node');
    this.domElement.setAttribute('title', this.name);

    var that = this;

    if (!this.noDelete){
        var removeButton = document.createElement('span');
        removeButton.classList.add('x-remove');
        removeButton.textContent = ' ';
        removeButton.innerHTML = "x";

        removeButton.onclick = function(e){
            that.remove();
            e.stopPropagation();
        }

        this.domElement.appendChild(removeButton);
    }



    this.domElement.onclick = function(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(setSelected, 150);
    }

    this.domElement.ondblclick = function(){
        that.zoomInNode();
        clearTimeout(this.timer);
    }

    function setSelected(){
        if(selectedNode != null){
            selectedNode.domElement.classList.remove('x-selectedNode');
        }
        that.domElement.classList.add('x-selectedNode');
        selectedNode = that;
        that.showProperties();
    }

	this.setName = function(newName){
		this.name = newName;
	}

    /*var outputDom = document.createElement('span');
    outputDom.classList.add('x-output');
    outputDom.textContent = ' ';

    if (this.isRoot)
      outputDom.classList.add('hide');

    this.domElement.appendChild(outputDom);*/


    /*outputDom.onclick = function(e){
      if (mouse.currentInput && !that.ownsInput(mouse.currentInput)){
        that.connectTo(mouse.currentInput);
        mouse.currentInput = undefined;
      }

      e.stopPropagation();
    };*/

  }
  // Class defining the connection between two NodeConnectors

  function NodeConnection(options){
      this.start = null; // NodeConnector of the start
      this.end = null; // NodeConnector of the end

      for (var prop in options)
          if (this.hasOwnProperty(prop))
              this[prop] = options[prop];

      this.path = document.createElementNS(svg.ns, 'path');
      this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
      this.path.setAttributeNS(null, 'stroke-width', '3');
      this.path.setAttributeNS(null, 'fill', 'none');
      this.path.setAttributeNS('hover', 'stroke-width', '6');
      this.path.onmouseover = function(e){
          this.setAttributeNS(null, 'stroke', '#FFFFFF');
          this.setAttributeNS(null, 'stroke-width', '4');
      }
      this.path.onmouseout = function(e){
          this.setAttributeNS(null, 'stroke', '#8e8e8e');
          this.setAttributeNS(null, 'stroke-width', '3');
      }
      this.path.onclick = function(){
          this.remove();
      }
      svg.appendChild(this.path);
  }

  NodeConnection.prototype.update = function()
  {
      if (this.start && this.end){
        var pathStr = createPath(this.start.getAttachPoint(), this.end.getAttachPoint());
        this.path.setAttributeNS(null, 'd', pathStr);
        if (this.start.node.hidden || this.end.node.hidden){
            this.path.style.visibility = "hidden";
        }
        else{
            this.path.style.visibility = "visible";
        }
      }
  }

  NodeConnection.prototype.remove = function()
  {
      if (this.start){
          for (var i = 0; i < this.start.connections.length; i++){
            if(this.start.connections[i] == this)
            {
                this.start.connections.splice(i, 1);
            }
          }
      }

      if (this.end){
          for (var i = 0; i < this.end.connections.length; i++){
            if(this.end.connections[i] == this)
            {
                this.end.connections.splice(i, 1);
            }
          }
      }

      this.path.removeAttribute('d');
  }

  // Class defining a connector pin on a Node

  function NodeConnector(options){


    this.name = '';
    this.type = 'connection';
    this.input = true;
    this.list = true;
    this.singleConnection = false;
    this.typeWhitelist = '';

    this.valueType = 'bool';

    this.connections = [];

    this.node = undefined;

    for (var prop in options)
      if (this.hasOwnProperty(prop))
        this[prop] = options[prop];

    this.domElement = document.createElement('div');
    this.domElement.textContent = this.name;
    this.domElement.title = this.name;
    this.domElement.classList.add('x-connector');



    pinElement = document.createElement('div');
    pinElement.classList.add('x-inputPin');


    if (this.type == "execute")
    {
        this.domElement.classList.add('x-executeConnector');
        pinElement.classList.add('x-executePin');
    }

    if (this.list == true)
    {

        if (this.input)
        {
            this.domElement.classList.add('x-listInput');
            pinElement.classList.add('x-inputPinLeft');
        }
        else
        {
            this.domElement.classList.add('x-listOutput');
            pinElement.classList.add('x-inputPinRight');
        }

        this.domElement.classList.add('empty');
    }
    else
    {


        if (this.input == true)
        {
            this.domElement.classList.add('x-connectorLeft');
            pinElement.classList.add('x-inputPinLeft');
        }
        else
        {
            this.domElement.classList.add('x-connectorRight');
            pinElement.classList.add('x-inputPinRight');
        }
    }

    pinElement.onclick = function(e){
        if (mouse.currentConnection){
            var allowed = false;
            if (mouse.currentConnection.start && mouse.currentConnection.start.input != that.input && mouse.currentConnection.start.type == that.type){
                allowed = true;
            }
            if (mouse.currentConnection.end && mouse.currentConnection.end.input != that.input && mouse.currentConnection.end.type == that.type){
                allowed = true;
            }
            if (allowed)
            {
                if (mouse.currentConnection.start && mouse.currentConnection.start.singleConnection && mouse.currentConnection.start.connections.length > 0 && mouse.currentConnection.start.connections[0].end){
                    mouse.currentConnection.start.connections[0].remove();
                }
                if (mouse.currentConnection.end && mouse.currentConnection.end.singleConnection && mouse.currentConnection.end.connections.length > 0 && mouse.currentConnection.end.connections[0].start){
                    mouse.currentConnection.end.connections[0].remove();
                }
                if (that.singleConnection && that.connections.length > 0){
                    that.connections[0].remove();
                }

                if (!mouse.currentConnection.end)
                    mouse.currentConnection.end = that;
                else
                    mouse.currentConnection.start = that;
                that.connections.push(mouse.currentConnection);
                that.node.updatePosition();
            }
            else
            {
                mouse.currentConnection.path.removeAttribute('d');
            }
            mouse.currentConnection = null;
        }
        else
        {
            var start = null;
            var end = null;
            if (that.input){
                end = that;
            }
            else {
                start = that;
            }
            var connection = new NodeConnection({start: start, end: end});
            that.connections.push(connection);
            mouse.currentConnection = connection;
        }



        mouse.currentInput = that;
        e.stopPropagation();
    }

    this.domElement.appendChild(pinElement);

    var that = this;
    if (this.type == 'input'){
      var input = document.createElement('input');
      Object.defineProperty(that, 'value', {
        get: function(){ return input.value; },
        set: function(val){ input.value = val },
        enumerable: true
      });
      this.domElement.textContent += ' ';
      this.domElement.appendChild(input);
    }

    /*if (this.type == 'connection'){
      this.domElement.onclick = function(e){
        if (mouse.currentInput){
          if (mouse.currentInput.path.hasAttribute('d'))
            mouse.currentInput.path.removeAttribute('d');
          if (mouse.currentInput.node){
            mouse.currentInput.node.detachInput(mouse.currentInput);
            mouse.currentInput.node = undefined;
          }
        }

        mouse.currentInput = that;
        if (that.node){
          that.node.detachInput(that);
          that.domElement.classList.remove('filled');
          that.domElement.classList.add('empty');
        }

        e.stopPropagation();
      };
    }*/
  }

  NodeConnector.prototype = {
    getAttachPoint: function(){
      var pin = this.domElement.getElementsByClassName("x-inputPin")[0];
      var offset = getFullOffset(pin);
      return {
        /*x: offset.left + this.domElement.offsetWidth - 2,
        y: offset.top + this.domElement.offsetHeight / 2*/
        x: offset.left + pin.offsetWidth / 2,
        y: offset.top + pin.offsetHeight / 2
      };
    },
    removeConnection: function(connection){
        connection.remove();
    },
    removeAllConnections: function(){
        for (var i = 0; i < this.connections.length; i++){
            this.connections[i].remove();
        }
    },
    update: function(){
        for (var i = 0; i < this.connections.length; i++){
            this.connections[i].update();
        }
    }
  };

  Node.prototype = {

    generate: function(){

    },

    detachInput: function(input){
      var index = -1;
      for (var i = 0; i < this.attachedPaths.length; i++){
        if (this.attachedPaths[i].input == input)
          index = i;
      }

      if (index >= 0){
        this.attachedPaths[index].path.removeAttribute('d');
        this.attachedPaths[index].input.node = undefined;
        this.attachedPaths.splice(index, 1);
      }

      if (this.attachedPaths.length <= 0)
        this.domElement.classList.remove('connected');
    },
    updatePosition: function(){
      //var outputPt = this.getOutputPoint();
        for (var i = 0; i < this.connectors.length; i++){
            this.connectors[i].update();
        }

      /*for (var i = 0; i < this.attachedPaths.length; i++){
        var inputPt = this.attachedPaths[i].input.getAttachPoint();
        var pathStr = createPath(inputPt, outputPt);
        this.attachedPaths[i].path.setAttributeNS(null, 'd', pathStr);
      }

      for (var j = 0; j < this.inputs.length; j++){
        if (this.inputs[j].node === undefined) continue;

        var inputPt = this.inputs[j].getAttachPoint();
        var outputPt = this.inputs[j].node.getOutputPoint();

        var pathStr = createPath(inputPt, outputPt);
        this.inputs[j].path.setAttributeNS(null, 'd', pathStr);
      }*/
    },
    showProperties: function(){
        //console.log("showProperties");
				$('#setNameForm').show();
    },
    zoomInNode: function(){
        //console.log("zoomInNode");
    },
    connectTo: function(input){
      input.node = this;
      this.connected = true;
      this.domElement.classList.add('connected');

      input.domElement.classList.remove('empty');
      input.domElement.classList.add('filled');

      this.attachedPaths.push({
        input: input,
        path: input.path
      });

      var inputPt = input.getAttachPoint();
      var outputPt = this.getOutputPoint();

      var pathStr = createPath(inputPt, outputPt);
      input.path.setAttributeNS(null, 'd', pathStr);
    },
    moveTo: function(point){
      this.domElement.style.top = point.y + 'px';
      this.domElement.style.left = point.x + 'px';
      this.updatePosition();
    },
    initUI: function(){
      var that = this;

      _$(this.domElement).draggable({
        containment: document.getElementById("node-window"),
        cancel: '.x-connection, .x-output, .x-input',
        /*drag: function(e, ui){
          that.updatePosition();
        }*/
          drag: hitch(this, "updatePosition")
      });

      this.domElement.style.position = 'absolute';
      document.body.appendChild(this.domElement);
      this.updatePosition();
    },
    remove: function(){
      for (var i = 0; i < this.connectors.length; i++){
          this.connectors[i].removeAllConnections();
      }
      this.domElement.remove();
      for (var i = 0; i < currentView.length; i++){
          if (currentView[i] == this){
              currentView.splice(i, 1);
          }
      }
    },
    hideNode: function(){
        this.domElement.style.visibility = "hidden";
        this.hidden = true;
        this.updatePosition();
    },
    showNode: function(){
        this.domElement.style.visibility = "visible";
        this.hidden = false;
        this.updatePosition();
    }
  };

  function ClassNode(options){
    Node.call(this, options);
		
		var para = document.createElement("P");
		var t = document.createTextNode(this.name);
		para.appendChild(t);
		para.classList.add('titleText');

		// this.domElement.appendChild(document.createTextNode(this.name));
		this.domElement.appendChild(para);
    this.attachedPaths = [];
    this.connected = false;

    this.methods = [];

    this.parentConnector = new NodeConnector({name: 'Parent', input: true, list: false, singleConnection: true, node: this});
    this.childConnector = new NodeConnector({name: 'Child', input: false, list: false, singleConnection: false, node: this});

    this.domElement.appendChild(this.parentConnector.domElement);
    this.domElement.appendChild(this.childConnector.domElement);

    this.connectors.push(this.parentConnector);
    this.connectors.push(this.childConnector);

    var constructor = new MethodConstructorNode({class: this});
    constructor.initUI();
    constructor.moveTo({x:300, y: 400});
    constructor.hideNode();
    this.methods.push(constructor);


    classNodes.push(this);
  }

  function StatementStartNode(options){
      options.noDelete = true;
      options.start = true;
      StatementNode.call(this, options);
      //this.domElement.appendChild(document.createTextNode("Start"));

      //var startConnector = new NodeConnector({name: 'exec', input: false, list: false, singleConnection: true, node: this});

      //this.domElement.appendChild(startConnector.domElement);

      //this.connectors.push(startConnector);
  }

  function MethodNode(options){
      Node.call(this, options);
      this.domElement.classList.add("titleBar");
      this.inputs = [];
      this.statements = [];
      this.startStatement = new StatementStartNode({name: "Start"});
      this.startStatement.initUI();
      this.startStatement.moveTo({x:200, y: 200});
      this.startStatement.hideNode();
      this.statements.push(this.startStatement);
      this.class = options.class;
  }

  function MethodConstructorNode(options){
      options.noDelete = true;
      options.name = 'Constructor';
      MethodNode.call(this, options);
  }


  function StatementNode(options){
      Node.call(this, options);
      this.method = null;
      this.inputs = [];
      this.nextStatement = new NodeConnector({name: "next", singleConnection: true, list: false, input: false, type: "execute", node: this});
      if (!options.start){
          this.prevStatement = new NodeConnector({name: "prev", singleConnection: false, list: false, input: true, type: "execute", node: this});
          this.connectors.push(this.prevStatement);
           this.domElement.appendChild(this.prevStatement.domElement);
      }

      this.domElement.appendChild(this.nextStatement.domElement);
      this.domElement.classList.add("titleBar");

      this.connectors.push(this.nextStatement);
  }

  function ExpressionNode(options){
      Node.call(this, options);

      this.domElement.classList.add("titleBar");

      this.expressionResult = new NodeConnector({name: "result", singleConnection: false, list: false, input: false, type: "connection", node: this});
      this.connectors.push(this.expressionResult);
      this.domElement.appendChild(this.expressionResult.domElement);
  }

  ClassNode.prototype = Object.create(Node.prototype);
  ClassNode.prototype.constructor = ClassNode;


  MethodNode.prototype = Object.create(Node.prototype);
  MethodNode.prototype.constructor = MethodNode;

  StatementNode.prototype = Object.create(Node.prototype);
  StatementNode.prototype.constructor = StatementNode;

  ExpressionNode.prototype = Object.create(Node.prototype);
  ExpressionNode.prototype.constructor = ExpressionNode;

  ClassNode.prototype.generate = function(){
      var parentNodeName = null;
      for(var i = 0; i < this.connectors.length; i++){
         if(this.connectors[i].input){
             if (this.connectors[i].connections.length > 0){
                parentNodeName = this.connectors[i].connections[0].start.node.name;
             }
         }
      }
      var output = {cpp: "", h: ""};
      output.cpp += "//Generated using node++\n";
      output.cpp += '#include "'+this.name+'.h"\n';
      output.cpp += "\nusing namespace std;\n";
      for (var i = 0; i < this.methods.length; i++){
          output.cpp += "\n" + this.methods[i].generate().cpp + "\n";
      }

      output.h += "//Generated using node++\n";
      output.h += "#pragma once\n\n";
      output.h += "#include <iostream>\n";
      if(parentNodeName != null){
           output.h += '#include "'+parentNodeName+'.h"\n'
           //output = "//Generated using node++\n"// #include \"" + parentNodeName + ".h\"\n class " + this.name + " : " + parentNodeName + "{\n";

      }
      output.h += "class "+this.name;
      if(parentNodeName != null){
          output.h += " : "+parentNodeName;
      }
      output.h += "\n{\n";
      output.h += "\tpublic:\n";
      for (var i = 0; i < this.methods.length; i++){
          output.h += "\t\t" + this.methods[i].generate().h + "\n";
      }
      output.h += "};";
      return output;
  }

  ClassNode.prototype.getAllMethods = function() {
    var functions = {};

    if (this.parentConnector && this.parentConnector.connections.length > 0)
    {
        functions = this.parentConnector.connections[0].start.node.getAllMethods();
    }
    for (var i = 0; i < this.methods.length; i++){
        functions[this.methods[i].name] = this.methods[i];
    }

    return functions;
  }

  MethodNode.prototype.generate = function(){
      output = {h: "", cpp: ""};
      returnType = "void";
      for (var i = 0; i < this.connectors.length; i++){
          if (!this.connectors[i].input && this.connectors[i].type == "returnType"){
              returnType = this.connectors[i].valueType;
          }
      }
      output.cpp += returnType+" "+this.class.name+"::"+this.name+"(";
      for (var i = 0; i < this.connectors.length; i++){
          if (this.connectors[i].input && this.connectors[i].type == "parameter"){
              output.cpp += this.connectors[i].valueType+" "+this.connectors[i].name;
              if(i != this.connectors.length-1){
                  output.cpp += ", ";
              }
          }
      }
      output.cpp += ")\n";
      output.cpp += "{\n";
      var statements = this.startStatement.generate();
      for (var i = 0; i < statements.length; i++){
          if (statements[i] != ""){
            output.cpp += "\t"+statements[i];
          }
      }
      output.cpp += "}";

      output.h += returnType+" "+this.name+"(";
      for (var i = 0; i < this.connectors.length; i++){
          if (this.connectors[i].input && this.connectors[i].type == "parameter"){
              output.h += this.connectors[i].valueType+" "+this.connectors[i].name;
              if(i != this.connectors.length-1){
                  output.h += ", ";
              }
          }
      }
      output.h += ");";
      return output;
  }

  MethodNode.prototype.zoomInNode = function(){
      hideViewedNodes();
      currentMethod = this;

      for (var i = 0; i < this.statements.length; i++){
          currentView.push(this.statements[i]);
          this.statements[i].showNode();
      }

      $( "#methodView").closest('li').show();
      $('.addMethod').hide();
      $('.addStatement').show();
      //document.getElementById("classView").show();
      document.getElementById("methodView").parentElement.classList.add("active");

      document.getElementById("classView").parentElement.classList.remove("active");
  }

  ClassNode.prototype.getChildPinPoint = function(){
      var fchild = this.domElement.firstElementChild;
      var offset = getFullOffset(fchild);
      return {
        x: offset.left + fchild.offsetWidth / 2,
        y: offset.top + fchild.offsetHeight / 2
      };
    }

  ClassNode.prototype.getParentPinPoint = function(){
      var fchild = this.domElement.firstElementChild;
      var offset = getFullOffset(fchild);
      return {
        x: offset.left + fchild.offsetWidth / 2,
        y: offset.top + fchild.offsetHeight / 2
      };
    }

	MethodNode.prototype.showProperties = function(){
		updateDiv(this.name);
	}

  ClassNode.prototype.remove = function(){
      Node.prototype.remove.call(this);
      for (var i = 0; i < classNodes.length; i++){
          if (classNodes[i] == this){
              classNodes.splice(i,1);
          }
      }
  }

  ClassNode.prototype.zoomInNode = function(){
      hideViewedNodes();

      for (var i = 0; i < this.methods.length; i++){
          currentView.push(this.methods[i]);
          this.methods[i].showNode();
      }

      currentClass = this;

      $( "#classView").closest('li').show();
      $('.addClass').hide();
      $('.addMethod').show();
      //document.getElementById("classView").show();
      document.getElementById("classView").parentElement.classList.add("active");

      document.getElementById("hierarchyView").parentElement.classList.remove("active");
  }

  StatementNode.prototype.generate = function(){
      var result = ["\n"];
      if (this.nextStatement.connections.length > 0){
          result = this.nextStatement.connections[0].end.node.generate();
      }
      return result;
  }

  StatementNode.prototype.addConnector = function(name, type, valueType, input){
      var options = {};
      options.name = name;
      type === undefined ? true : options.type = type;
      valueType === undefined ? true : options.valueType = valueType;
      input === undefined ? true : options.input = input;

      var input = new NodeConnector(options);
      //this.inputs.push(input);
      this.domElement.appendChild(input.domElement);
      this.connectors.push(input);
      return input;
  }

  StatementNode.prototype.ownsInput = function(input){
      for (var i = 0; i < this.inputs.length; i++){
        if (this.inputs[i] == input)
          return true;
      }

      return false;
  }

  MethodNode.prototype.addInput = function(name, type){
      var input = new NodeConnector({name: type + ' ' + name, typeWhitelist: type});
      this.inputs.push(input);
      this.domElement.appendChild(input.domElement);
  }

  MethodConstructorNode.prototype = Object.create(MethodNode.prototype);
  MethodConstructorNode.prototype.constructor = MethodConstructorNode;

  MethodConstructorNode.prototype.generate = function(){
      output = {h: "", cpp: ""};
      output.cpp += this.class.name+"::"+this.name+"(";
      for (var i = 0; i < this.connectors.length; i++){
          if (this.connectors[i].input && this.connectors[i].type == "parameter"){
              output.cpp += this.connectors[i].valueType+" "+this.connectors[i].name;
              if(i != this.connectors.length-1){
                  output.cpp += ", ";
              }
          }
      }
      output.cpp += ")\n";
      output.cpp += "{\n";
      var statements = this.startStatement.generate();
      for (var i = 0; i < statements.length; i++){
          output.cpp += "\t"+statements[i];
      }
      output.cpp += "}";
      output.h += this.class.name+"(";
      for (var i = 0; i < this.connectors.length; i++){
          if (this.connectors[i].input && this.connectors[i].type == "parameter"){
              output.h += this.connectors[i].valueType+" "+this.connectors[i].name;
              if(i != this.connectors.length-1){
                  output.h += ", ";
              }
          }
      }
      output.h += ");";
      return output;
  }

  StatementStartNode.prototype = Object.create(StatementNode.prototype);
  StatementStartNode.prototype.constructor = StatementStartNode;

  function IfStatementNode(options){
      StatementNode.call(this, options);

      this.trueExec = new NodeConnector({name: "true", input: false, list: true, singleConnection: true, type: 'execute', node: this});
      this.elseExec = new NodeConnector({name: "else", input: false, list: true, singleConnection: true, type: 'execute', node: this});
      this.condition = new NodeConnector({name: "condition", input: true, list: true, singleConnection: true, type: 'connection', node: this, valueType: 'expression'});

      this.domElement.appendChild(this.trueExec.domElement);
      this.connectors.push(this.trueExec);

      this.domElement.appendChild(this.elseExec.domElement);
      this.connectors.push(this.elseExec);

      this.domElement.appendChild(this.condition.domElement);
      this.connectors.push(this.condition);
  }

  IfStatementNode.prototype = Object.create(StatementNode.prototype);
  IfStatementNode.prototype.constructor = IfStatementNode;

  IfStatementNode.prototype.generate = function(){
      var result = [];
      var condition = "";
      if (this.condition.connections.length > 0){
        condition = this.condition.connections[0].start.node.generate();
      }
      result.push("if ("+condition+")\n");
      result.push("{\n");
      var trueExec = ["\n"];
      if (this.trueExec.connections.length > 0){
        trueExec = this.trueExec.connections[0].end.node.generate();
      }
      for (var i = 0; i < trueExec.length; i++){
          result.push("\t"+trueExec[i]);
      }
      result.push("}\n");
      if (this.elseExec.connections.length > 0){
          var elseExec = this.elseExec.connections[0].end.node.generate();
          result.push("else\n");
          result.push("{\n");
          for (var i = 0; i < elseExec.length; i++){
            result.push("\t"+elseExec[i]);
          }
          result.push("}\n");
      }
      var nextResult = StatementNode.prototype.generate.call(this);
      for (var i = 0; i < nextResult.length; i++){
          result.push(nextResult[i]);
      }
      return result;

  }

  function ExpressionExecuteStatement(options){

  }

  function FunctionCallExpressionNode(options){
      ExpressionNode.call(this, options);
  }

  FunctionCallExpressionNode.prototype = Object.create(ExpressionNode.prototype);
  FunctionCallExpressionNode.prototype.constructor = FunctionCallExpressionNode;
    
  FunctionCallExpressionNode.prototype.generate = function(){
      var arguments = "";
      for (var i = 0; i < this.connectors.length; i++){
          if (this.connectors[i].input && this.connectors[i].type != 'execute'){
              if (this.connectors[i].connections.length > 0){
                  arguments += this.connectors[i].connections[0].start.node.generate();
                  if (i != this.connectors.length - 1){
                      arguments += ", "
                  }
              }
          }
      }
      return this.name+"("+arguments+")";
  }
    

  sys.ClassNode = ClassNode;
  sys.MethodNode = MethodNode;
  sys.StatementNode = StatementNode;
  sys.IfStatementNode = IfStatementNode;
  sys.FunctionCallExpressionNode = FunctionCallExpressionNode;
    
  
})(NodePP, jQuery);
