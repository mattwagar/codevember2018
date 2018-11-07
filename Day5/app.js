var gl;

  /*========================= CAPTURE MOUSE EVENTS ========================= */

//   var AMORTIZATION=0.95;
//   var drag=false;
//   var old_x, old_y;
//   var dX=0, dY=0;

//   var mouseDown=function(e) {
//     drag=true;
//     old_x=e.pageX, old_y=e.pageY;
//     e.preventDefault();
//     return false;
//   };

//   var mouseUp=function(e){
//     drag=false;
//   };

//   var mouseMove=function(e) {
//     if (!drag) return false;
//     dX=(e.pageX-old_x)*Math.PI/CANVAS.width,
//       dY=(e.pageY-old_y)*Math.PI/CANVAS.height;
//     THETA+=dX;
//     PHI+=dY;
//     old_x=e.pageX, old_y=e.pageY;
//     e.preventDefault();
//   };

//   CANVAS.addEventListener("mousedown", mouseDown, false);
//   CANVAS.addEventListener("mouseup", mouseUp, false);
//   CANVAS.addEventListener("mouseout", mouseUp, false);
//   CANVAS.addEventListener("mousemove", mouseMove, false);

var InitDemo = function () {
    loadTextResource('shader.vs.glsl', function (vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader (see console)');
            console.error(vsErr);
        } else {
            loadTextResource('shader.fs.glsl', function (fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader (see console)');
                    console.error(fsErr);
                } else {
                    loadJSONResource('spaceship.json', function (modelErr, modelObj) {
                        if (modelErr) {
                            alert('Fatal error getting Susan model (see console)');
                            console.error(fsErr);
                        } else {
                            loadImage('spaceship_texture.png', function (imgErr, img) {
                                if (imgErr) {
                                    alert('Fatal error getting Susan texture (see console)');
                                    console.error(imgErr);
                                } else {
                                    RunDemo(vsText, fsText, img, modelObj);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

var RunDemo = function (vertexShaderText, fragmentShaderText, image, model3d) {
    console.log("This is working");

    var canvas = document.getElementById('my-canvas');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log("WebGL is not supported on your browser. Using Experimental WebGL")
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser down not support WebGL');
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0,0, window.innerWidth, window.innerHeight) //Important for whenever you dynamically resize in code

    gl.clearColor(0.75, 0.8, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    //
    //create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader))
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create buffer
    //
    var modelVertices = model3d.meshes[0].vertices;
    var modelIndices = [].concat.apply([], model3d.meshes[0].faces);
    var modelTexCoords = model3d.meshes[0].texturecoords[0];
    var modelNormals = model3d.meshes[0].normals;

    var modelPosVartexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelPosVartexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVertices), gl.STATIC_DRAW);

    var modelTexCoordVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelTexCoords), gl.STATIC_DRAW);

    var modelIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelIndices), gl.STATIC_DRAW);

    var modelNormalBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelNormals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelPosVartexBufferObject);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, //Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
        0 // Offset form the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelTexCoordVertexBufferObject);
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        texCoordAttribLocation, //Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT // Offset form the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(texCoordAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, modelNormalBufferObject);
    var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalAttribLocation, //Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.TRUE, //normalized so between 0 and 1
        3 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT // Offset form the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(normalAttribLocation);

    //
    // Create texture
    //
    var modelTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, modelTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // S means U
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // T means V
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
        image);

    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocaiton = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocaiton = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 5, -15], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocaiton, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocaiton, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //
    //Lighting info
    //

    gl.useProgram(program);

    var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
    // var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
    // var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');
    var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');
    var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');

    gl.uniform3f(ambientUniformLocation, 0.3, 0.3, 0.3);
    gl.uniform3f(sunlightDirUniformLocation, 1.0, 4.0, 2.0);
    gl.uniform3f(sunlightIntUniformLocation, 0.6, 0.6, 0.6);

    //
    // Main render loop
    //
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(xRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(yRotationMatrix, identityMatrix, angle / 5, [-1, 0, 0]);
        mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.60, 0.75, 0.7, 1.0);
        gl.clear(gl.DPETH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, modelTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0); //uses all actively bound buffers which is currently only the vertex buffer

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);


};


