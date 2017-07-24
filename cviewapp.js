// var class1 = new ClassNode("option1");
// var class2 = new ClassNode("option2");
// var class3 = new ClassNode("option3")
//
//associative array of files
var files = {};
//  var val = 2;
// arr[name]  = val;
var activeFile = "";

generateFiles = function(){
    //generate files for each classNode
    if (classNodes != null) {
      $('#fileButtonGroup').empty();
      files = {};

        classNodes.forEach(function(classNode, index) {
            var classFile = classNode.generate();
            addFile(classNode.name, ".cpp", classFile.cpp);
            saveFile(classNode.name + ".cpp", classFile.cpp)
            addFile(classNode.name, ".h", classFile.h);
            saveFile(classNode.name + ".h", classFile.h)
        });
    }
}

function addFile(name, extension, contents) {
  $('#fileButtonGroup').append($(
    '<div class="btn-group"><button class="btn btn-default loadFile" type="button">' + name + extension + '</button><button type="button" id="removeFile" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button></div>'
  ));

  $('#file-name').val('');
  files[name] = ""; //add file name to file array
  activeFile = name;
  $('#activeFile').text("Editing file: " + name);
  $('#saveFile').show();
  editor.setValue(contents);
}

function saveFile(name, contents) {
      files[name] = contents
}

function deleteFile(name) {

}

//ace_text-input

  //ADD FILE
  $( "#addFile" ).click(function() {
    if($('#file-name').val()) {
      addFile($('#file-name').val(), "", "");
    }
    else {
      alert('Please specify a filename');
    }
  });

//DELETE FILE
  $("#fileButtonGroup").on("click", "button.btn-danger", function(){
    var name = $(this).prev().text();
    delete files[name];
    $(this).closest(".btn-group").remove();

    if (activeFile == name) {
      $('#activeFile').text("");
      $('#saveFile').hide();
      $('#fileSaved').hide();
      editor.setValue();
    }

  });

//SAVE FILE
  $( "#saveFile" ).click(function() {
    saveFile(activeFile, editor.getValue());
    $('#fileSaved').show();
  });

//LOAD FILE
$("#fileButtonGroup").on("click", "button.loadFile", function(){
  var name = $(this).text();
  activeFile = name;
  $('#fileSaved').hide();
  $('#saveFile').show();
  $('#activeFile').text("Editing file: " + name);
  editor.setValue(files[name]);
});
