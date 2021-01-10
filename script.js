function loadFile(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);

    var rotated = document.getElementById('detected');
    rotated.src = image.src;
}